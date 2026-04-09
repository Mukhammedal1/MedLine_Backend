import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { AppointmentEntity } from './appointment.entity';
import { ImagesEntity } from './images.entity';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column({ type: String })
  name: string;

  @Column({ type: String })
  surname: string;

  @Column({ type: String, unique: true })
  email: string;

  @Column({ type: String })
  phone_number: string;

  @Column({ type: String })
  hashed_password: string;

  @OneToOne(() => ImagesEntity, (image) => image.user, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  image?: ImagesEntity;

  @Column({ type: Boolean, default: false })
  is_active: boolean;

  @Column({ type: String, nullable: true })
  hashed_refresh_token: string | null;

  @Column({ type: String, nullable: true })
  activation_link: string | null;

  @Column({ type: Number, nullable: true })
  verification_code: number | null;

  @Column({ type: Date, nullable: true })
  code_expires: Date | null;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.user)
  appointments: AppointmentEntity[];
}
