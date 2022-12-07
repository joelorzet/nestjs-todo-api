import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Task } from '../../domain/task.domain';
import { TaskSchema } from '../../infrastructure/task.schema';
import { TaskDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskSchema)
    private taskRepository: Repository<TaskSchema>,
  ) {}

  getTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async getTask(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw { status: 400, message: 'Task not found' };
    }
    return await this.taskRepository.findOneBy({ id });
  }

  createTasks(task: TaskDto) {
    if (!Object.keys(task).length) {
      throw {
        status: 400,
        message: 'Cannot create a task whithout data',
      };
    }

    return this.taskRepository
      .createQueryBuilder()
      .insert()
      .into(TaskSchema)
      .values({
        ...task,
      })
      .execute();
  }

  async updateTask(id: number, taskEl: TaskDto) {
    return await this.taskRepository.update({ id }, { ...taskEl });
  }

  deleteTask(id: number): Promise<DeleteResult> {
    return this.taskRepository.delete(id);
  }
}
