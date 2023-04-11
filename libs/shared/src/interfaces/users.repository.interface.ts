
import { User } from '../entities/user.entity';
import {BaseInterfaceRepository} from "@app/shared/repositories/base/base.interface.repository";

export type UsersRepositoryInterface = BaseInterfaceRepository<User>;
