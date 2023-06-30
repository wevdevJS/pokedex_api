import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDatasourceDataSource} from '../datasources';
import {PokemonLike, PokemonLikeRelations} from '../models';

export class PokemonLikeRepository extends DefaultCrudRepository<
  PokemonLike,
  typeof PokemonLike.prototype.id,
  PokemonLikeRelations
> {
  constructor(
    @inject('datasources.mongoDatasource') dataSource: MongoDatasourceDataSource,
  ) {
    super(PokemonLike, dataSource);
  }
}
