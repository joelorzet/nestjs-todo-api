import { TaskSchema } from '../../tasks/infrastructure/task.schema';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Task } from '../../tasks/domain/task.domain';
@Entity()
export class UserSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => TaskSchema, (taskSchema) => taskSchema.user)
  @JoinColumn({ name: 'user_id' })
  tasks: Task[];
}
