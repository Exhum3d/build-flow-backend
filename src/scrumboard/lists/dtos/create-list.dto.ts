import { IsNumber, IsString } from 'class-validator';

export class CreateListDto {
  @IsString()
  boardId: string;

  @IsString()
  title: string;

  @IsNumber()
  position: number;
}
