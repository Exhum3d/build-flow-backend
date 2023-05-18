import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { Card } from '../entities/card.entity';
import { List } from '../entities/list.entity';
import { CreateListDto } from '../lists/dtos/create-list.dto';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { UpdateCardDto } from './dtos/update-card.dto';
import { UpdateListDto } from './dtos/update-list.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly entityManager: EntityManager,
  ) {}

  // creare board
  async createBoard(
    projectId: string,
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
      projectId: projectId,
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
      relations: ['lists', 'lists.cards'],
    });
    console.log('boardul din backend', board);
    return board;
  }

  // gasirea tuturor board-urilor dupa id-ul proiectului
  async getBoards(projectId: string) {
    const boards = await this.boardRepository.find({ where: { projectId } });
    console.log('boards din backend', boards);
    return boards;
  }

  // actualizare board
  async updateBoard(id: string, attrs: UpdateBoardDto) {
    const board = await this.getBoard(id);
    if (!board) {
      throw new NotFoundException('board-ul nu a fost gasit');
    }
    Object.assign(board, attrs);
    return this.boardRepository.save(board);
  }

  // stergere board
  async deleteBoard(id: string) {
    try {
      await this.entityManager.transaction(async (manager) => {
        const board = await manager.findOne(Board, {
          where: { id },
          relations: ['lists'],
        });
        if (!board) {
          throw new NotFoundException('boardul nu a fost gasit');
        }
        await manager.remove(board);
        for (const list of board.lists) {
          await manager.remove(list);
        }
      });
      return 'board-ul a fost sters cu succes';
    } catch (error) {
      throw new InternalServerErrorException('stergerea boardului a esuat');
    }
  }

  //creare lista
  async createList(createListDto: CreateListDto) {
    const board = await this.getBoard(createListDto.boardId);
    if (!board) {
      throw new NotFoundException('boardul nu a fost gasit');
    }
    const list = this.listRepository.create({
      title: createListDto.title,
      position: createListDto.position,
      boardId: createListDto.boardId,
    });
    return this.listRepository.save(list);
  }

  // actualizare lista
  async updateList(list: UpdateListDto) {
    const listToUpdate = await this.listRepository.findOne({
      where: { id: list.id },
    });
    Object.assign(listToUpdate, list);
    return this.listRepository.save(listToUpdate);
  }

  // actualizare liste
  async updateLists(lists: UpdateListDto[]) {
    const updatedLists: List[] = [];

    console.log('listele care vin ca parametru', lists);
    for (const list of lists) {
      const listToUpdate = await this.listRepository.findOne({
        where: { id: list.id },
      });
      if (!listToUpdate) {
        throw new NotFoundException(`Lista cu id ${list.id} nu a fost gasita`);
      }

      Object.assign(listToUpdate, list);
      const updatedList = await this.listRepository.save(listToUpdate);
      updatedLists.push(updatedList);
    }

    return updatedLists;
  }

  async deleteList(id: string) {
    try {
      await this.entityManager.transaction(async (manager) => {
        const list = await manager.findOne(List, {
          where: { id },
          relations: ['cards'],
        });
        if (!list) {
          throw new NotFoundException('lista nu a fost gasita');
        }
        await manager.remove(list);
        for (const card of list.cards) {
          await manager.remove(card);
        }
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException('stergerea listei a esuat');
    }
  }

  //creare card
  async createCard(createCardDto: CreateCardDto) {
    const card = this.cardRepository.create({
      title: createCardDto.title,
      description: createCardDto.description,
      listId: createCardDto.listId,
      boardId: createCardDto.boardId,
      position: createCardDto.position,
      dueDate: createCardDto.dueDate,
    });
    return this.cardRepository.save(card);
  }

  // actualizare card
  async updateCard(id: string, attrs: UpdateCardDto) {
    console.log('idul cardului param', id);
    console.log('attrs', attrs);
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException('cardul nu a fost gasit');
    }
    Object.assign(card, attrs);
    return this.cardRepository.save(card);
  }

  // actualizare
  async updateCards(cards: UpdateCardDto[]) {
    console.log('suntem aici');
    const updatedCards: Card[] = [];

    for (const card of cards) {
      const cardToUpdate = await this.cardRepository.findOne({
        where: { id: card.id },
      });
      if (!cardToUpdate) {
        throw new NotFoundException(`cardul cu id ${card.id} nu a fost gasit`);
      }

      // // Go through the lists
      // lists.forEach((item) => {
      //   // Find the list
      //   const index = this._lists.findIndex((list) => item.id === list.id);
      //
      //   // Update the list
      //   this._lists[index] = assign({}, this._lists[index], item);
      //
      //   // Store in the updated lists
      //   updatedLists.push(item);
      // });
      Object.assign(cardToUpdate, card);
      const updatedCard = await this.cardRepository.save(cardToUpdate);
      updatedCards.push(updatedCard);
    }

    console.log('test');
    return updatedCards;
  }
}
