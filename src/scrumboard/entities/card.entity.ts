import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  startDate: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  listId: string;

  @ManyToOne(() => List, (list) => list.cards)
  list: List;
}
