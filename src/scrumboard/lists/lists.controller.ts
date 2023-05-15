import { Body, Controller, Post } from '@nestjs/common';
import { create } from 'domain';
import { CreateListDto } from './dtos/create-list.dto';
import { ListsService } from './lists.service';

@Controller('/scrumboard/boards/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@Body() createListDto: CreateListDto) {
    return this.listsService.create(
      createListDto.title,
      createListDto.position,
    );
  }
}
