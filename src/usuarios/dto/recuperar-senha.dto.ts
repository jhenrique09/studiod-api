import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecuperarSenhaDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
