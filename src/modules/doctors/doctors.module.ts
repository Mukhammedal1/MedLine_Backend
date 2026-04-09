import { forwardRef, Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntity } from '@database';
import { MailModule } from 'modules/mail';
import { ImagesModule } from 'modules/images';
import { SpecializationsModule } from 'modules/specializations';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorEntity]),
    forwardRef(() => MailModule),
    ImagesModule,
    SpecializationsModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
