import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  stakeholder: string;

  @IsNumber()
  @IsOptional()
  budget: number;

  // @IsDate()
  @IsString()
  @IsOptional()
  startDate: string;

  // @IsDate()
  @IsString()
  @IsOptional()
  dueDate: string;
}
