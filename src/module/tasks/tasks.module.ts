import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './application/services/task.service';
import { TaskController } from './interfaces/task.controller';
import { TaskSchema } from './infrastructure/task.schema';
import { UserSchema } from '../user/infrastructure/user.schema';
import { UserService } from '../user/application/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskSchema, UserSchema])],
  controllers: [TaskController],
  providers: [TaskService, UserService],
  exports: [TypeOrmModule],
})
export class TasksModule {}
