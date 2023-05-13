import { IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  stakeholder: string;

  @IsNumber()
  budget: number;

  // @IsDate()
  @IsString()
  startDate: string;

  // @IsDate()
  @IsString()
  dueDate: string;
}
