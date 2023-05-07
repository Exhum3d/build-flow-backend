import { User } from 'src/users/user.entity';
import {
  AfterInsert,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectPhase } from './project-phase.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  stakeholder: string;

  @Column()
  budget: number;

  @Column({ type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.createdProjects, {
    onDelete: 'CASCADE',
  })
  createdBy: User;

  @OneToMany(() => ProjectPhase, (projectPhase) => projectPhase.project)
  projectPhases: ProjectPhase[];

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
