import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { NewUserDto } from './dtos/new-user.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard, UserInterceptor, UserRequest } from '@app/shared';

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
    console.log('getUsers()', 'get-users');
    return this.authClient.send({ cmd: 'get-users' }, {});
  }
  @UseGuards(AuthGuard)
  @Get('presence')
  getPresence() {
    console.log('getPresence()', 'get-presence');
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

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Post('add-friend/:friendId')
  async addFriend(
    @Req() req: UserRequest,
    @Param('friendId') friendId: number,
  ) {
    if (!req?.user) {
      throw new BadRequestException('User not found');
    }

    if (req.user.id == friendId) {
      throw new BadRequestException('You cannot add yourself as a friend');
    }

    return this.authClient.send(
      { cmd: 'add-friend' },
      {
        userId: req.user.id,
        friendId,
      },
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-friends')
  async getFriends(@Req() req: UserRequest) {
    if (!req?.user) {
      throw new BadRequestException('User not found');
    }

    return this.authClient.send(
      { cmd: 'get-friends' },
      { userId: req.user.id },
    );
  }
}
