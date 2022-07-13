import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
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

  async findByEmail(email: string, returnPassword: boolean): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { email: email },
    });
    if (user && !returnPassword) {
      user.password = null;
    }
    return user;
  }

  async validateUser(email: string): Promise<User> {
    const user = await this.findByEmail(email, false);
    if (!user) {
      throw new HttpException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
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
}
