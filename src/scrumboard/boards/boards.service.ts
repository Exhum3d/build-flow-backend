import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}
  create(
    titleFromDto: string,
    descriptionFromDto: string,
    lastActivityFromDto: string,
    iconFromDto?: string,
  ) {
    const lastActivity = new Date(lastActivityFromDto.split('T')[0]);

    const board = this.boardRepository.create({
      title: titleFromDto,
      description: descriptionFromDto,
      lastActivity,
      icon: iconFromDto,
    });

    return this.boardRepository.save(board);
  }
}
