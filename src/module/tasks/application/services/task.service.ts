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

  async getTask(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw { status: 400, message: 'Task not found' };
    }
    return task;
  }

  async createTasks(task: TaskDto) {
    if (!Object.keys(task).length) {
      throw {
        status: 400,
        message: 'Cannot create a task whithout data',
      };
    }

    let newTask = this.taskRepository.create();

    newTask = { ...newTask, ...task };

    return this.taskRepository.save(newTask);
  }

  async updateTask(id: string, taskEl: TaskDto) {
    await this.taskRepository.update(String(id), { ...taskEl });

    return await this.taskRepository.findOneBy({ id });
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw { message: 'The task doesnt exists or has already deleted' };
    }
    return this.taskRepository.delete(id);
  }
}
