import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Room, (room) => room.messages)
  @JoinTable()
  room: Room;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
