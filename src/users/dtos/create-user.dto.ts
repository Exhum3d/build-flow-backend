import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  company: string;

  @IsString()
  role: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
