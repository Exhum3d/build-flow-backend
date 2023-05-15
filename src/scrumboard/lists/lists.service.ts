import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,
  ) {}

  // creare lista
  create(titleFromDto: string, positionFromDto: number) {
    const board = this.listRepository.create({
      title: titleFromDto,
      position: positionFromDto,
    });
    return this.listRepository.save(board);
  }
}
