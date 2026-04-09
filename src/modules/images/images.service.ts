import { ImagesEntity } from '@database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImagesEntity)
    private readonly imagesRepo: Repository<ImagesEntity>,
  ) {}
  async create(image_url: string) {
    return await this.imagesRepo.save({ url: image_url });
  }

  async findAll() {
    return await this.imagesRepo.find();
  }

  async findOne(id: number) {
    const result = await this.imagesRepo.findOne({
      where: { id },
      relations: { user: true, doctor: true },
    });
    if (!result) {
      throw new BadRequestException('Image not found');
    }
    return result;
  }

  async remove(id: number) {
    const doctor = await this.imagesRepo.findOne({ where: { id } });
    if (!doctor) {
      throw new BadRequestException('Image not found');
    }
    return await this.imagesRepo.delete(id);
  }
}
