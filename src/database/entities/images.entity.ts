import { AbstractEntity } from 'database/abstract.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { DoctorEntity } from './doctor.entity';

@Entity({ name: 'images' })
export class ImagesEntity extends AbstractEntity {
  @Column({ type: String })
  url: string;

  @OneToOne(() => UserEntity, (user) => user.image)
  user: UserEntity;

  @OneToOne(() => DoctorEntity, (doctor) => doctor.image)
  doctor: DoctorEntity;
}
