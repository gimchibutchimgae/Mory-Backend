/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty } from 'class-validator';
import { Provider } from '../entity/user.entity';
import { Mory } from 'src/mory/entity/mory.entity';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  provider: Provider;
}

export interface UpdateUserDTO {
  name: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface OAuthDTO {
  email: string;
  name: string;
  provider: Provider;
}

export interface InitUserDTO {
  mory: Mory;
}
