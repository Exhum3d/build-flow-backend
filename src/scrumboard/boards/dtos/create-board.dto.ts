import { IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  icon: string;

  @IsString()
  @IsOptional()
  lastActivity: string;
}
