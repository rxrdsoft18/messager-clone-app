import { MessageEntity } from '@app/shared/entities/message.entity';
import { BaseAbstractRepository } from '@app/shared/repositories/base/base.abstract.repository';

export type MessageRepositoryInterface = BaseAbstractRepository<MessageEntity>;
