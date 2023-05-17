import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  boardId: string;

  @IsString()
  @IsOptional()
  listId: string;

  @IsString()
  @IsOptional()
  dueDate: string;

  @IsNumber()
  @IsOptional()
  position: number;
}
