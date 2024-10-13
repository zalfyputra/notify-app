import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    MinLength,
  } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;
}
