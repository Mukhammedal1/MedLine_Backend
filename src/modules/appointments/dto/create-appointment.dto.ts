import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  doctor: number;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "appointment_time quyidagi formatda bo'lishi kerak: hh:mm",
  })
  appointment_time: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  complaint: string;

  @ApiPropertyOptional({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  is_pending: boolean;
}
