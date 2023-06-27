import { Board } from '../../scrumboard/entities/board.entity';
import { User } from '../../users/user.entity';
import {
  AfterInsert,
  AfterUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  stakeholder: string;

  @Column({ nullable: true })
  budget: number;

  @Column({ type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  createdById: string;

  @ManyToOne(() => User, (user) => user.createdProjects, {
    onDelete: 'CASCADE',
  })
  createdBy: User;

  @OneToMany(() => Board, (board) => board.project)
  boards: Board[];

  @ManyToMany(() => Department, (department) => department.projects, {
    cascade: true,
  })
  @JoinTable()
  departments: Department[];

  @ManyToMany(() => User, (user) => user.projects)
  members: User[];

  @AfterInsert()
  logCreateProject() {
    console.log('Proiectul cu id ' + this.id + ' a fost inserat cu succes');
  }

  @AfterUpdate()
  logUpdateProject() {
    console.log('Proiectul cu id ' + this.id + ' a fost actualizat cu succes');
  }
}
