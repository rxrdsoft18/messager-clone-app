import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import {
  SharedModule,
  PostgresDBModule,
  SharedService,
  FriendRequestRepository,
  UsersRepository,
} from '@app/shared';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt.guard';
import { JwtStrategy } from './jwt-strategy';
import { FriendRequestEntity } from '@app/shared/entities/friend-request.entity';
import { MessageEntity } from '@app/shared/entities/message.entity';
import { ConversationEntity } from '@app/shared/entities/conversation.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),

    SharedModule,
    PostgresDBModule,
    TypeOrmModule.forFeature([
      User,
      FriendRequestEntity,
      MessageEntity,
      ConversationEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtGuard,
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
    {
      provide: 'FriendRequestRepositoryInterface',
      useClass: FriendRequestRepository,
    },
  ],
})
export class AuthModule {}
