import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
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
    role: string,
  ): Promise<User> {
    const saltRounds = 10;
    password = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      name,
      email,
      password,
      company,
      role,
    });

    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    this.removeCircularReferences(user);
    return user;
  }

  async findByEmail(email: string): Promise<User[]> {
    return this.userRepository.find({
      where: {
        email: Like(`%${email.toLowerCase()}%`),
      },
    });
  }

  async findByEmailStandalone(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async getAllUsersFilteredForChat(loggedInUserId: string) {
    // Găsește id-urile tuturor camerelor de chat la care participă utilizatorul
    const loggedInUserRooms = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.chatRooms', 'chatRoom')
      .where('user.id = :loggedInUserId', { loggedInUserId })
      .select('chatRoom.id')
      .getRawMany();

    // Obține un array cu toate id-urile camerelor de chat
    const loggedInUserRoomIds = loggedInUserRooms.map((room) => room.id);
    console.log('chatroomurile utilizatorului logat', loggedInUserRooms);

    // Găsește utilizatorii care nu se află în aceleași camere de chat
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.chatRooms', 'chatRoom')
      .where('user.id != :loggedInUserId', { loggedInUserId })
      .groupBy('user.id')
      .having('COUNT(chatRoom.id) != 1');

    if (loggedInUserRoomIds[0]) {
      query.andWhere('chatRoom.id NOT IN (:...loggedInUserRoomIds)', {
        loggedInUserRoomIds,
      });
    }
    const users = await query.getMany();
    users.forEach((users) => this.removeCircularReferences(users));
    console.log('useri filtrati', users);
    return users;
  }

  removeCircularReferences(obj: any) {
    const cache = new Set();
    const replacer = (_: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return; // Elimină referința circulară
        }
        cache.add(value);
      }
      return value;
    };
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
