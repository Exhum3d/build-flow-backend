import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './project/project.module';
import { Project } from './project/entities/project.entity';
import { ProjectPhase } from './project/entities/project-phase.entity';
import { Task } from './project/entities/task.entity';
import { ScrumboardModule } from './scrumboard/scrumboard.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Project, ProjectPhase, Task],
      synchronize: true,
    }),
    ProjectModule,
    ScrumboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
