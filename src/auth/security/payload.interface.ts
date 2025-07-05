import { Role } from '../entity/user.entity';

export interface Payload {
  id: number;
  name: string;
  email: string;
  role: Role;
}
