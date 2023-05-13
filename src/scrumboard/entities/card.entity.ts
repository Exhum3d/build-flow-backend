import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';
import { Label } from './label.entity';
import { List } from './list.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  position: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @ManyToMany(() => Label)
  @JoinTable()
  labels: Label[];

  @Column()
  listId: string;

  @ManyToOne(() => List, (list) => list.cards)
  list: List;

  @Column()
  boardId: string;

  @ManyToOne(() => Board, (board) => board.cards)
  board: Board;
}
