import { AbstractEntity } from 'database/abstract.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { DoctorEntity } from './doctor.entity';

@Entity()
export class SpecializationEntity extends AbstractEntity {
  @Column({ type: String })
  name: string;

  @OneToMany(() => DoctorEntity, (doctor) => doctor.specialization)
  doctors: DoctorEntity[];
}
