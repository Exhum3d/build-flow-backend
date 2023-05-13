import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // creare proiect
  create(
    name: string,
    description: string,
    stakeholder: string,
    budget: number,
    startDateFromDto: string,
    dueDateFromDto: string,
    createdBy: User,
  ) {
    const startDate = new Date(startDateFromDto.split('T')[0]);
    const dueDate = new Date(dueDateFromDto.split('T')[0]);
    if (startDate.getTime() > dueDate.getTime()) {
      throw new BadRequestException(
        'Data inceperii nu poate fi dupa data finalizarii',
      );
    }
    const project = this.projectRepository.create({
      name,
      description,
      stakeholder,
      budget,
      startDate,
      dueDate,
      createdBy,
    });

    return this.projectRepository.save(project);
  }

  // citire proiect
  async findAllProjectsByUserId(id: string) {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.createdBy', 'user')
      .where('user.id = :id', { id })
      .getMany();
    const processedProjects = projects.map(({ createdBy, ...rest }) => rest);
    return processedProjects;
  }

  // gasire proiecte dupa id proiect

  async findProjectById(id: string) {
    const project = await this.projectRepository.findOneBy({ id });
    return project;
  }

  // actualizare proiect
  async update(id: string, attrs: UpdateProjectDto) {
    const project = await this.findProjectById(id);
    if (!project) {
      throw new NotFoundException('proiectul nu a fost gasit');
    }
    const { startDate, dueDate, ...rest } = attrs;
    const attrsWithDates: Partial<Project> = {
      ...rest,
      ...(startDate && { startDate: new Date(startDate.split('T')[0]) }),
      ...(dueDate && { dueDate: new Date(dueDate.split('T')[0]) }),
    };

    if (
      (startDate &&
        attrsWithDates.startDate.getTime() > project.dueDate.getTime()) ||
      (dueDate &&
        attrsWithDates.dueDate.getTime() < project.startDate.getTime()) ||
      (startDate &&
        dueDate &&
        new Date(startDate).getTime() > new Date(dueDate).getTime())
    ) {
      throw new BadRequestException('Data/Datele introduse nu sunt corecte');
    }
    Object.assign(project, attrsWithDates);
    return this.projectRepository.save(project);
  }

  // stergere proiect
  async remove(id: string) {
    const project = await this.findProjectById(id);
    if (!project) {
      throw new NotFoundException('proiectul nu a fost gasit');
    }
    return this.projectRepository.remove(project);
  }
}
