import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from './card.entity';
import { Label } from './label.entity';
import { List } from './list.entity';

// Exemplu
// id: '2c82225F-2a6c-45d3-b18a-1132712a4234',
// title: 'Studiu de fezabilitate',
// description: 'Se va face o analiză detaliata a cerințelor clientului',
// icon: 'heroicons_outline:calendar',
// lastActivity: now.startOf('day').minus({ day: 1 }).toISO(),
// members: [
//   '9c510cf3-460d-4a8c-b3be-bcc3db578c08',
//   'baa88231-0ee6-4028-96d5-7f187e0f4cd5',
//   '18bb18f3-ea7d-4465-8913-e8c9adf6f568',
// ],

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  lastActivity: Date;

  @OneToMany(() => Label, (label) => label.board, { onDelete: 'CASCADE' })
  labels: Label[];

  @OneToMany(() => List, (list) => list.board, { onDelete: 'CASCADE' })
  lists: List[];

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @OneToMany(() => Card, (card) => card.board, { onDelete: 'CASCADE' })
  cards: Card[];

  @Column()
  projectId: string;

  @ManyToOne(() => Project, (project) => project.boards)
  project: Project;
}
