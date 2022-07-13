import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const userExists = await this.userRepository.count({
      where: [
        { email: registerUserDto.email },
        { phone: registerUserDto.phone },
      ],
    });
    if (userExists) {
      throw new HttpException(
        'Já existe um usuário com o email ou telefone informado.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    await this.saveUser(registerUserDto);
    return { status: 1 };
  }

  async findByEmail(email: string, returnPassword: boolean): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { email: email },
    });
    if (user && !returnPassword) {
      user.password = null;
    }
    return user;
  }

  async validateUser(email: string, updated_date: string): Promise<User> {
    const user = await this.findByEmail(email, false);
    if (!user) {
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      const token_date: number = updated_date
        ? new Date(updated_date).getTime()
        : new Date().getTime();
      if (token_date != user.updated_date.getTime()) {
        throw new HttpException('Token expirado', HttpStatus.UNAUTHORIZED);
      }
    }
    return user;
  }

  async getHashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async saveUser(registerUserDto: RegisterUserDto) {
    const hash = await this.getHashPassword(registerUserDto.password);
    const user = new User();
    user.name = registerUserDto.name;
    user.email = registerUserDto.email;
    user.password = hash;
    user.phone = registerUserDto.phone;
    return await this.userRepository.save(user);
  }

  async updatePassword(email: string, updatePasswordDto: UpdatePasswordDto) {
    if (updatePasswordDto.password == updatePasswordDto.newPassword) {
      throw new HttpException(
        'A senha atual não pode ser igual a nova senha.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const user: User = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!(await bcrypt.compare(updatePasswordDto.password, user.password))) {
      throw new HttpException(
        'Senha atual inválida.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    user.password = await this.getHashPassword(updatePasswordDto.newPassword);
    await this.userRepository.save(user);
    return this.authService.login(user);
  }
}
