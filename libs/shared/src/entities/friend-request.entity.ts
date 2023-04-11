import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@app/shared/entities/user.entity';

@Entity('friend_request')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (userEntity) => userEntity.friendRequestCreator)
  creator: User;

  @ManyToOne(() => User, (userEntity) => userEntity.friendRequestReceiver)
  receiver: User;
}
