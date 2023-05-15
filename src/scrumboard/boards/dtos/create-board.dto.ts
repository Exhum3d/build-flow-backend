import { IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  icon: string;

  @IsString()
  lastActivity: string;
}
