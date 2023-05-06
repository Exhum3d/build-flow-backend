import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(name: string, email: string, password: string, company: string) {
    const user = this.userRepository.create({
      name,
      email,
      password,
      company,
    });
    this.userRepository.save(user);
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  find(email: string) {
    return this.userRepository.find({ where: { email } });
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('utilizatorul nu a fost gasit');
    }
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('utilizatorul nu a fost gasit');
    }
    return this.userRepository.remove(user);
  }
}
