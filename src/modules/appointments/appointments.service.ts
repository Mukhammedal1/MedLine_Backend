import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from '@database';
import { AppointmentGateway } from './appointments.gateway';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepo: Repository<AppointmentEntity>,
    private readonly gateway: AppointmentGateway,
  ) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    const appointment = await this.appointmentRepo.save({
      user: { id: createAppointmentDto.user },
      doctor: { id: createAppointmentDto.doctor },
      appointment_time: createAppointmentDto.appointment_time,
      complaint: createAppointmentDto.complaint,
    });

    const fullAppointment = await this.appointmentRepo.findOne({
      where: { id: appointment.id },
      relations: { user: true, doctor: { specialization: true } },
    });

    this.gateway.sendToDoctor(createAppointmentDto.doctor, fullAppointment);

    return fullAppointment;
  }

  async findAll() {
    return await this.appointmentRepo.find({
      relations: { user: true, doctor: { specialization: true } },
    });
  }

  async findOne(id: number) {
    const result = await this.appointmentRepo.findOne({
      where: { id },
      relations: { user: true, doctor: { specialization: true } },
    });
    if (!result) {
      throw new BadRequestException('Appointment not found');
    }
    return result;
  }

  async getDoctorSlots(id: number) {
    const today = new Date();
    const appointments = await this.appointmentRepo.find({
      where: {
        doctor: { id },
        created_at: today,
      },
    });
    const a = appointments.map((a) => a.appointment_time.slice(0, 5));
    console.log(a);
    return a;
  }

  async findAllByUserId(user_id: number) {
    const result = await this.appointmentRepo.find({
      where: { user: { id: user_id } },
      relations: { user: true, doctor: { specialization: true, image: true } },
    });
    if (!result) {
      throw new BadRequestException('Appointments not found');
    }
    return result;
  }

  async findAllByDoctorId(user_id: number) {
    const result = await this.appointmentRepo.find({
      where: { doctor: { id: user_id }, is_pending: true },
      relations: { user: { image: true }, doctor: { specialization: true } },
    });
    if (!result) {
      throw new BadRequestException('Appointments not found');
    }
    return result;
  }

  async findAllByDoctorIdNotPending(user_id: number) {
    const result = await this.appointmentRepo.find({
      where: { doctor: { id: user_id }, is_pending: false },
      relations: { user: { image: true }, doctor: { specialization: true } },
    });
    if (!result) {
      throw new BadRequestException('Appointments not found');
    }
    return result;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const result = await this.appointmentRepo.findOne({ where: { id } });
    if (!result) {
      throw new BadRequestException('Appointment not found');
    }
    Object.assign(result, updateAppointmentDto);
    return await this.appointmentRepo.save(result);
  }

  async remove(id: number) {
    const result = await this.appointmentRepo.findOne({ where: { id } });
    if (!result) {
      throw new BadRequestException('Appointment not found');
    }
    return await this.appointmentRepo.delete(id);
  }
}
