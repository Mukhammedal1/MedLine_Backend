import { Controller, Post, Body, Param, Res } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { CookieGetter } from '@common';
import { CreateDoctorDto } from 'modules/doctors/dto';
import { DoctorAuthService } from './doctor-auth.service';

@Controller('auth-doctor')
export class DoctorAuthController {
  constructor(private readonly authService: DoctorAuthService) {}

  @Post('register')
  async signUp(@Body() createDoctorDto: CreateDoctorDto) {
    return this.authService.register(createDoctorDto);
  }

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInDto, res);
  }

  @Post('signout')
  signout(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(refreshToken, res);
  }

  @Post('refresh/:id')
  refresh(
    @Param('id') id: number,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log(refreshToken);
    return this.authService.refreshToken(+id, refreshToken, res);
  }
}
