import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './application/services/task.service';
import { TaskController } from './interfaces/task.controller';
import { TaskSchema } from './infrastructure/task.schema';

@Module({
  imports: [TypeOrmModule.forFeature([TaskSchema])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TypeOrmModule],
})
export class TasksModule {}
