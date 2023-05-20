import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/scrumboard/entities/board.entity';
import { Card } from 'src/scrumboard/entities/card.entity';
import { List } from 'src/scrumboard/entities/list.entity';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Project } from './entities/project.entity';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, Board, List, Card]),
    PassportModule,
    UsersModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
