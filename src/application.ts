import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {SECURITY_SCHEME_SPEC} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
    RestExplorerBindings,
    RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTStrategy} from './authentication-stratgies/jwt-stratgies';
import {PasswordHasherBindings, Services, TokenServiceBindings, TokenServiceConstants, UserServiceBindings} from './keys';
import {MySequence} from './sequence';
import {BcryptHasher} from './services/hash.password';
import {JWTService} from './services/jwt-service';
import {UserPokemonLikeService} from './services/user-pokemon-like-service';
import {UserService} from './services/user-service';

export {ApplicationConfig};

export class PokedexApiApplication extends BootMixin(
    ServiceMixin(RepositoryMixin(RestApplication)),
) {
    constructor(options: ApplicationConfig = {}) {
        super(options);

        this.setupBinding();

        this.addSecuritySpec();

        this.component(AuthenticationComponent);
        registerAuthenticationStrategy(this, JWTStrategy)

        // Set up the custom sequence
        this.sequence(MySequence);

        // Set up default home page
        this.static('/', path.join(__dirname, '../public'));

        // Customize @loopback/rest-explorer configuration here
        this.configure(RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(RestExplorerComponent);

        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
    setupBinding(): void {
        this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
        this.bind(PasswordHasherBindings.ROUNDS).to(10)
        this.bind(UserServiceBindings.USER_SERVICE).toClass(UserService);
        this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
        this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE)
        this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);
        this.bind(Services.USER_POKEMON_LIKE).toClass(UserPokemonLikeService);
    }
    addSecuritySpec(): void {
        this.api({
            openapi: '3.0.0',
            info: {
                title: 'test application',
                version: '1.0.0',
            },
            paths: {},
            components: {securitySchemes: SECURITY_SCHEME_SPEC},
            security: [
                {
                    jwt: [],
                },
            ],
            servers: [{url: '/'}],
        });
    }
}
