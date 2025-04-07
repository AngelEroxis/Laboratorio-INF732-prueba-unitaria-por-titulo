import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { Tarea } from './tarea.entity';

@Controller('tareas')
export class TareasController {
    constructor(private readonly tareasService: TareasService) { }

    @Post()
    async create(@Body() createTareaDto: CreateTareaDto): Promise<Tarea> {
        return this.tareasService.create(createTareaDto);
    }

    @Get()
    async findAll(): Promise<Tarea[]> {
        return this.tareasService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Tarea> {
        return this.tareasService.findOne(+id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateTareaDto: UpdateTareaDto,
    ): Promise<Tarea> {
        return this.tareasService.update(+id, updateTareaDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.tareasService.remove(+id);
    }
}
