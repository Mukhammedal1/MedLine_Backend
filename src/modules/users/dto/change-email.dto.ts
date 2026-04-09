import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
