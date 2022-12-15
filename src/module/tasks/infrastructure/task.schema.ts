import { UserSchema } from '../../user/infrastructure/user.schema';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/domain/user.domain';

@Entity()
export class TaskSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  done: boolean;

  @ManyToOne(() => UserSchema, (user) => user.tasks, { onDelete: 'SET NULL' })
  user: User;
}
