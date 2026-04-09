import { DoctorEntity, UserEntity } from '@database';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UsersService } from 'modules/users';
import { CreateUserDto } from 'modules/users/dto';
import { SignInDto } from './dto';
import { DoctorsService } from 'modules/doctors';
import { CreateDoctorDto } from 'modules/doctors/dto';

@Injectable()
export class DoctorAuthService {
  constructor(
    private readonly doctorService: DoctorsService,
    private readonly jwtService: JwtService,
  ) {}
  async generateTokens(doctor: DoctorEntity) {
    const payload = {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
    };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.DOCTOR_ACCESS_TOKEN_SECRET_KEY,
        expiresIn: '1m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.DOCTOR_REFRESH_TOKEN_SECRET_KEY,
        expiresIn: '1d',
      }),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  async register(createDoctorDto: CreateDoctorDto) {
    const user = await this.doctorService.findOneByEmail(createDoctorDto.email);
    if (user) {
      throw new BadRequestException('doctor already exists');
    }
    const newUser = await this.doctorService.create(createDoctorDto);
    return {
      message:
        "Tabriklayman tizimga qo'shildingiz. Akkauntni faollashtirish uchun emailga xat yuborildi",
      userId: newUser.id,
    };
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const user = await this.doctorService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException('Email yoki parol xato');
    }
    // if (!user.is_active) {
    //   throw new BadRequestException('Foydalanuvchi aktive emas');
    // }

    const isvalidPassword = await bcrypt.compare(
      signInDto.password,
      user.hashed_password,
    );

    if (!isvalidPassword) {
      throw new UnauthorizedException('Email yoki parol xato');
    }
    const tokens = await this.generateTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.doctorService.updateRefreshToken(
      user.id,
      hashed_refresh_token,
    );
    if (!updatedUser) {
      throw new InternalServerErrorException('Tokenni saqlashda xatolik');
    }
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // Number(process.env.COOKIE_TIME)
      httpOnly: true,
      secure: false, // https bo‘lsa true bo'ladi
      sameSite: 'lax',
    });
    const response = {
      message: 'Doctor logged in',
      user_id: user.id,
      access_token: tokens.access_token,
    };
    return response;
  }

  async signOut(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token mavjud emas');
    }
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.DOCTOR_REFRESH_TOKEN_SECRET_KEY,
    });
    if (!userData) {
      throw new ForbiddenException('Doctor not verified');
    }
    const hashed_refresh_token = null;
    await this.doctorService.updateRefreshToken(
      userData.id,
      hashed_refresh_token,
    );
    res.clearCookie('refresh_token');
    const response = {
      message: 'SignOut is successfully',
    };
    return response;
  }

  async refreshToken(userId: number, refreshToken: string, res: Response) {
    let decoded: any;
    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.DOCTOR_REFRESH_TOKEN_SECRET_KEY,
      });
    } catch (error) {
      res.clearCookie('refresh_token');
      throw new UnauthorizedException('Refresh token expired');
    }

    if (decoded.id !== userId)
      throw new ForbiddenException('Ruxsat etilmagan foydalanuvchi');
    const user = await this.doctorService.findOne(userId);
    if (!user || !user.hashed_refresh_token) {
      throw new BadRequestException('Doctor not found');
    }
    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!tokenMatch) {
      throw new ForbiddenException('Ruxsat etilmagan foydalanuvchi');
    }
    const tokens = await this.generateTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.doctorService.updateRefreshToken(user.id, hashed_refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: Number(process.env.COOKIE_TIME), //7 kun millisekunda
      httpOnly: true,
      secure: false, // https bo‘lsa true bo'ladi
      sameSite: 'lax',
    });
    const response = {
      id: user.id,
      access_token: tokens.access_token,
    };
    return response;
  }
}
