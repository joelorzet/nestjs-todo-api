import { TaskController } from '../task.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../../application/services/task.service';
import { Task } from '../../domain/task.domain';
import { TaskDto } from '../../application/dto/task.dto';

describe('TaskController', () => {
  let taskController: TaskController;
  const tasks: Task[] = [
    {
      id: 1,
      title: 'testing title 1',
      description: 'testing description 1',
      done: false,
    },
    {
      id: 2,
      title: 'testing title 2',
      description: 'testing description 2',
      done: true,
    },
  ];

  const mockTaskService = {
    getTasks: jest.fn(() => tasks),
    getTask: jest.fn(() => tasks[0]),
    createTasks: jest.fn((dto: TaskDto) => {
      const newTask = { id: tasks.length + 1, ...dto };

      tasks.push(newTask);

      return newTask;
    }),
    updateTasks: jest.fn((id: number, dto: TaskDto) => {
      let task = tasks.find((el) => el.id === id);
      if (task) {
        task = { id, ...dto };
        return task;
      }
      return task;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    })
      .overrideProvider(TaskService)
      .useValue(mockTaskService)
      .compile();

    taskController = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      expect(await taskController.getTasks()).toBe(tasks);
    });
  });

  describe('getTask', () => {
    it('should return an specific task', async () => {
      expect((await taskController.getTask(1)).id).toBe(tasks[0].id);
    });
  });

  describe('createTask', () => {
    it('should create a task and return it', async () => {
      const dto: TaskDto = {
        title: 'creating a ',
        description: 'updating task 4 to test something',
        done: true,
      };

      expect(await taskController.createTasks(dto)).toEqual(tasks.at(-1));
    });
  });

  describe('updateTask', () => {
    it('should update a task and return it', async () => {
      const dto: TaskDto = {
        title: 'creating a task',
        description: 'updating task 4 to test something',
        done: false,
      };

      expect(await taskController.updateTasks(1, dto)).toEqual(tasks[0]);
    });
  });
});
