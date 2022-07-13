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
import { RecoverUserPasswordDto } from './dto/recover-user-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { generate } from 'generate-password';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private mailerService: MailerService,
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
      user.one_time_password = null;
    }
    return user;
  }

  async validateUser(
    email: string,
    updated_date: string,
    check_force_update_password: boolean,
  ): Promise<User> {
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
      if (check_force_update_password && user.force_password_update) {
        throw new HttpException(
          'Alteração de senha necessária',
          HttpStatus.UNAUTHORIZED,
        );
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
    if (
      !(await bcrypt.compare(updatePasswordDto.password, user.password)) &&
      !(await bcrypt.compare(
        updatePasswordDto.password,
        user.one_time_password,
      ))
    ) {
      throw new HttpException(
        'Senha atual inválida.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    user.password = await this.getHashPassword(updatePasswordDto.newPassword);
    user.one_time_password = null;
    user.force_password_update = false;
    await this.userRepository.save(user);
    return this.authService.login(user);
  }

  async updateForceUpdatePassword(user: User, one_time_password: boolean) {
    if (one_time_password) {
      user.password = user.one_time_password;
      user.one_time_password = null;
      user.force_password_update = true;
      await this.userRepository.save(user);
    } else if (user.one_time_password != null) {
      user.force_password_update = false;
      user.one_time_password = null;
      await this.userRepository.save(user);
    }
  }

  async recoverPassword(recoverUserPasswordDto: RecoverUserPasswordDto) {
    const user: User = await this.userRepository.findOne({
      where: {
        email: recoverUserPasswordDto.email,
      },
    });
    if (!user) {
      throw new HttpException(
        'Não existe nenhum usuário com o email especificado.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const one_time_password = generate({
      length: 12,
      numbers: true,
    });
    user.one_time_password = await this.getHashPassword(one_time_password);
    await this.userRepository.save(user);
    const mail = {
      to: user.email,
      from: process.env.MAIL_FROM,
      subject: 'Recuperação de senha',
      template: 'recover-password',
      context: {
        one_time_password: one_time_password,
      },
    };
    await this.mailerService.sendMail(mail);
    return { status: 1 };
  }
}
