import { File } from 'src/file-manager/entities/File.entity';
import { Project } from 'src/project/entities/project.entity';
import { Board } from 'src/scrumboard/entities/board.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterRemove,
  AfterUpdate,
  AfterInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
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

  @Column({ nullable: true })
  role: string;

  @OneToMany(() => Project, (project) => project.createdBy)
  createdProjects: Project[];

  @OneToMany(() => File, (file) => file.createdBy)
  files: File[];

  @ManyToMany(() => Project, (project) => project.members)
  @JoinTable()
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
