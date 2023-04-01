import { BaseInterfaceRepository } from '@app/shared';
import { User } from '../entities/user.entity';

export interface UsersRepositoryInterface extends BaseInterfaceRepository<User> {}
