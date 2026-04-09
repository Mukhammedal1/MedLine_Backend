import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DoctorsModule } from 'modules/doctors';
import { DoctorAuthController } from './doctor-auth.controller';
import { DoctorAuthService } from './doctor-auth.service';

@Module({
  imports: [JwtModule.register({ global: true }), DoctorsModule],
  controllers: [DoctorAuthController],
  providers: [DoctorAuthService],
})
export class DoctorAuthModule {}
