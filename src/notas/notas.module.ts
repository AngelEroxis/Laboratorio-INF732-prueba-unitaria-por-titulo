import { Module } from '@nestjs/common';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nota } from './nota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nota])],
  providers: [NotasService],
  controllers: [NotasController],
})
export class NotaModule {}
