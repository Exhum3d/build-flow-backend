import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Card } from './entities/card.entity';
import { Label } from './entities/label.entity';
import { List } from './entities/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, List, Card, Label])],
})
export class ScrumboardModule {}
