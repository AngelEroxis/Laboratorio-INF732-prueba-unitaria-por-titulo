import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTareaDto {
    @IsString()
    @IsNotEmpty({ message: 'The title is required' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'The content is required' })
    content: string;

    @IsString()
    @IsNotEmpty({ message: 'The content is required' })
    completed: boolean;

    @IsString()
    @IsNotEmpty({ message: 'The content is required' })
    created: Date;
}
