import { Test, TestingModule } from '@nestjs/testing';
import { ProjectPhasesService } from './project-phases.service';

describe('ProjectPhasesService', () => {
  let service: ProjectPhasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectPhasesService],
    }).compile();

    service = module.get<ProjectPhasesService>(ProjectPhasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
