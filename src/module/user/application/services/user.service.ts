import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskSchema } from '../../../tasks/infrastructure/task.schema';
import { Repository } from 'typeorm';
import { User } from '../../domain/user.domain';
import { UserSchema } from '../../infrastructure/user.schema';
import { UserDto } from '../dto/user.dto';
import { Task } from '../../../tasks/domain/task.domain';
import { TaskDto } from '../../../tasks/application/dto/task.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserSchema)
    private userRepository: Repository<UserSchema>,
    @InjectRepository(TaskSchema)
    private taskRepository: Repository<TaskSchema>,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  getUser(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: { tasks: true },
    });
  }

  async createUser(user: UserDto): Promise<User> {
    if (!Object.keys(user).length) {
      throw {
        message: 'User cannot be created without data',
      };
    }

    let newUser = this.userRepository.create();

    newUser = { ...newUser, ...user };

    return this.userRepository.save(newUser);
  }

  async addTask(id: string, task: TaskDto) {
    const user: UserSchema = await this.userRepository.findOne({
      where: { id },
      relations: { tasks: true },
    });

    let newTask: Task = this.taskRepository.create();

    newTask = { ...newTask, ...task };

    if (!user.tasks.length) {
      user.tasks = [newTask];
    } else {
      user.tasks = [...user.tasks, newTask];
    }

    return await this.userRepository.save(user);
  }

  async assignTask(id: string, taskId: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { tasks: true },
    });

    const taskData = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: { user: true },
    });

    if (!user.tasks.length) {
      user.tasks = [taskData];
    } else {
      user.tasks = [...user.tasks, taskData];
    }

    await this.userRepository.save(user);

    return user;
  }

  async deleteTask(id: string, taskId: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { tasks: true },
    });

    user.tasks = user.tasks.filter((task: Task) => task.id !== taskId);

    await this.userRepository.save(user);

    return user;
  }

  // only for testing purposes
  async deleteAll() {
    const users = await this.userRepository.find();

    const deleteUsers = users.map((el) => this.userRepository.delete(el.id));

    await Promise.allSettled(deleteUsers);

    return users;
  }
}
