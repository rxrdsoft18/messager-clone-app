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
    console.log('get-user', context);
    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'register' })
  async register(
    @Ctx() context: RmqContext,
    @Payload() newUserDto: NewUserDto,
  ) {
    console.log('register', newUserDto);
    this.sharedService.acknowledgeMessage(context);
    console.log('register', newUserDto);
    return this.authService.register(newUserDto);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Ctx() context: RmqContext, @Payload() loginDto: LoginDto) {
    console.log('login', loginDto);
    this.sharedService.acknowledgeMessage(context);
    return this.authService.login(loginDto);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtGuard)
  async verifyJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: { jwt: string },
  ) {
    console.log('login', payload);
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
}
