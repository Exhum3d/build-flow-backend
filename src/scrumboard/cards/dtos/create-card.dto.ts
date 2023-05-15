import { IsString } from 'class-validator';
import { Label } from 'src/scrumboard/entities/label.entity';

export class CreateCardDto {
  @IsString()
  id: string;

  @IsString()
  boardId: string;

  @IsString()
  listId: string;

  @IsString()
  position: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  labels: Label[];

  @IsString()
  dueDate: string;
}
