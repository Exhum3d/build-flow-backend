import { IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  filePath: string;

  @IsString()
  @IsOptional()
  size: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  contents: string;

  @IsString()
  @IsOptional()
  description: string;
}
