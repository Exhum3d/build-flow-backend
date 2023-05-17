import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Label } from 'src/scrumboard/entities/label.entity';
import { IntegerType } from 'typeorm';

export class CreateCardDto {
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
