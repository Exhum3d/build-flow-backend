import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ConnectedUser } from './entities/connected-user.entity';
import { IConnectedUser } from './entities/connected-user.interface';
import { IUser } from 'src/users/user.interface';
import { JoinedRoom } from './entities/joined-room.entity';
import { IJoinedRoom } from './entities/joined-room.interface';
import { IRoom } from './entities/room.interface';
import { IMessage } from './entities/message.interface';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Room } from './entities/room.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ConnectedUser)
    private readonly connectedUserRepository: Repository<ConnectedUser>,
    @InjectRepository(JoinedRoom)
    private readonly joinedRoomRepository: Repository<JoinedRoom>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  decodeJwtToken(token: string): any {
    try {
      const decodedJwtToken = jwt.verify(token, 'LICENTA');
      return decodedJwtToken;
    } catch (error) {
      throw new Error('Token invalid');
    }
  }

  async createConnectedUser(
    connectedUser: IConnectedUser,
  ): Promise<IConnectedUser> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findConnectedUserByUser(user: IUser): Promise<IConnectedUser[]> {
    return this.connectedUserRepository.find({ where: { id: user.id } });
  }

  async deleteConnectedUserBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }

  async deleteAllConnectedUsers() {
    await this.connectedUserRepository.createQueryBuilder().delete().execute();
  }

  async createJoinedRoom(joinedRoom: IJoinedRoom): Promise<IJoinedRoom> {
    return this.joinedRoomRepository.save(joinedRoom);
  }

  async findJoinedRoomByUser(user: IUser): Promise<IJoinedRoom[]> {
    return this.joinedRoomRepository.find({ where: { user: { id: user.id } } });
  }

  async findByRoom(room: IRoom): Promise<IJoinedRoom[]> {
    const foundByRoom = await this.joinedRoomRepository.find({
      where: { room: { id: room.id } },
    });
    console.log('found by room', foundByRoom);
    return foundByRoom;
  }

  async deleteJoinedRoomBySocketId(socketId: string) {
    return this.joinedRoomRepository.delete({
      socketId,
    });
  }

  async deleteAllJoinedRooms() {
    await this.joinedRoomRepository.createQueryBuilder().delete().execute();
  }

  async createMessage(message: IMessage): Promise<IMessage> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForRoom(
    room: IRoom,
    options: IPaginationOptions,
  ): Promise<Pagination<IMessage>> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.room', 'room')
      .where('room.id = :roomId', { roomId: room.id })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.created_at', 'DESC');

    return paginate(query, options);
  }
  async createRoom(room: IRoom, creator: IUser): Promise<IRoom> {
    const newRoom = await this.addCreatorToRoom(room, creator);
    return this.roomRepository.save(newRoom);
  }

  async getRoom(roomId: string): Promise<IRoom> {
    return this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users'],
    });
  }

  async getRoomsForUser(
    userId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<IRoom>> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updated_at', 'DESC');

    return paginate(query, options);
  }

  async addCreatorToRoom(room: IRoom, creator: IUser): Promise<IRoom> {
    room.users.push(creator);
    return room;
  }
}
