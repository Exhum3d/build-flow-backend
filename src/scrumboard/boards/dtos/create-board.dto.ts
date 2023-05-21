import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  department: string;

  @IsNumber()
  @IsOptional()
  departmentBudget: number;

  @IsNumber()
  @IsOptional()
  budget: number;

  @IsString()
  @IsOptional()
  icon: string;

  @IsString()
  @IsOptional()
  lastActivity: string;
}
