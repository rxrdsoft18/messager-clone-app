import { FriendRequestEntity } from '@app/shared/entities/friend-request.entity';
import { BaseInterfaceRepository } from '@app/shared/repositories/base/base.interface.repository';

export type FriendRequestRepositoryInterface =
  BaseInterfaceRepository<FriendRequestEntity>;
