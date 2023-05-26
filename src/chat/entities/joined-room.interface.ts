import { IUser } from 'src/users/user.interface';
import { IRoom } from './room.interface';

export interface IJoinedRoom {
  id?: string;
  socketId: string;
  user: IUser;
  room: IRoom;
}
