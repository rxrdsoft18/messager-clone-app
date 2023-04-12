import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PostgresDBModule, SharedModule } from '@app/shared';
import { RedisModule } from '@app/shared/modules/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { FriendRequestEntity } from '@app/shared/entities/friend-request.entity';
import { ConversationEntity } from '@app/shared/entities/conversation.entity';
import { MessageEntity } from '@app/shared/entities/message.entity';
import { ConversationRepository } from '@app/shared/repositories/conversation.repository';
import { MessageRepository } from '@app/shared/repositories/message.repository';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    PostgresDBModule,
    RedisModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq(
      'PRESENCE_SERVICE',
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
    TypeOrmModule.forFeature([
      User,
      FriendRequestEntity,
      ConversationEntity,
      MessageEntity,
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    {
      provide: 'ConversationsRepositoryInterface',
      useClass: ConversationRepository,
    },
    {
      provide: 'MessagesRepositoryInterface',
      useClass: MessageRepository,
    },
  ],
})
export class ChatModule {}
