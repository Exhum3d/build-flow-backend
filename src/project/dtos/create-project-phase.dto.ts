import { IsString } from 'class-validator';

export class CreateProjectPhaseDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  startDate: string;

  @IsString()
  dueDate: string;

  @IsString()
  projectId: string;
}
