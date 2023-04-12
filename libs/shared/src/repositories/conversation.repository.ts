import { BaseAbstractRepository } from '@app/shared/repositories/base/base.abstract.repository';
import { ConversationEntity } from '@app/shared/entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ConversationRepository extends BaseAbstractRepository<ConversationEntity> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {
    super(conversationRepository);
  }

  public async findConversation(
    userId: number,
    friendId: number,
  ): Promise<ConversationEntity | undefined> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .orWhere('user.id = :friendId', { friendId })
      .groupBy('conversation.id')
      .having('COUNT(*) > 1')
      .getOne();
  }
}
