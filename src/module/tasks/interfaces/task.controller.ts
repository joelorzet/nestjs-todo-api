import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TaskDto } from '../application/dto/task.dto';
import { TaskService } from '../application/services/task.service';
import { Task } from '../domain/task.domain';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async getTasks(): Promise<Task[]> {
    return await this.taskService.getTasks();
  }

  @Get(':id')
  async getTask(@Param('id') id): Promise<Task> {
    try {
      return await this.taskService.getTask(id);
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

  @Post()
  async createTasks(@Body() task: TaskDto) {
    try {
      return await this.taskService.createTasks(task);
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

  @Put(':id')
  async updateTasks(@Param('id') id, @Body() task: TaskDto) {
    return await this.taskService.updateTask(id, task);
  }

  @Delete()
  async deleteTasks(@Body() id: number) {
    return await this.taskService.deleteTask(id);
  }
}
