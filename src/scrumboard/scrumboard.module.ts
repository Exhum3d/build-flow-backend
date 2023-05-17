import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Card } from './entities/card.entity';
import { Label } from './entities/label.entity';
import { List } from './entities/list.entity';
import { BoardsService } from './boards/boards.service';
import { BoardsController } from './boards/boards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Board, List, Card, Label])],
  providers: [BoardsService],
  controllers: [BoardsController],
})
export class ScrumboardModule {}
