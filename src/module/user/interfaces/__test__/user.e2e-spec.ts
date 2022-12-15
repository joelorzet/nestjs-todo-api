import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../app.module';
import { UserDto } from '../../application/dto/user.dto';
import { User } from '../../domain/user.domain';
import { TaskDto } from '../../../tasks/application/dto/task.dto';
import { Task } from '../../../tasks/domain/task.domain';

describe('User - /user (e2e)', () => {
  let app: INestApplication;

  const userDTO: UserDto = {
    email: 'email@email.com',
    password: 'test1',
    name: 'Name test 1',
    last_name: 'Last Name',
    isActive: true,
  };

  const TaskData: TaskDto = {
    title: 'Title 1',
    description: 'description 1',
    done: true,
  };

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

  describe('GET /user', () => {
    it('should return an array of users', async () => {
      return await request(app.getHttpServer())
        .get('/user')
        .expect(200)
        .then(({ body }) => expect(body).toHaveLength(0));
    });
  });

  describe('GET /user/:id', () => {
    let user: User;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/user')
        .send(userDTO)
        .expect(201)
        .then(({ body }) => (user = body));
    });

    it('should fetch an user successfully', async () => {
      return await request(app.getHttpServer())
        .get(`/user/${user.id}`)
        .expect(200)
        .then(({ body }) => expect(body.name).toBe(user.name));
    });
  });

  describe('POST /user', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/user')
        .send(userDTO)
        .expect(201);
    });

    it('should create an user successfully', async () => {
      return await request(app.getHttpServer())
        .post('/user')
        .send({ ...userDTO, email: 'email2@email.com' })
        .expect(201)
        .then(({ body }) => expect(body.id).toBeDefined());
    });

    it('should throw an error to an email before registered', async () => {
      return await request(app.getHttpServer())
        .post('/user')
        .send(userDTO)
        .expect(500);
    });

    it('should increase the amount of users', async () => {
      return await request(app.getHttpServer())
        .get(`/user`)
        .expect(200)
        .then(({ body }) => expect(body).toHaveLength(1));
    });
  });

  describe('POST /user:id', () => {
    let user: User;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/user')
        .send(userDTO)
        .expect(201)
        .then(({ body }) => (user = body));
    });

    it('a user should be able to add a task', async () => {
      await request(app.getHttpServer())
        .post(`/user/${user.id}`)
        .send(TaskData)
        .expect(201)
        .then(({ body }) => (user = body));

      await request(app.getHttpServer())
        .get(`/user/${user.id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.tasks).toBeDefined();
          expect(body.tasks).toHaveLength(1);
        });
    });
  });

  describe('POST /user/:id/task', () => {
    let user: User;
    let task: Task;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/user')
        .send(userDTO)
        .expect(201)
        .then(({ body }) => (user = body));

      await request(app.getHttpServer())
        .post('/tasks')
        .send(TaskData)
        .expect(201)
        .then(({ body }) => (task = body));
    });

    it('a user should be able to self-assign a task', async () => {
      await request(app.getHttpServer())
        .post(`/user/${user.id}/task`)
        .send({ id: task.id })
        .expect(201)
        .then(({ body }) => expect(body.tasks).toHaveLength(1));
    });

    it('should increase ammount of tasks for a user if he self-assign tasks', async () => {
      await request(app.getHttpServer())
        .post(`/user/${user.id}/task`)
        .send({ id: task.id })
        .expect(201)
        .then(({ body }) => expect(body.tasks).toHaveLength(1));

      return await request(app.getHttpServer())
        .get(`/user/${user.id}`)
        .expect(200)
        .then(({ body }) => expect(body.tasks).toHaveLength(1));
    });
  });

  describe('DELETE /user/:id/task', () => {
    let user: User;
    let task: Task;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/user')
        .send(userDTO)
        .expect(201)
        .then(({ body }) => (user = body));

      await request(app.getHttpServer())
        .post('/tasks')
        .send(TaskData)
        .expect(201)
        .then(({ body }) => (task = body));

      await request(app.getHttpServer())
        .post(`/user/${user.id}/task`)
        .send({ id: task.id })
        .expect(201)
        .then(({ body }) => expect(body.tasks).toHaveLength(1));
    });

    it('should delete a task successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/user/${user.id}/task`)
        .send({ id: task.id })
        .expect(200);
    });

    it('a task deleted successfyly should decrease amount of tasks', async () => {
      await request(app.getHttpServer())
        .delete(`/user/${user.id}/task`)
        .send({ id: task.id })
        .expect(200);

      await request(app.getHttpServer())
        .get(`/user/${user.id}`)
        .expect(200)
        .then(({ body }) => expect(body.tasks).toHaveLength(0));
    });
  });

  afterEach(async () => {
    let tasks: Task[];

    await request(app.getHttpServer())
      .get('/tasks')
      .then(({ body }) => (tasks = body));

    await request(app.getHttpServer()).delete('/user').expect(200);
    await Promise.allSettled(
      tasks.map((taskEl: Task) => {
        return request(app.getHttpServer()).delete(`/tasks?id=${taskEl.id}`);
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
