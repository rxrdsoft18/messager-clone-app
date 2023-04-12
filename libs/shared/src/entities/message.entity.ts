import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@app/shared/entities/user.entity';
import { ConversationEntity } from '@app/shared/entities/conversation.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => User, (userEntity) => userEntity.messages)
  user: User;

  @ManyToOne(
    () => ConversationEntity,
    (conversationEntity) => conversationEntity.messages,
  )
  conversation: ConversationEntity;

  @CreateDateColumn()
  createdAt: Date;
}
