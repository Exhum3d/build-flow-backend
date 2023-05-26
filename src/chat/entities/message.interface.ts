import { IUser } from 'src/users/user.interface';
import { IRoom } from './room.interface';

export interface IMessage {
  id?: string;
  text: string;
  user: IUser;
  room: IRoom;
  created_at: Date;
  updated_at: Date;
}
