// import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {PasswordHasherBindings, TokenServiceBindings} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {BcryptHasher} from './hash.password';
import {LoginResponseI} from './interface';
import {JWTService} from './jwt-service';

export class UserService {
    constructor(
        @repository(UserRepository)
        public userRepository: UserRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public hasher: BcryptHasher,
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public jwtService: JWTService,
    ) { }
    async verifyCredentials(credentials: Credentials): Promise<User> {
        // implement this method
        const foundUser = await this.userRepository.findOne({
            where: {
                email: credentials.email
            }
        });
        if (!foundUser) {
            throw new HttpErrors.NotFound('user not found');
        }
        const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUser.password)
        if (!passwordMatched)
            throw new HttpErrors.Unauthorized('password is not valid');
        return foundUser;
    }
    convertToUserProfile(user: User): UserProfile {
        let userName = `${user.first_name} ${user.last_name}`
        return {
            [securityId]: user.id!.toString(),
            name: userName,
            id: user.id,
            email: user.email
        };
        // throw new Error('Method not implemented.');
    }

    async login(credentials: Credentials): Promise<LoginResponseI> {
        const user = await this.verifyCredentials(credentials);
        const userProfile = await this.convertToUserProfile(user);
        const token = await this.jwtService.generateToken(userProfile);
        return {token: token, id: user.id}
    }

    async create(user: Omit<User, 'id'>): Promise<Partial<User>> {
        const {email, password} = user;
        await this.validateIfUserExist(email)
        this.validateCredentials({email, password});
        user.password = await this.hasher.hashPassword(user.password)
        const savedUser: Partial<User> = await this.userRepository.create(user);
        delete savedUser.password;
        return savedUser;
    }

    async validateIfUserExist(email: string): Promise<void> {
        const user = await this.userRepository.findOne({where: {email}});
        if (user)
            throw new HttpErrors.Conflict('User already registered')
    }

    validateCredentials(credentials: Credentials): void {
        const {email, password} = credentials;
        var validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailMatch = email.match(validRegex);
        if (!emailMatch) {
            throw new HttpErrors.BadRequest('invalid Email');
        }
        if (password.length < 8) {
            throw new HttpErrors.BadRequest('password length should be greater than 8')
        }
    }

}
