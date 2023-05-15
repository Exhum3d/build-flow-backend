import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/create-board.dto';

@Controller('/scrumboard/boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('/create-board')
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    const createdBoard = await this.boardsService.createBoard(
      createBoardDto.title,
      createBoardDto.description,
      createBoardDto.lastActivity,
      createBoardDto.icon,
    );
    return this.boardsService.removeCircularReferences(createdBoard);
  }

  @Get()
  getBoards() {
    return this.boardsService.getBoards();
  }

  @Get('/:id')
  getBoard(@Param('id') id: string) {
    return this.boardsService.getBoard(id);
  }
}
