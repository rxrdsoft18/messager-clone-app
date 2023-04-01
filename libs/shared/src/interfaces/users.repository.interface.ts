import { BaseInterfaceRepository } from '@app/shared';
import { User } from '../entities/user.entity';

export type UsersRepositoryInterface = BaseInterfaceRepository<User>;
