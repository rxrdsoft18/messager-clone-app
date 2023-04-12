import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@app/shared/entities/user.entity';
import { firstValueFrom } from 'rxjs';
import { NewMessageDto } from './dtos/new-message.dto';
import { ConversationRepositoryInterface } from '@app/shared/interfaces/conversation.repository.interface';
import { MessageRepositoryInterface } from '@app/shared/interfaces/message.repository.interface';

@Injectable()
export class ChatService {
  constructor(
    @Inject('ConversationsRepositoryInterface')
    private readonly conversationsRepository: ConversationRepositoryInterface,
    @Inject('MessagesRepositoryInterface')
    private readonly messagesRepository: MessageRepositoryInterface,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

   getHello() {
    return 'Hello World!';
  }

  private async getUser(id: number) {
    const ob$ = this.authService.send<User>(
      {
        cmd: 'get-user',
      },
      { id },
    );

    return await firstValueFrom(ob$).catch((err) => console.error(err));
  }

  async getConversations(userId: number) {
    const allConversations =
      await this.conversationsRepository.findWithRelations({
        relations: ['users'],
      });

    const userConversations = allConversations.filter((conversation) => {
      const userIds = conversation.users.map((user) => user.id);
      return userIds.includes(userId);
    });

    return userConversations.map((conversation) => ({
      id: conversation.id,
      userIds: (conversation?.users ?? []).map((user) => user.id),
    }));
  }

  async createConversation(userId: number, friendId: number) {
    const user = await this.getUser(userId);
    const friend = await this.getUser(friendId);

    if (!user || !friend) return;

    const conversation = await this.conversationsRepository.findConversation(
      userId,
      friendId,
    );

    if (!conversation) {
      return await this.conversationsRepository.save({
        users: [user, friend],
      });
    }

    return conversation;
  }

  async createMessage(userId: number, newMessage: NewMessageDto) {
    const user = await this.getUser(userId);

    if (!user) return;

    const conversation = await this.conversationsRepository.findByCondition({
      where: [{ id: newMessage.conversationId }],
      relations: ['users'],
    });

    if (!conversation) return;

    return await this.messagesRepository.save({
      message: newMessage.message,
      user,
      conversation,
    });
  }
}
