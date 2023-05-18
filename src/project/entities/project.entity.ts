import { Board } from 'src/scrumboard/entities/board.entity';
import { User } from 'src/users/user.entity';
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

  @ManyToOne(() => User, (user) => user.createdProjects, {
    onDelete: 'CASCADE',
  })
  createdBy: User;

  @OneToMany(() => Board, (board) => board.project)
  boards: Board[];

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable()
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
