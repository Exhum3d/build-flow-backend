import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    name: string,
    email: string,
    password: string,
    company: string,
  ): Promise<User> {
    const saltRounds = 10;
    password = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      name,
      email,
      password,
      company,
    });

    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, attrs: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('utilizatorul nu a fost gasit');
    }
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('utilizatorul nu a fost gasit');
    }
    return this.userRepository.remove(user);
  }

  // Functie helper de comparare a parolelor
  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
