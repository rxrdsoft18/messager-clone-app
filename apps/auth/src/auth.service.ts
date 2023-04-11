import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@app/shared/entities/user.entity';
import { NewUserDto } from './dtos/new-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserJwt, UsersRepositoryInterface } from '@app/shared';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { FriendRequestEntity } from '@app/shared/entities/friend-request.entity';
import { FriendRequestRepositoryInterface } from '@app/shared/interfaces/friend-request.repository.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly userRepository: UsersRepositoryInterface,

    @Inject('FriendRequestRepositoryInterface')
    private readonly friendsRepository: FriendRequestRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async getFriends(userId: number): Promise<FriendRequestEntity[]> {
    const creator = await this.findById(userId);
    return await this.friendsRepository.findWithRelations({
      where: [{ creator }, { receiver: creator }],
      relations: ['creator', 'receiver'],
    });
  }

  async addFriend(
    userId: number,
    friendId: number,
  ): Promise<FriendRequestEntity> {
    const creator = await this.findById(userId);
    const receiver = await this.findById(friendId);

    return this.friendsRepository.save({ creator, receiver });
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findByCondition({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(newUserDto: Readonly<NewUserDto>): Promise<User> {
    const existingUser = await this.findByEmail(newUserDto.email);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const hashedPassword = await this.hashPassword(newUserDto.password);

    const user = new User();
    user.firstName = newUserDto.firstName;
    user.lastName = newUserDto.lastName;
    user.email = newUserDto.email;
    user.password = hashedPassword;

    const userCreated = await this.userRepository.save(user);
    delete userCreated.password;

    return userCreated;
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (!user) return null;

    const isPasswordMatching = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!isPasswordMatching) return null;

    delete user.password;
    return user;
  }

  async login(loginDto: Readonly<LoginDto>) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) throw new UnauthorizedException('Invalid credentials.');
    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt, user };
  }

  async verifyJwt(jwt: string): Promise<{ user: User; exp: number }> {
    if (!jwt) throw new UnauthorizedException('Invalid credentials.');

    try {
      const { user, exp } = await this.jwtService.verifyAsync(jwt);
      return { user, exp };
    } catch (e) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOneById(id);
  }

  async getUserFromHeader(jwt: string): Promise<UserJwt> {
    if (!jwt) return;

    try {
      return this.jwtService.decode(jwt) as UserJwt;
    } catch (e) {
      throw new BadRequestException('Invalid token.');
    }
  }
}
