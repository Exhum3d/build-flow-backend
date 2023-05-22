import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { Department } from '../entities/department.entity';
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
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // creare proiect
  async create(
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
      members: [createdBy],
    });

    const departmentsData = [
      {
        title: 'Achiziții și aprovizionare',
        budget: project.budget * 0.2,
        shorthandTitle: 'Achiziții',
      },
      {
        title: 'Construcții',
        budget: project.budget * 0.3,
        shorthandTitle: 'Construcții',
      },
      {
        title: 'Instalații și utilități',
        budget: project.budget * 0.15,
        shorthandTitle: 'Instalații',
      },
      {
        title: 'Proiectare',
        budget: project.budget * 0.25,
        shorthandTitle: 'Proiectare',
      },
      {
        title: 'Managementul proiectului',
        budget: project.budget * 0.1,
        shorthandTitle: 'Management',
      },
    ];

    // Save project and departments separately first
    const savedProject = await this.projectRepository.save(project);
    const savedDepartments = await Promise.all(
      departmentsData.map((dept) =>
        this.departmentRepository.save(this.departmentRepository.create(dept)),
      ),
    );

    // Then set up the relationship and save again
    savedProject.departments = savedDepartments;
    await this.projectRepository.save(savedProject);

    for (const department of savedDepartments) {
      department.projects = [savedProject];
      await this.departmentRepository.save(department);
    }

    return savedProject;
  }

  async getDepartments(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['departments'],
    });
    const departments = project.departments;
    return departments;
  }

  async getDepartmentById(id: string) {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });

    return department;
  }

  async editDepartmentBudget(id: string, newBudget: number) {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });

    Object.assign(department, { budget: newBudget });
    this.departmentRepository.save(department);
  }

  // citire proiect
  async findAllProjectsByUserId(id: string) {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'user')
      .where('user.id = :id', { id })
      .getMany();
    console.log('din backend proiect', projects);
    return projects;
  }

  async addMemberToProject(projectId: string, user: any) {
    console.log('user primit', user);
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['members'],
    });
    const foundUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['projects'],
    });

    if (!foundUser) {
      throw new NotFoundException({ message: 'emailul nu a fost găsit' });
    }

    project.members.push(foundUser);
    foundUser.projects.push(project);

    await this.projectRepository.save(project);
    await this.userRepository.save(foundUser);

    user = this.removeCircularReferences(user);

    return user.projects;
  }

  async getAllProjectMembers(projectId: string) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['members'],
    });
    project.members.map((member) => {
      delete member.password;
      return member;
    });
    return project.members;
  }

  async removeMemberFromProject(projectId: string, memberId: string) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['members'],
    });

    project.members = project.members.filter(
      (memberToBeRemoved) => memberToBeRemoved.id !== memberId,
    );

    await this.projectRepository.save(project);
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

  async getBudgetStats(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['departments', 'boards'],
    });

    console.log('proiect in backend', project);
    const budgetData = {
      budgetDetails: {
        columns: [
          'type',
          'total',
          'expensesAmount',
          'expensesPercentage',
          'remainingAmount',
          'remainingPercentage',
        ],
        rows: [],
      },
      budgetDistribution: {
        categories: [],
        series: [{ data: [], name: '' }],
      },
    };

    project.departments.forEach((department, index) => {
      let accumultatedExpensesPerDepartment = 0;
      accumultatedExpensesPerDepartment = project.boards
        .filter((board) => {
          return board.department === department.title;
        })
        .reduce((accumulator, newBoard) => {
          return accumulator + newBoard.budget;
        }, 0);

      budgetData.budgetDetails.rows[index] = {
        expensesAmount: accumultatedExpensesPerDepartment,
        expensesPercentage:
          (accumultatedExpensesPerDepartment / department.budget) * 100,
        id: index + 1,
        remainingAmount: department.budget - accumultatedExpensesPerDepartment,
        remainingPercentage:
          ((department.budget - accumultatedExpensesPerDepartment) /
            department.budget) *
          100,
        total: department.budget,
        type: department.title,
      };

      budgetData.budgetDistribution.categories[index] =
        department.shorthandTitle;

      budgetData.budgetDistribution.series[0].data[index] = Math.ceil(
        (department.budget / project.budget) * 100,
      );
    });
    budgetData.budgetDistribution.series[0].name = 'Bugete';
    console.log('budget details', JSON.stringify(budgetData, null, 2));

    return budgetData;
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
}
