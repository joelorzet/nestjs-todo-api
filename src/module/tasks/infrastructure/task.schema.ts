import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  done: boolean;
}
