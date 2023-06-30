import {inject} from '@loopback/core';
import {
    getModelSchemaRef,
    post,
    requestBody,
    response
} from '@loopback/rest';
import {UserServiceBindings} from '../keys';
import {User} from '../models';
import {Credentials} from '../repositories';
import {UserService} from '../services/user-service';

export class UserController {
    constructor(
        @inject(UserServiceBindings.USER_SERVICE)
        public userService: UserService,
    ) { }

    @post('/users')
    @response(200, {
        description: 'User model instance',
        content: {
            'application/json': {
                schema: getModelSchemaRef(User, {
                    exclude: ['password'],
                })
            }
        },
    })
    async create(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(User, {
                        title: 'NewUser',
                        exclude: ['id'],
                    }),
                },
            },
        })
        user: Omit<User, 'id'>,
    ): Promise<Partial<User>> {
        return this.userService.create(user)
    }

    @post('/login')
    @response(200, {
        description: 'User model instance',
        content: {
            'application/json': {
                schema: {
                    properties: {
                        token: {
                            type: 'string'
                        },
                        id: {
                            type: 'string'
                        }
                    }
                }
            }
        },
    })
    async login(
        @requestBody({
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            email: {
                                type: 'string'
                            },
                            password: {
                                type: 'string'
                            }
                        }
                    },
                },
            },
        }) credentials: Credentials,
    ): Promise<any> {
        return this.userService.login(credentials)
    }


}
