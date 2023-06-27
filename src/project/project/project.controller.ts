import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-project')
  create(@Body() createProjectDto: CreateProjectDto, @Req() request: Request) {
    const user = request['user'];
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

  @Post(':projectId/add-member/')
  addMemberToProject(@Param('projectId') projectId: string, @Req() user: any) {
    return this.projectService.addMemberToProject(projectId, user.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  getMemberByEmail(@Param('id') id: string) {
    return this.projectService.getStats(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/stats/:id')
  getStats(@Param('id') id: string) {
    return this.projectService.getStats(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/members')
  getAllProjectMembers(@Param('id') id: string) {
    return this.projectService.getAllProjectMembers(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:projectId/member/:memberId')
  async removeMemberFromProject(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.projectService.removeMemberFromProject(projectId, memberId);
    return {
      message: `membrul cu id-ul ${memberId} a fost sters din lista de membri`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/gantt/:id')
  getGantt(@Param('id') id: string) {
    return this.projectService.getGanttData(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/budget-stats/:id')
  getBudgetDetails(@Param('id') id: string) {
    return this.projectService.getBudgetStats(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/departments/:id')
  getDepartments(@Param('id') id: string) {
    return this.projectService.getDepartments(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/department/:id')
  getDepartmentById(@Param('id') id: string) {
    return this.projectService.getDepartmentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/department/budget/:id')
  editDepartmentBudget(@Param('id') id: string, amount: number) {
    return this.projectService.editDepartmentBudget(id, amount);
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

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
