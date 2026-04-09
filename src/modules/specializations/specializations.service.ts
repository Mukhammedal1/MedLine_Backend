import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SpecializationEntity } from '@database';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSpecializationDto, UpdateSpecializationDto } from './dto';

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectRepository(SpecializationEntity)
    private readonly specializationRepo: Repository<SpecializationEntity>,
  ) {}
  async create(createSpecializationDto: CreateSpecializationDto) {
    return await this.specializationRepo.save(createSpecializationDto);
  }

  async findAll() {
    return await this.specializationRepo.find({ relations: { doctors: true } });
  }

  async findOne(id: number) {
    const result = await this.specializationRepo.findOne({
      where: { id },
      relations: { doctors: true },
    });
    if (!result) {
      throw new NotFoundException('Specialization not found');
    }
    return result;
  }

  async update(id: number, updateSpecializationDto: UpdateSpecializationDto) {
    const result = await this.specializationRepo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Specialization not found');
    }
    return await this.specializationRepo.update(id, updateSpecializationDto);
  }

  async remove(id: number) {
    const result = await this.specializationRepo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Specialization not found');
    }
    return await this.specializationRepo.delete(id);
  }
}
