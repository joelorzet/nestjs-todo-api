import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from '../tasks/application/services/task.service';
import { TaskSchema } from '../tasks/infrastructure/task.schema';
import { UserService } from './application/services/user.service';
import { UserSchema } from './infrastructure/user.schema';
import { UserController } from './interfaces/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema, TaskSchema])],
  controllers: [UserController],
  providers: [UserService, TaskService],
})
export class UserModule {}
