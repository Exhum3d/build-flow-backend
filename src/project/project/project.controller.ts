import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/test')
  testMiddleware(@Req() request: Request) {
    console.log('request', request['user'].id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create-project')
  create(@Body() createProjectDto: CreateProjectDto, @Req() request: Request) {
    const user = request['user'];
    console.log(user);
    this.projectService.create(
      createProjectDto.name,
      createProjectDto.description,
      createProjectDto.stakeholder,
      createProjectDto.budget,
      createProjectDto.startDate,
      createProjectDto.dueDate,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all-projects')
  findAllProjectsByUserId(@Req() request: Request) {
    return this.projectService.findAllProjectsByUserId(request['user'].id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  findProjectById(@Param('id') id: string) {
    return this.projectService.findProjectById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updateProjectById(@Param('id') id: string, @Body() attrs: UpdateProjectDto) {
    return this.projectService.update(id, attrs);
  }
}
