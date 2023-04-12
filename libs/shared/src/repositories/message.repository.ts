import { BaseAbstractRepository } from '@app/shared/repositories/base/base.abstract.repository';
import { MessageEntity } from '@app/shared/entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageRepository extends BaseAbstractRepository<MessageEntity> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {
    super(messageRepository);
  }
}
