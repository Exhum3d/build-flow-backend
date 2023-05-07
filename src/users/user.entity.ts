import { Project } from 'src/project/entities/project.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterRemove,
  AfterUpdate,
  AfterInsert,
  OneToMany,
  ManyToMany,
} from 'typeorm';

// Exemplu entitate
// id: 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df',
// name: 'Victor Sterea',
// email: 'sterea.victor@company.com',
// avatar: 'assets/images/avatars/sterea-victor.jpg',
// status: 'activ',
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  company: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  status: string;

  @OneToMany(() => Project, (project) => project.createdBy)
  createdProjects: Project[];

  @ManyToMany(() => Project, (project) => project.members)
  projects: Project[];

  @AfterInsert()
  logInsert() {
    console.log('S-a inserat utilizatorul cu id-ul', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('S-a actualizat utilizatorul cu id-ul', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('S-a sters utilizatorul cu id-ul', this.id);
  }
}
