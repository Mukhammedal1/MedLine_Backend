import { AbstractEntity } from 'database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { DoctorEntity } from './doctor.entity';

@Entity()
export class AppointmentEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.appointments)
  user: UserEntity;

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.appointments)
  doctor: DoctorEntity;

  @Column({ type: 'time' })
  appointment_time: string;

  @Column({ type: String })
  complaint: string;

  @Column({ type: Boolean, default: true })
  is_pending?: boolean;
}
