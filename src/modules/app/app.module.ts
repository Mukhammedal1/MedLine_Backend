import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppointmentsModule, AuthModule, DoctorAuthModule, DoctorsModule, ImagesModule, MailModule, SpecializationsModule, UsersModule } from '@modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    SpecializationsModule,
    DoctorsModule,
    AppointmentsModule,
    MailModule,
    AuthModule,
    ImagesModule,
    DoctorAuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
