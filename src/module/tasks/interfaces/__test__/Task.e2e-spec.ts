import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../app.module';
import { TaskDto } from '../../application/dto/task.dto';
import { Task } from '../../domain/task.domain';

describe('Tasks - /tasks (e2e)', () => {
  let app: INestApplication;

  const tasks: TaskDto[] = [
    {
      title: 'testing title 1',
      description: 'testing description 1',
      done: false,
    },
    {
      title: 'testing title 2',
      description: 'testing description 2',
      done: true,
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.init();
  });

  describe('GET /tasks', () => {
    it('Get all tasks [GET /tasks]', async () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual([]);
        });
    });
  });

  describe('POST /tasks', () => {
    it('should add a task correctly', async () => {
      const dto: TaskDto = {
        title: 'Test task 3',
        description: 'description for test task 3',
        done: false,
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(dto)
        .expect(201)
        .then(({ body }) => {
          expect(body.id).toBeDefined();
        });

      await request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveLength(1);
        });
    });
  });

  describe('PUT /tasks', () => {
    it('should update a task', async () => {
      let task: Task;
      await request(app.getHttpServer())
        .post('/tasks')
        .send(tasks[0])
        .then(({ body }) => (task = body));

      return await request(app.getHttpServer())
        .put(`/tasks/${task.id}`)
        .send(tasks[1])
        .then(({ body }) => {
          task = body;
          expect(task.title).toBe(tasks[1].title);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
