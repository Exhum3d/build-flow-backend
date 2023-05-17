import { IsNumber, IsString } from 'class-validator';

export class CreateListDto {
  @IsString()
  boardId: string;

  @IsNumber()
  position: number;

  @IsString()
  title: string;
}
