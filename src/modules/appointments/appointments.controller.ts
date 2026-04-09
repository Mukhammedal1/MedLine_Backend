import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Get('doctor-slots/:id')
  getDoctorSlots(@Param('id') id: number) {
    return this.appointmentsService.getDoctorSlots(id);
  }

  @Get('user-tickets/:id')
  findAllByUserId(@Param('id') id: string) {
    return this.appointmentsService.findAllByUserId(+id);
  }

  @Get('doctor-tickets/:id')
  findAllByDoctorId(@Param('id') id: string) {
    return this.appointmentsService.findAllByDoctorId(+id);
  }

  @Get('doctor-tickets/not-pending/:id')
  findAllByDoctorIdNotPending(@Param('id') id: string) {
    return this.appointmentsService.findAllByDoctorIdNotPending(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
