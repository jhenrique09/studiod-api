import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user: User = await this.usersService.findByEmail(email, true);
    if (user && (await bcrypt.compare(password, user.password))) {
      await this.usersService.updateForceUpdatePassword(user, false);
      const { password, one_time_password, ...result } = user;
      return result;
    } else if (
      user &&
      user.one_time_password &&
      (await bcrypt.compare(password, user.one_time_password))
    ) {
      await this.usersService.updateForceUpdatePassword(user, true);
      const { password, one_time_password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      updated_date: user.updated_date,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
