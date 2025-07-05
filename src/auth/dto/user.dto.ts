export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  name: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
