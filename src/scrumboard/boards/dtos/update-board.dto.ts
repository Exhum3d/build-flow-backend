import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  @IsOptional()
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
}
