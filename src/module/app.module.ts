import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseController } from './app.controller';
import { TasksModule } from './tasks/tasks.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'todo-db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TasksModule,
    UserModule,
  ],
  controllers: [BaseController],
  providers: [],
})
export class AppModule {}
