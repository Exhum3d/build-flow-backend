import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ProjectPhase } from './entities/project-phase.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { ProjectPhasesService } from './project-phases/project-phases.service';
import { ProjectPhasesController } from './project-phases/project-phases.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectPhase, User, Task]),
    PassportModule,
    UsersModule,
  ],
  controllers: [ProjectController, ProjectPhasesController],
  providers: [ProjectService, ProjectPhasesService],
})
export class ProjectModule {}
