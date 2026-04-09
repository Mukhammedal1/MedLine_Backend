import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { ChangeEmailDto, CreateDoctorDto, UpdateDoctorDto } from './dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Post("change-email")
    changeEmail(@Body() changeEmailDto: ChangeEmailDto) {
      return this.doctorsService.changeEmail(changeEmailDto);
    }

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(+id);
  }
}
