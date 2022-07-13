import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.usersService.findByEmail(req.user.email, false);
  }

  @UseGuards(JwtAuthGuard)
  @Post('updatePassword')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req,
  ) {
    return await this.usersService.updatePassword(
      req.user.email,
      updatePasswordDto,
    );
  }
}
