import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,

    @Inject('PRESENCE_SERVICE')
    private readonly presenceClient: ClientProxy,
  ) {}

  @Get('auth')
  getUsers() {
    return this.authClient.send({ cmd: 'get-users' }, {});
  }

  @Post('auth')
  postUser() {
    return this.authClient.send(
      { cmd: 'post-user' },
      {
        user: 'user',
        firstName: 'firstName',
        lastName: 'lastName',
      },
    );
  }

  @Get('presence')
  getPresence() {
    return this.presenceClient.send({ cmd: 'get-presence' }, {});
  }
}
