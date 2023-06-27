import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  shorthandTitle: string;

  @Column()
  budget: number;

  @ManyToMany(() => Project, (project) => project.departments)
  projects: Project[];
}
