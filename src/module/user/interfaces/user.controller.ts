import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { TaskService } from '../../tasks/application/services/task.service';
import { Task } from '../../tasks/domain/task.domain';
import { UserDto } from '../application/dto/user.dto';
import { UserService } from '../application/services/user.service';
import { User } from '../domain/user.domain';
import { TaskDto } from '../../tasks/application/dto/task.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private taskService: TaskService,
  ) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @Post()
  async createUser(@Body() user: UserDto) {
    try {
      return this.userService.createUser(user);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: err,
        },
      );
    }
  }

  @Post(':id')
  async addTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() task: TaskDto,
  ) {
    const newTask: Task = await this.taskService.createTasks(task);

    return await this.userService.addTask(id, newTask);
  }

  @Post(':id/task')
  async assignTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('id') taskId: string,
  ) {
    return await this.userService.assignTask(id, taskId);
  }

  @Delete(':id/task')
  async deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('id') taskId: string,
  ) {
    return await this.userService.deleteTask(id, taskId);
  }
  // only for testing purposes
  @Delete()
  async deleteAll() {
    return await this.userService.deleteAll();
  }
}
