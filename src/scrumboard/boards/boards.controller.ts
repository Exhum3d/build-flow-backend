import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { CreateCardDto } from './dtos/create-card.dto';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { UpdateCardDto } from './dtos/update-card.dto';
import { UpdateListDto } from './dtos/update-list.dto';

@Controller('/scrumboard/boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Put('/create-board/:projectId')
  async createBoard(
    @Param('projectId') projectId: string,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    const createdBoard = await this.boardsService.createBoard(
      projectId,
      createBoardDto.title,
      createBoardDto.description,
      createBoardDto.lastActivity,
      createBoardDto.icon,
    );
    return this.boardsService.removeCircularReferences(createdBoard);
  }

  @Get('/project/:projectId')
  getBoards(@Param('projectId') projectId: string) {
    return this.boardsService.getBoards(projectId);
  }

  @Get('/:id')
  getBoard(@Param('id') id: string) {
    return this.boardsService.getBoard(id);
  }

  @Patch('/:id')
  updateBoard(@Param('id') id: string, @Body() attrs: UpdateBoardDto) {
    return this.boardsService.updateBoard(id, attrs);
  }

  @Delete('/:id')
  deleteBoard(@Param('id') id: string) {
    return this.boardsService.deleteBoard(id);
  }

  @Post('/list')
  async createList(@Body() createListDto: CreateListDto) {
    const createdList = await this.boardsService.createList({
      boardId: createListDto.boardId,
      title: createListDto.title,
      position: createListDto.position,
    });
    return this.boardsService.removeCircularReferences(createdList);
  }

  @Patch('/list/update')
  async updateList(@Body() list: UpdateListDto) {
    return this.boardsService.updateList(list);
  }

  @Patch('/lists/update')
  async updateLists(@Body() lists: UpdateListDto[]) {
    return this.boardsService.updateLists(lists);
  }

  @Delete('list/:id')
  deleteList(@Param('id') id: string) {
    return this.boardsService.deleteList(id);
  }

  @Put('/card')
  async createCard(@Body() createCardDto: CreateCardDto) {
    const createdCard = await this.boardsService.createCard(createCardDto);
    return this.boardsService.removeCircularReferences(createdCard);
  }

  @Patch('/card/:id')
  async updateCard(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.boardsService.updateCard(id, updateCardDto);
  }

  @Patch('/cards/update')
  async updateCards(@Body() cards: UpdateCardDto[]) {
    return this.boardsService.updateCards(cards);
  }
}
