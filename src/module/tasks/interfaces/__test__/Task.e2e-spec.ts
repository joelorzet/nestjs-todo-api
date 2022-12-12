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
    it('should return all tasks', async () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual([]);
        });
    });
  });

  describe('GET /tasks/:id', () => {
    let task: Task;
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post(`/tasks`)
        .send(tasks[0])
        .then(({ body }) => (task = body));

      await request(app.getHttpServer()).post(`/tasks`).send(tasks[1]);
    });

    it('should return an specific task from id if found', async () => {
      await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .expect(200)
        .then(({ body }) => expect(body.title).toBe(tasks[0].title));
    });

    it('should return an error if the task was not found', async () => {
      await request(app.getHttpServer())
        .get(`/tasks/fake-task`)
        .expect(400)
        .then(({ body }) => expect(body.error).toBeDefined());
    });
  });

  describe('POST /tasks', () => {
    const dto: TaskDto = {
      title: 'Test task 3',
      description: 'description for test task 3',
      done: false,
    };

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send(dto)
        .expect(201)
        .then(({ body }) => {
          expect(body.id).toBeDefined();
        });
    });

    it('should add a task successfully', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send(dto)
        .expect(201)
        .then(({ body }) => {
          expect(body.id).toBeDefined();
        });
    });

    it('should increase the amount of tasks if we add new tasks', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ ...dto, description: 'new description for task 3' })
        .expect(201)
        .then(({ body }) => {
          expect(body.id).toBeDefined();
        });

      await request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveLength(2);
        });
    });
  });

  describe('PUT /tasks', () => {
    let task: Task;
    const newDataTest: TaskDto = {
      title: 'New Title',
      description: 'This is a test description to update a task',
      done: true,
    };

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send(tasks[0])
        .then(({ body }) => (task = body));

      await request(app.getHttpServer()).post('/tasks').send(tasks[1]);
    });

    it('should update a task successfuly', async () => {
      return await request(app.getHttpServer())
        .put(`/tasks/${task.id}`)
        .send(newDataTest)
        .then(({ body }) => {
          expect(body.title).toBe(newDataTest.title);
        });
    });

    it('a task updated should have the new values when fetched from the API', async () => {
      await request(app.getHttpServer())
        .put(`/tasks/${task.id}`)
        .send(newDataTest)
        .then(({ body }) => {
          expect(body.title).toBe(newDataTest.title);
        });

      await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .then(({ body }) => {
          expect(body.title).toBe(newDataTest.title);
        });
    });
  });

  describe('DELETE /tasks', () => {
    let task: Task;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post(`/tasks`)
        .send(tasks[0])
        .then(({ body }) => (task = body));

      await request(app.getHttpServer()).post(`/tasks`).send(tasks[1]);
    });

    it('should delete a specific task successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks?id=${task.id}`)
        .expect(200);
    });

    it('if the task was successfully deleted, amount of tasks should be lower', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks?id=${task.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .then(({ body }) => expect(body).toHaveLength(1));
    });

    it('should return an error if we try to delete a task that has already deleted', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks?id=${task.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .delete(`/tasks?id=${task.id}`)
        .expect(400)
        .then(({ body }) => expect(body.error).toBeDefined());
    });

    it('should return an error if try to get the deleted task', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks?id=${task.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .expect(400)
        .then(({ body }) => expect(body.error).toBeDefined());
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    let tasks: Task[];

    await request(app.getHttpServer())
      .get('/tasks')
      .then(({ body }) => (tasks = body));

    await Promise.allSettled(
      tasks.map((taskEl: Task) => {
        return request(app.getHttpServer()).delete(`/tasks?id=${taskEl.id}`);
      }),
    );
  });
});
