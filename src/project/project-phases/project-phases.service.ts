import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectPhase } from '../entities/project-phase.entity';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectPhasesService {
  constructor(
    @InjectRepository(ProjectPhase)
    private readonly projPhaseRepository: Repository<ProjectPhase>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // creare faza proiect
  async create(
    name: string,
    description: string,
    startDateFromDto: string,
    dueDateFromDto: string,
    projectId: string,
  ) {
    const startDate = new Date(startDateFromDto.split('T')[0]);
    const dueDate = new Date(dueDateFromDto.split('T')[0]);
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundException('proiectul nu a fost gasit');
    }
    if (startDate.getTime() > dueDate.getTime()) {
      throw new BadRequestException(
        'Data inceperii nu poate fi dupa data finalizarii',
      );
    }
    const projectPhase = this.projPhaseRepository.create({
      name,
      description,
      startDate,
      dueDate,
      project,
    });

    this.projPhaseRepository.save(projectPhase);
  }

  // Gaseste toate fazele pentru un id de proiect
  async findAllPhasesByProjectId(projectId: string) {
    console.log('acesta este idul', projectId);
    console.log(typeof projectId);
    const project = await this.projectRepository.findOneBy({
      id: projectId,
    });
    console.log(project);
    if (!project) {
      throw new NotFoundException('proiectul nu a fost gasit');
    }
    const projectPhases = await this.projPhaseRepository
      .createQueryBuilder('projectPhase')
      .leftJoinAndSelect('projectPhase.project', 'project')
      .where('project.id = :id', { id: '86346706-9532-4528-ab22-40402d13cec8' })
      .getMany();

    const processedPhases = projectPhases.map(({ project, ...rest }) => rest);
    return processedPhases;
  }
}
