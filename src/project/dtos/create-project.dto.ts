import { IsDate, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/user.entity';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  stakeholder: string;

  @IsNumber()
  budget: number;

  // @IsDate()
  @IsString()
  startDate: string;

  // @IsDate()
  @IsString()
  dueDate: string;
}
