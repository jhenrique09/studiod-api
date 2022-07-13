import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
