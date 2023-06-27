import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { IMessage } from './entities/message.interface';
import { IUser } from 'src/users/user.interface';
import { IRoom } from './entities/room.interface';
import { IConnectedUser } from './entities/connected-user.interface';
import { IPage } from './entities/page.interface';
import { IJoinedRoom } from './entities/joined-room.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UsersService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      console.log('On Connect');
      const decodedToken = await this.chatService.decodeJwtToken(
        socket.handshake.headers.authorization,
      );
      const user: IUser = await this.userService.findById(decodedToken.id);
      console.log('user din gateway', user);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.chatService.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        // substract page -1 to match the angular material paginator
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        // Save connection to DB
        await this.chatService.createConnectedUser({
          socketId: socket.id,
          user,
        });
        // Only emit rooms to the specific connected client
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch (error) {
      console.log(error);
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log('On Disconnect');
    await this.chatService.deleteConnectedUserBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: IRoom) {
    const createdRoom: IRoom = await this.chatService.createRoom(
      room,
      socket.data.user,
    );

    for (const user of createdRoom.users) {
      const connections: IConnectedUser[] =
        await this.chatService.findConnectedUserByUser(user);
      const rooms = await this.chatService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });
      // substract page -1 to match the angular material paginator
      rooms.meta.currentPage = rooms.meta.currentPage - 1;
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: IPage) {
    const rooms = await this.chatService.getRoomsForUser(
      socket.data.user.id,
      this.handleIncomingPageRequest(page),
    );
    // substract page -1 to match the angular material paginator
    rooms.meta.currentPage = rooms.meta.currentPage - 1;
    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: IRoom) {
    const messages = await this.chatService.findMessagesForRoom(room, {
      limit: 10,
      page: 1,
    });
    messages.meta.currentPage = messages.meta.currentPage - 1;
    // Save Connection to Room
    await this.chatService.createJoinedRoom({
      socketId: socket.id,
      user: socket.data.user,
      room,
    });
    // Send last messages from Room to User
    console.log(messages);
    await this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    // remove connection from JoinedRooms
    await this.chatService.deleteJoinedRoomBySocketId(socket.id);
  }

  @SubscribeMessage('deleteRoom')
  async onDeleteRoom(socket: Socket, room: IRoom) {
    await this.chatService.deleteRoom(room);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: IMessage) {
    const createdMessage: IMessage = await this.chatService.createMessage({
      ...message,
      user: socket.data.user,
    });
    console.log('mesaj creat..din backend', createdMessage);
    const room: IRoom = await this.chatService.getRoom(createdMessage.room.id);
    const joinedUsers: IJoinedRoom[] = await this.chatService.findByRoom(room);
    console.log('joinedUsers', joinedUsers);
    for (const user of joinedUsers) {
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  private handleIncomingPageRequest(page: IPage) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page = page.page + 1;
    return page;
  }
}
