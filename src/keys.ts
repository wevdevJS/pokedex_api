import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {User} from './models';
import {Credentials} from './repositories/user.repository';
import {PasswordHasher} from './services/hash.password';
import {UserPokemonLikeService} from './services/user-pokemon-like-service';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = '9kaksjh2222';
  export const TOKEN_EXPIRES_IN_VALUE = '24h';
}
export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expiresIn',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.jwt.service',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.rounds');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<Credentials, User>>(
    'services.user.service',
  );
}


export namespace Services {
  export const USER_POKEMON_LIKE = BindingKey.create<UserPokemonLikeService>(
    'services.user.pokemon.like.service',
  );
}
