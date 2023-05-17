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

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  position: number;

  @Column({ nullable: true })
  dueDate: Date;

  @ManyToMany(() => Label)
  @JoinTable()
  labels: Label[];

  @Column({ nullable: true })
  listId: string;

  @ManyToOne(() => List, (list) => list.cards)
  list: List;

  @Column({ nullable: true })
  boardId: string;

  @ManyToOne(() => Board, (board) => board.cards)
  board: Board;
}
