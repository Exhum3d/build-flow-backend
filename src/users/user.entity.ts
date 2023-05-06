import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  IsNull,
  AfterRemove,
  AfterUpdate,
  AfterInsert,
} from 'typeorm';

// Exemplu entitate
// id: 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df',
// name: 'Victor Sterea',
// email: 'sterea.victor@company.com',
// avatar: 'assets/images/avatars/sterea-victor.jpg',
// status: 'online',
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
