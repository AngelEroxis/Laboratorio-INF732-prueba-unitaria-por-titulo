import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateNotaDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty({ message: 'El contenido es requerido' })
  @IsOptional()
  content?: string;
}
