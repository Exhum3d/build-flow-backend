import { Test, TestingModule } from '@nestjs/testing';
import { ProjectPhasesController } from './project-phases.controller';

describe('ProjectPhasesController', () => {
  let controller: ProjectPhasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectPhasesController],
    }).compile();

    controller = module.get<ProjectPhasesController>(ProjectPhasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
