import { ConversationEntity } from '@app/shared/entities/conversation.entity';
import { BaseInterfaceRepository } from '@app/shared/repositories/base/base.interface.repository';

export interface ConversationRepositoryInterface
  extends BaseInterfaceRepository<ConversationEntity> {
  findConversation(
    userId: number,
    friendId: number,
  ): Promise<ConversationEntity | undefined>;
}
