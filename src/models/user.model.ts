import {Entity, hasMany, model, property} from '@loopback/repository';
import {PokemonLike} from './pokemon-like.model';

@model()
export class User extends Entity {
    @property({
        type: 'string',
        required: true,
    })
    email: string;

    @property({
        type: 'string',
        required: true,
    })
    first_name: string;

    @property({
        type: 'string',
        required: true,
    })
    last_name: string;

    @property({
        type: 'string',
        required: true,
    })
    password: string;

    @property({
        type: 'string',
        id: true,
        generated: true,
    })
    id?: string;

    @hasMany(() => PokemonLike, {keyTo: 'user_id'})
    pokemonLikes: PokemonLike[];

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {
    // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
