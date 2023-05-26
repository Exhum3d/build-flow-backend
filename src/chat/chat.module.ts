import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ConnectedUser } from './entities/connected-user.entity';
import { JoinedRoom } from './entities/joined-room.entity';
import { Room } from './entities/room.entity';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([ConnectedUser, JoinedRoom, Room, Message]),
  ],
})
export class ChatModule {}
