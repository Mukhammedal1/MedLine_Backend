import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { DoctorEntity } from '@database';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'modules/mail';
import { ChangeEmailDto, CreateDoctorDto, UpdateDoctorDto } from './dto';
import { ImagesService } from 'modules/images';
import { SpecializationsService } from 'modules/specializations';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepo: Repository<DoctorEntity>,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    private readonly imageService: ImagesService,
    private readonly specService: SpecializationsService,
  ) {}
  async create(createDoctorDto: CreateDoctorDto) {
    const { password, specialization, image, ...data } = createDoctorDto;
    const hashed_password = await bcrypt.hash(password, 7);
    const activation_link = uuidv4();
    const doctor = await this.doctorRepo.save({
      specialization: { id: specialization },
      image: { id: image },
      hashed_password,
      activation_link,
      appointment_duration: 30,
      ...data,
    });
    try {
      await this.mailService.sendMail(doctor);
    } catch (error) {
      throw new InternalServerErrorException('Emailga xat yuborishda xatolik');
    }
    return doctor;
  }

  async changeEmail(changeEmailDto: ChangeEmailDto) {
    const { id, email } = changeEmailDto;
    const doctor = await this.doctorRepo.findOne({ where: { id, email } });
    if (!doctor) {
      throw new NotFoundException('doctor not found');
    }
    let code: number;
    try {
      const code2 = await this.mailService.sendVerificationCode(doctor);
      code = code2;
    } catch (error) {
      throw new InternalServerErrorException('Emailga xat yuborishda xatolik');
    }
    return code;
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException('Activation link not found');
    }
    const doctor = await this.doctorRepo.findOne({
      where: {
        activation_link: link,
        is_active: false,
      },
    });
    if (!doctor) {
      throw new BadRequestException("Foydalanuvchi allqachon aktive bo'lgan");
    }
    doctor.is_active = true;
    await this.doctorRepo.save(doctor);
    const response = {
      message: 'doctor activated successfully',
      is_active: doctor.is_active,
    };
    return response;
  }

  async findAll() {
    return await this.doctorRepo.find({
      relations: { specialization: true, appointments: true, image: true },
    });
  }

  async findOne(id: number) {
    const result = await this.doctorRepo.findOne({
      where: { id },
      relations: { specialization: true, appointments: true, image: true },
    });
    if (!result) {
      throw new BadRequestException('Bunday foydalanuvchi mavjud emas');
    }
    return result;
  }

  async findOneByEmail(email: string) {
    const doctor = await this.doctorRepo.findOne({ where: { email } });
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    const { image, specialization, ...data } = updateDoctorDto;
    const result = await this.doctorRepo.findOne({ where: { id } });
    if (!result) {
      throw new BadRequestException('Bunday foydalanuvchi mavjud emas');
    }
    if (image) {
      result.image = await this.imageService.findOne(image);
    }
    if (specialization) {
      result.specialization = await this.specService.findOne(specialization);
    }
    Object.assign(result, data);
    return await this.doctorRepo.save(result);
  }

  async clearRefreshToken(userId: number): Promise<boolean> {
    const doctor = await this.doctorRepo.findOne({
      where: { id: userId, hashed_refresh_token: Not(IsNull()) },
    });

    if (!doctor) {
      throw new ForbiddenException('Access Denied');
    }

    doctor.hashed_refresh_token = null;
    await this.doctorRepo.save(doctor);
    return true;
  }

  async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
    const updatedUser = await this.doctorRepo.update(id, {
      hashed_refresh_token,
    });
    return updatedUser;
  }

  async remove(id: number) {
    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) {
      throw new BadRequestException('Bunday foydalanuvchi mavjud emas');
    }
    return await this.doctorRepo.delete(id);
  }
}
