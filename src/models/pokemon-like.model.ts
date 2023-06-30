import {Entity, model, property} from '@loopback/repository';

@model()
export class PokemonLike extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  user_id: string;

  @property({
    type: 'string',
    required: true,
  })
  pokemon_id: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<PokemonLike>) {
    super(data);
  }
}

export interface PokemonLikeRelations {
  // describe navigational properties here
}

export type PokemonLikeWithRelations = PokemonLike & PokemonLikeRelations;
