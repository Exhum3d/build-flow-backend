import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Card } from './entities/card.entity';
import { List } from './entities/list.entity';
import { BoardsService } from './boards/boards.service';
import { BoardsController } from './boards/boards.controller';
import { Project } from 'src/project/entities/project.entity';
import { Department } from 'src/project/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Board, List, Card, Department])],
  providers: [BoardsService],
  controllers: [BoardsController],
})
export class ScrumboardModule {}
