import { User } from '../../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  filePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  modifiedAt: Date;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  contents: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  createdById: string;

  @ManyToOne(() => User, (user) => user.files, {
    onDelete: 'CASCADE',
  })
  createdBy: User;
}
