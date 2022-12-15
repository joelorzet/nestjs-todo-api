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
  Query,
  ParseUUIDPipe,
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
  async getTask(@Param('id') id: string): Promise<Task> {
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

  @Post(':id')
  async assignTasks(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('id', new ParseUUIDPipe()) userId: string,
  ) {
    try {
      return await this.taskService.assignTask(id, userId);
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
  async updateTask(@Param('id') id: string, @Body() task: TaskDto) {
    return await this.taskService.updateTask(id, task);
  }

  @Delete()
  async deleteTasks(@Query('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.taskService.deleteTask(id);
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
}
