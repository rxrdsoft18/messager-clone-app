import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService, SharedServiceInterface } from '@app/shared';
import { NewUserDto } from './dtos/new-user.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtGuard } from './jwt.guard';
import { AuthServiceInterface } from './interfaces/auth.service.interface';

@Controller()
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthServiceInterface,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedServiceInterface, // private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUsers(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'register' })
  async register(
    @Ctx() context: RmqContext,
    @Payload() newUserDto: NewUserDto,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.register(newUserDto);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Ctx() context: RmqContext, @Payload() loginDto: LoginDto) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.login(loginDto);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtGuard)
  async verifyJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.verifyJwt(payload.jwt);
  }

  @MessagePattern({ cmd: 'decode-jwt' })
  async decodeJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getUserFromHeader(payload.jwt);
  }

  @MessagePattern({ cmd: 'add-friend' })
  async addFriend(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: number; friendId: number },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.addFriend(payload.userId, payload.friendId);
  }

  @MessagePattern({ cmd: 'get-friends' })
  async getFriends(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: number },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getFriends(payload.userId);
  }
}
