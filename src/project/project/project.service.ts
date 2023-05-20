import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { warn } from 'console';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { Project } from '../entities/project.entity';

export type TaskForGantt = {
  x: string;
  y: number[];
};

export type ProjectData = {
  name: string;
  data?: TaskForGantt[];
};

export type Series = {
  series: ProjectData[];
  chart: any;
  plotOptions: any;
  xaxis: any;
  fill: any;
  legend: any;
};

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

  async getStats(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id: id },
      relations: ['boards', 'boards.lists', 'boards.lists.cards'],
    });

    const statistics = {
      withinDeadline: 0,
      finishedTasks: 0,
      overdue: 0,
      pendingTasks: 0,
      totalTasks: 0,
    };

    project.boards.forEach((board) => {
      const filteredListsNotTodo = board.lists.filter(
        (list) => list.position !== 65536,
      );
      filteredListsNotTodo.forEach((list) =>
        list.cards.forEach(() => statistics.pendingTasks++),
      );

      const filteredListsFinished = board.lists.find(
        (list) => list.title === 'Finalizate',
      );

      filteredListsFinished.cards.forEach(() => statistics.finishedTasks++);

      board.lists.forEach((list) => {
        list.cards.forEach((card) => {
          if (card.dueDate) {
            const dueDate = new Date(card.dueDate);
            const currentDate = new Date();
            if (dueDate.getTime() < currentDate.getTime()) {
              statistics.overdue++;
            } else {
              statistics.withinDeadline++;
            }
          }

          statistics.totalTasks++;
        });
      });
    });
    return statistics;
  }

  async getGanttData(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id: id },
      relations: ['boards', 'boards.lists', 'boards.lists.cards'],
    });

    const ganttArray: Series = {
      series: [],
      chart: {
        height: 450,
        type: 'rangeBar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '80%',
        },
      },
      xaxis: {
        type: 'datetime',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      legend: {
        show: false,
        position: 'top',
        horizontalAlign: 'left',
      },
    } as Series;

    ganttArray.series = [];

    project.boards.forEach((board) => {
      return board.lists.forEach((list) =>
        list.cards.forEach((card) => {
          const data = [] as TaskForGantt[];
          if (card.startDate && card.dueDate) {
            data.push({
              x: board.title,
              y: [card.startDate.getTime(), card.dueDate.getTime()],
            });
          } else {
            data.push({
              x: board.title,
              y: [0, 0],
            });
          }
          ganttArray.series.push({ name: card.title, data: data });
        }),
      );
    });

    return ganttArray;
  }
}
