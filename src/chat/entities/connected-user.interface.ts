import { IUser } from 'src/users/user.interface';

export interface IConnectedUser {
  id?: string;
  socketId: string;
  user: IUser;
}
