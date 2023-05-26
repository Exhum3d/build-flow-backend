import { IUser } from 'src/users/user.interface';

export interface IRoom {
  id?: string;
  name?: string;
  description?: string;
  users?: IUser[];
  created_at?: Date;
  updated_at?: Date;
}
