import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RecoverUserPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
