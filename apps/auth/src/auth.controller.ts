import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from '@app/shared';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUsers(@Ctx() context: RmqContext) {
    // const channel = context.getChannelRef();
    // const message = context.getMessage();
    // channel.ack(message);
    this.sharedService.acknowledgeMessage(context);
    console.log('get-user', context);
    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'post-user' })
  async postUser(@Ctx() context: RmqContext) {
    // const channel = context.getChannelRef();
    // const message = context.getMessage();
    // channel.ack(message);
    // console.log('message', message);
    this.sharedService.acknowledgeMessage(context);
    return this.authService.postUser();
  }
}
