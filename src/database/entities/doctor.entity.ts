import { AbstractEntity } from 'database/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { SpecializationEntity } from './specialization.entity';
import { AppointmentEntity } from './appointment.entity';
import { ImagesEntity } from './images.entity';

@Entity()
export class DoctorEntity extends AbstractEntity {
  @Column({ type: String })
  name: string;

  @Column({ type: String })
  surname: string;

  @Column({ type: String })
  spec_description: string;

  @Column({ type: String, unique: true })
  email: string;

  @Column({ type: String })
  phone_number: string;

  @Column({ type: String })
  address: string;

  @Column({ type: String })
  hashed_password: string;

  @OneToOne(() => ImagesEntity, (image) => image.doctor, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  image?: ImagesEntity;

  @Column({ type: Boolean, default: false })
  is_active: boolean;

  @Column({ type: String, nullable: true })
  hashed_refresh_token: string | null;

  @Column({ type: String, nullable: true })
  activation_link: string | null;

  @Column({ type: 'time' })
  working_start_time: string;

  @Column({ type: 'time' })
  working_end_time: string;

  @Column({ type: Number })
  appointment_duration: number;

  @Column({ type: Number })
  consultation_fee: number;

  @Column({ type: Number })
  room_number: number;

  @Column({ type: Number })
  experience: number;

  @ManyToOne(
    () => SpecializationEntity,
    (specialization) => specialization.doctors,
    { nullable: true, onDelete: 'SET NULL' },
  )
  specialization: SpecializationEntity;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.doctor)
  appointments: AppointmentEntity[];
}
