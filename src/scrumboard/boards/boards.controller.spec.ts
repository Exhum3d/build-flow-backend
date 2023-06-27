import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityManager } from 'typeorm';
import { Board } from '../entities/board.entity';
import { List } from '../entities/list.entity';
import { Card } from '../entities/card.entity';
import { Project } from '../../project/entities/project.entity';
import { Department } from '../../project/entities/department.entity';
import { ProjectModule } from '../../project/project.module';
import { User } from '../../users/user.entity';
import { File } from '../../file-manager/entities/File.entity';
import { Room } from '../../chat/entities/room.entity';
import { JoinedRoom } from '../../chat/entities/joined-room.entity';
import { Message } from '../../chat/entities/message.entity';
import { ConnectedUser } from '../../chat/entities/connected-user.entity';

describe('BoardsService', () => {
  let service: BoardsService;
  let boardRepository: Repository<Board>;
  let listRepository: Repository<List>;
  let cardRepository: Repository<Card>;
  let projectRepository: Repository<Project>;
  let departmentRepository: Repository<Department>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            JoinedRoom,
            Room,
            Board,
            List,
            Card,
            Department,
            Project,
            User,
            File,
            Message,
            ConnectedUser,
          ],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          User,
          Board,
          List,
          Card,
          Department,
          Project,
          File,
          Room,
          JoinedRoom,
          Message,
          ConnectedUser,
        ]),
        ProjectModule,
      ],
      providers: [BoardsService, EntityManager],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
    boardRepository = module.get<Repository<Board>>(getRepositoryToken(Board));
    listRepository = module.get<Repository<List>>(getRepositoryToken(List));
    cardRepository = module.get<Repository<Card>>(getRepositoryToken(Card));
    departmentRepository = module.get<Repository<Department>>(
      getRepositoryToken(Department),
    );
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBoard', () => {
    it('should return a board if it exists', async () => {
      const testBoard = new Board();
      testBoard.id = '1';
      jest.spyOn(boardRepository, 'findOne').mockResolvedValueOnce(testBoard);

      const board = await service.getBoard('1');
      expect(board).toEqual(testBoard);
    });

    it('should return undefined if a board does not exist', async () => {
      jest.spyOn(boardRepository, 'findOne').mockResolvedValueOnce(undefined);

      const board = await service.getBoard('1');
      expect(board).toBeUndefined();
    });
  });

  it('should return a board if it exists', async () => {
    const testBoard = new Board();
    testBoard.id = '1';
    //... set other properties of the board

    jest.spyOn(boardRepository, 'findOne').mockResolvedValue(testBoard);

    expect(await service.getBoard('1')).toEqual(testBoard);
  });

  it('should return null if a board does not exist', async () => {
    jest.spyOn(boardRepository, 'findOne').mockResolvedValue(null);

    expect(await service.getBoard('1')).toBeNull();
  });

  it('should throw an error if a board ID is invalid', async () => {
    jest.spyOn(boardRepository, 'findOne').mockImplementation(() => {
      throw new Error();
    });

    await expect(service.getBoard('invalid')).rejects.toThrow();
  });
});
