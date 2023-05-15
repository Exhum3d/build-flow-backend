import { Body, Controller, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/create-board.dto';

@Controller('/scrumboard/boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('/create-board')
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(
      createBoardDto.title,
      createBoardDto.description,
      createBoardDto.lastActivity,
      createBoardDto.icon,
    );
  }
}
