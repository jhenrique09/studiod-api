import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { appConstants } from '../app.constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(appConstants.user_repository)
    private userRepository: Repository<User>,
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
    return await this.saveUser(registerUserDto);
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
}
