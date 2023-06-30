import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
    repository
} from '@loopback/repository';
import {
    del,
    get,
    getModelSchemaRef,
    param,
    post,
    requestBody
} from '@loopback/rest';
import {Services} from '../keys';
import {
    PokemonLike
} from '../models';
import {PokemonLikeRepository, UserRepository} from '../repositories';
import {ResponseMessageI} from '../services/interface';
import {UserPokemonLikeService} from '../services/user-pokemon-like-service';

export class UserPokemonLikeController {
    constructor(
        @repository(UserRepository) protected userRepository: UserRepository,
        @repository(PokemonLikeRepository) protected pokemonLikeRepository: PokemonLikeRepository,
        @inject(Services.USER_POKEMON_LIKE)
        public userPokemonLikeService: UserPokemonLikeService,
    ) { }

    @authenticate("jwt")
    @get('/users/{id}/pokemon-likes', {
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '200': {
                description: 'Array of User has many PokemonLike',
                content: {
                    'application/json': {
                        schema: {type: 'array', items: getModelSchemaRef(PokemonLike)},
                    },
                },
            },
        },
    })
    async find(
        @param.path.string('id') id: string,
    ): Promise<PokemonLike[]> {
        return this.userPokemonLikeService.getUserPokemonLike(id);
    }

    @authenticate("jwt")
    @post('/users/pokemon-likes', {
        responses: {
            '200': {
                description: 'User model instance',
                content: {'application/json': {schema: getModelSchemaRef(PokemonLike)}},
            },
        },
    })
    async create(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(PokemonLike, {
                        title: 'NewPokemonLikeInUser',
                        exclude: ['id'],
                        optional: ['user_id']
                    }),
                },
            },
        }) pokemonLike: Omit<PokemonLike, 'id'>,
    ): Promise<PokemonLike> {
        return this.userPokemonLikeService.createUserPokemonLike(pokemonLike)
    }

    @authenticate("jwt")
    @del('/users//pokemon-likes/{pokemonLikeId}', {
        responses: {
            '200': {
                description: 'User.PokemonLike DELETE success count',
                content: {
                    'application/json': {
                        schema: {
                            properties: {
                                message: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                },
            },
        },
    })
    async delete(
        @param.path.string('pokemonLikeId') pokemonLikeId: string,
    ): Promise<ResponseMessageI> {
        return this.userPokemonLikeService.deleteUserPokemonLike(pokemonLikeId)
    }
}
