import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { NewUserDto } from './dtos/new-user.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@app/shared';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,

    @Inject('PRESENCE_SERVICE')
    private readonly presenceClient: ClientProxy,
  ) {}

  @Get('users')
  getUsers() {
    return this.authClient.send({ cmd: 'get-users' }, {});
  }
  @UseGuards(AuthGuard)
  @Get('presence')
  getPresence() {
    return this.presenceClient.send({ cmd: 'get-presence' }, {});
  }

  @Post('auth/register')
  register(@Body(ValidationPipe) newUserDto: NewUserDto) {
    console.log(newUserDto);
    return this.authClient.send({ cmd: 'register' }, newUserDto);
  }

  @Post('auth/login')
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    console.log(loginDto);
    return this.authClient.send({ cmd: 'login' }, loginDto);
  }
}
