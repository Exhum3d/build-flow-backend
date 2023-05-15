import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { List } from '../entities/list.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  // creare board
  async createBoard(
    titleFromDto: string,
    descriptionFromDto: string,
    lastActivityFromDto: string,
    iconFromDto?: string,
  ) {
    const lastActivity = new Date(lastActivityFromDto.split('T')[0]);
    let board = this.boardRepository.create({
      title: titleFromDto,
      description: descriptionFromDto,
      lastActivity,
      icon: iconFromDto,
    });
    board = await this.boardRepository.save(board);
    const list1 = this.listRepository.create({
      title: 'De Realizat',
      position: 65536,
      board,
    });
    const list2 = this.listRepository.create({
      title: 'În progres',
      position: 131072,
      board,
    });
    const list3 = this.listRepository.create({
      title: 'De verificat',
      position: 196608,
      board,
    });
    const list4 = this.listRepository.create({
      title: 'Finalizate',
      position: 262144,
      board,
    });
    await Promise.all([
      this.listRepository.save(list1),
      this.listRepository.save(list2),
      this.listRepository.save(list3),
      this.listRepository.save(list4),
    ]);
    return board;
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

    return JSON.parse(JSON.stringify(obj, replacer));
  }

  // gasire board dupa id
  async getBoard(id: string) {
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: ['lists'],
    });
    return board;
  }

  // gasirea tuturor board-urilor
  async getBoards() {
    return await this.boardRepository.find();
  }

  // stergere board
  async removeBoard(id: string) {
    const board = await this.getBoard(id);
    if (!board) {
      throw new NotFoundException('proiectul nu a fost gasit');
    }
    return this.boardRepository.remove(board);
  }
}
