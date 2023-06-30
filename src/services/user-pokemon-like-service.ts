import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {PokemonLike} from '../models';
import {PokemonLikeRepository, UserRepository} from '../repositories';
import {ResponseMessageI} from './interface';

export class UserPokemonLikeService {
    constructor(
        @repository(UserRepository) protected userRepository: UserRepository,
        @repository(PokemonLikeRepository) protected pokemonLikeRepository: PokemonLikeRepository,
    ) { }

    getUserPokemonLike(id: string): Promise<PokemonLike[]> {
        return this.userRepository.pokemonLikes(id).find();
    }

    async createUserPokemonLike(pokemonLike: Omit<PokemonLike, 'id'>): Promise<PokemonLike> {
        const {user_id, pokemon_id} = pokemonLike;
        await this.findOneUserId(user_id);
        await this.findOnePokemonLikeByPokemonId(pokemon_id);
        return this.pokemonLikeRepository.create(pokemonLike)
    }

    async findOneUserId(user_id: string) {
        const user = await this.userRepository.findById(user_id);
        if (!user)
            throw new HttpErrors.NotFound('User not found');
        return user;
    }

    async findOnePokemonLikeByPokemonId(pokemonLikeId: string) {
        const pokemonLike = await this.pokemonLikeRepository.findOne({where: {pokemon_id: pokemonLikeId}});
        if (pokemonLike)
            throw new HttpErrors.BadRequest('This pokemon is already in your likes');
        return pokemonLike;
    }

    async deleteUserPokemonLike(pokemonLikeId: string): Promise<ResponseMessageI> {
        await this.pokemonLikeRepository.deleteById(pokemonLikeId)
        return {message: 'Like deleted.'}
    }
}

