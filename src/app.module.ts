import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotaModule } from './notas/notas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Nota } from './notas/nota.entity';
import { TareasModule } from './tareas/tareas.module';
import { Tarea } from './tareas/tarea.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'notas_db',
      entities: [Nota, Tarea],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    NotaModule,
    TareasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
