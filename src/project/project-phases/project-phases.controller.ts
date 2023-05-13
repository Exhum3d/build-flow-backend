import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { CreateProjectPhaseDto } from '../dtos/create-project-phase.dto';
import { ProjectService } from '../project/project.service';
import { ProjectPhasesService } from './project-phases.service';

@Controller('project/project-phases')
export class ProjectPhasesController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projPhaseService: ProjectPhasesService,
  ) {}

  // Adauga faza de proiect
  @UseGuards(JwtAuthGuard)
  @Post('/create-phase')
  create(@Body() createProjectPhaseDto: CreateProjectPhaseDto) {
    return this.projPhaseService.create(
      createProjectPhaseDto.name,
      createProjectPhaseDto.description,
      createProjectPhaseDto.startDate,
      createProjectPhaseDto.dueDate,
      createProjectPhaseDto.projectId,
    );
  }
  // Gaseste faza de proiect dupa id
  // Gaseste toate Fazele de proiect pentru un anumit id de proiect
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  findAllPhasesByProjectId(@Param('id') id: string) {
    return this.projPhaseService.findAllPhasesByProjectId(id);
  }
  // Actualizeaza faza de proiect
  // Sterge faza de proiect
}
