import { DoctorEntity, UserEntity } from '@database';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendMail(user: UserEntity | DoctorEntity) {
    const url = `${process.env.API_URL}/users/activate/${user.activation_link}`;
    await this.mailService.sendMail({
      to: user.email,
      subject: 'MedLine ga xush kelibsiz',
      template: './confirm',
      context: {
        name: `${user.name} ${user.surname}`,
        url,
      },
    });
  }

  async sendVerificationCode(user: UserEntity) {
    const code = randomInt(10000, 100000);

    user.verification_code = code;
    user.code_expires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await this.mailService.sendMail({
      to: user.email,
      subject: 'MedLine hisobni tasdiqlash kodi',
      template: './confirm-code',
      context: {
        name: `${user.name} ${user.surname}`,
        code,
      },
    });
    return code;
  }
}
