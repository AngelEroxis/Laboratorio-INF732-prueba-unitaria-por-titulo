import { Test, TestingModule } from '@nestjs/testing';
import { NotasService } from './notas.service';
import { ObjectLiteral, Repository, UpdateResult } from 'typeorm';
import { Nota } from './nota.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { find } from 'rxjs';
import { title } from 'process';
import { strict } from 'assert';
import { Like } from 'typeorm';


const mockNotaRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByTitle: jest.fn(),
});

const mockNota = {
  id: 1,
  title: 'Test Nota',
  content: 'Test Content',
};

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('NotasService', () => {
  let service: NotasService;
  let repository: MockRepository<Nota>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotasService,
        {
          provide: getRepositoryToken(Nota),
          useValue: mockNotaRepository(),
        },
      ],
    }).compile();

    service = module.get<NotasService>(NotasService);
    repository = module.get<MockRepository<Nota>>(getRepositoryToken(Nota));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Pruebas
  it('Deberia crear una nueva nota', async () =>{
    jest.spyOn(repository, 'save').mockResolvedValue(mockNota as Nota);

    const result = await service.create({
      title: 'Test Nota',
      content: 'Test Content',
    });

    expect(result).toEqual(mockNota);

    expect(repository.save).toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalled();

    //Otra forma
    /* expect(repository.create).toHaveBeenCalledWith(
      {
        title: 'Test Nota',
        content: 'Test Content',
      }
    ); */
  });

  //Para Buscar Todas las Notas
  it('Debeeria encontrar todas las Notas', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([mockNota] as Nota[]);

    const result = await service.findAll();
    expect(result).toEqual([mockNota]);

    expect(repository.find).toHaveBeenCalled();
  });

  //Para Buscar Notas Por ID
  describe('findOne', () => {
    describe('cuando la nota existe', () => {
      it('deberia encontrar una nota por id', async () => {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockNota as Nota);

        const id: number = 1;
        const result = await service.findOne(id);
        expect(result).toEqual(mockNota);

        expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      });
    });

    describe('cuando la nota NO existe', () => {
      it('deberia lanzar una excepcion', async () => {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

        const id: number = 999;
        //const result = await service.findOne(id);
        await expect(service.findOne(id)).rejects.toThrow(NotFoundException);

        expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      });
    });
  });

  //Para Eiminiar
  describe('eliminar nota', () => {
    describe('cuando la nota existe', () => {
      it('deberia eliminar una nota por id', async () => {
        jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 });

        const id = 1;
        await service.remove(id);

        expect(repository.delete).toHaveBeenCalledWith(id);
      });
    });

    describe('cuando la nota NO existe', () => {
      it('deberia lanzar una excepcion', async () => {
        jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 });

        const id: number = 999;
        await expect(service.remove(id)).rejects.toThrow(NotFoundException);

        expect(repository.delete).toHaveBeenCalledWith(id);
      });
    });
  });
  //Lab Hacer Prueba unitaria del titulo

  describe('findByTitle', () => {
    it('debería devolver las notas cuyo título contenga la palabra clave', async () => {
      const title = 'Test'; // Palabra clave de busqueda
      const mockNotas: Nota[] = [
        { id: 1, title: 'Test Nota 1', content: 'Content 1' },
        { id: 2, title: 'Another Test Nota', content: 'Content 2' },
      ];

      // Mockear el repositorio para que devuelva las notas
      jest.spyOn(repository, 'find').mockResolvedValue(mockNotas);

      // Llamamos a la función findByTitle con la palabra clave 'Test'
      const result = await service.findByTitle(title);

      // Verificamos que la función find haya sido llamada con el filtro correcto
      expect(repository.find).toHaveBeenCalledWith({
        where: {
          title: Like(`%${title}%`),
        },
      });

      // Verificamos que el resultado sea el esperado
      expect(result).toEqual(mockNotas);
    });

    it('debería devolver un arreglo vacío si no se encuentran coincidencias', async () => {
      const title = 'Nonexistent Title';
      const mockNotas: Nota[] = [];

      // Mockear el repositorio para que devuelva un arreglo vacío
      jest.spyOn(repository, 'find').mockResolvedValue(mockNotas);

      // Llamamos a la función findByTitle con un título inexistente
      const result = await service.findByTitle(title);

      // Verificamos que el resultado sea un arreglo vacío
      expect(result).toEqual([]);
    });
  });
});
