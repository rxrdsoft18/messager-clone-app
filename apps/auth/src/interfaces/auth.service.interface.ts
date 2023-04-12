import { UserJwt } from '@app/shared';
import { NewUserDto } from '../dtos/new-user.dto';
import { LoginDto } from '../dtos/login.dto';
import { User } from '@app/shared/entities/user.entity';
import { FriendRequestEntity } from '@app/shared/entities/friend-request.entity';
import {ResponseFriendListDto} from "../dtos/response-friend-list.dto";

export interface AuthServiceInterface {
  getUsers(): Promise<User[]>;
  // getUserById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: number): Promise<User>;
  hashPassword(password: string): Promise<string>;
  register(newUser: Readonly<NewUserDto>): Promise<User>;
  doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
  validateUser(email: string, password: string): Promise<User>;
  login(existingUser: Readonly<LoginDto>): Promise<{
    token: string;
    user: User;
  }>;
  verifyJwt(jwt: string): Promise<{ user: User; exp: number }>;
  getUserFromHeader(jwt: string): Promise<UserJwt>;
  addFriend(userId: number, friendId: number): Promise<FriendRequestEntity>;
  getFriends(userId: number): Promise<FriendRequestEntity[]>;

  getFriendsList(userId: number): Promise<ResponseFriendListDto[]>;
}
