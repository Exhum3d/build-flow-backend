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
import { Label } from './scrumboard/entities/label.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Project, Board, List, Card, Label],
      synchronize: true,
    }),
    ProjectModule,
    ScrumboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
