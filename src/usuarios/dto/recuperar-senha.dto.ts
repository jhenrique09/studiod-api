import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecuperarSenhaDto {
  @IsEmail(
    {},
    {
      message: 'Informe um email válido',
    },
  )
  @ApiProperty({
    example: 'joao@gmail.com',
  })
  email: string;
}
