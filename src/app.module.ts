import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './project/project.module';
import { Project } from './project/entities/project.entity';
import { ScrumboardModule } from './scrumboard/scrumboard.module';
import { Board } from './scrumboard/entities/board.entity';
import { List } from './scrumboard/entities/list.entity';
import { Card } from './scrumboard/entities/card.entity';
import { Department } from './project/entities/department.entity';
import { FileManagerModule } from './file-manager/file-manager.module';
import { File } from './file-manager/entities/File.entity';
import { ChatModule } from './chat/chat.module';
import { ConnectedUser } from './chat/entities/connected-user.entity';
import { Message } from './chat/entities/message.entity';
import { JoinedRoom } from './chat/entities/joined-room.entity';
import { Room } from './chat/entities/room.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [
        User,
        Project,
        Board,
        List,
        Card,
        Department,
        File,
        Room,
        ConnectedUser,
        Message,
        JoinedRoom,
      ],
      synchronize: true,
    }),
    ProjectModule,
    ScrumboardModule,
    FileManagerModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
