import { IsEmail } from 'class-validator';

export class RecuperarSenhaDto {
  @IsEmail({
    message: 'Informe um email válido',
  })
  email: string;
}
