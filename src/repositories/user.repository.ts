import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MongoDatasourceDataSource} from '../datasources';
import {PokemonLike, User, UserRelations} from '../models';
import {PokemonLikeRepository} from './pokemon-like.repository';

export type Credentials = {
  email: string;
  password: string;
}
export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly pokemonLikes: HasManyRepositoryFactory<PokemonLike, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongoDatasource') dataSource: MongoDatasourceDataSource, @repository.getter('PokemonLikeRepository') protected pokemonLikeRepositoryGetter: Getter<PokemonLikeRepository>,
  ) {
    super(User, dataSource);
    this.pokemonLikes = this.createHasManyRepositoryFactoryFor('pokemonLikes', pokemonLikeRepositoryGetter,);
    this.registerInclusionResolver('pokemonLikes', this.pokemonLikes.inclusionResolver);
  }
}
