import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '@database';
import { ChangeEmailDto, CreateUserDto, UpdateUserDto } from './dto';
import { MailService } from 'modules/mail';
import { ImagesService } from 'modules/images';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly mailService: MailService,
    private readonly imageService: ImagesService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, image, ...data } = createUserDto;
    const hashed_password = await bcrypt.hash(password, 7);
    const activation_link = uuidv4();
    const user = await this.userRepo.save({
      image: { id: image },
      hashed_password,
      activation_link,
      ...data,
    });
    try {
      await this.mailService.sendMail(user);
    } catch (error) {
      throw new InternalServerErrorException('Emailga xat yuborishda xatolik');
    }
    return user;
  }

  async changeEmail(changeEmailDto: ChangeEmailDto) {
    const { id, email } = changeEmailDto;
    const user = await this.userRepo.findOne({ where: { id, email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    let code: number;
    try {
      const code2 = await this.mailService.sendVerificationCode(user);
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
    const user = await this.userRepo.findOne({
      where: {
        activation_link: link,
        is_active: false,
      },
    });
    if (!user) {
      throw new BadRequestException("Foydalanuvchi allqachon aktive bo'lgan");
    }
    user.is_active = true;

    await this.userRepo.save(user);

    const response = {
      message: 'user activated successfully',
      is_active: user.is_active,
    };
    return response;
  }

  async findAll() {
    return await this.userRepo.find({ relations: { appointments: true } });
  }

  async findOne(id: number) {
    const result = await this.userRepo.findOne({
      where: { id },
      relations: { appointments: true, image: true },
    });
    if (!result) {
      throw new BadRequestException('Bunday foydalanuvchi mavjud emas');
    }
    return result;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { image, ...data } = updateUserDto;
    const result = await this.userRepo.findOne({ where: { id } });
    if (!result) {
      throw new BadRequestException('Bunday foydalanuvchi mavjud emas');
    }
    if (image) {
      result.image = await this.imageService.findOne(image);
    }
    Object.assign(result, data);
    return await this.userRepo.save(result);
  }

  async clearRefreshToken(userId: number): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { id: userId, hashed_refresh_token: Not(IsNull()) },
    });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    user.hashed_refresh_token = null;
    await this.userRepo.save(user);
    return true;
  }

  async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
    const updatedUser = await this.userRepo.update(id, {
      hashed_refresh_token,
    });
    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('Bunday foydalanuvchi mavjud emas');
    }
    return await this.userRepo.delete(id);
  }
}
