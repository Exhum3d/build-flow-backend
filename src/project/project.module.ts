import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../scrumboard/entities/board.entity';
import { Card } from '../scrumboard/entities/card.entity';
import { List } from '../scrumboard/entities/list.entity';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { Department } from './entities/department.entity';
import { Project } from './entities/project.entity';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, Board, List, Card, Department]),
    PassportModule,
    UsersModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
