import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Injectable()
export class TareasService {
    constructor(
        @InjectRepository(Tarea)
        private tareaRepository: Repository<Tarea>,
    ) { }

    async create(createTareaDto: CreateTareaDto): Promise<Tarea> {
        const tarea = this.tareaRepository.create(createTareaDto);
        return this.tareaRepository.save(tarea);
    }

    async findAll(): Promise<Tarea[]> {
        return this.tareaRepository.find();
    }

    async findOne(id: number): Promise<Tarea> {
        const tarea = await this.tareaRepository.findOneBy({ id });
        if (!tarea) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        return tarea;
    }

    async update(id: number, updateTareaDto: UpdateTareaDto): Promise<Tarea> {
        const tarea = await this.tareaRepository.preload({
            id,
            ...updateTareaDto,
        });
        if (!tarea) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        return this.tareaRepository.save(tarea);
    }

    async remove(id: number): Promise<void> {
        const tarea = await this.tareaRepository.findOneBy({ id });
        if (!tarea) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        await this.tareaRepository.remove(tarea);
    }
}
