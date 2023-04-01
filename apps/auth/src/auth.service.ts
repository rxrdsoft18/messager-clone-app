import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { NewUserDto } from './dtos/new-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
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

    console.log('user', user);

    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt };
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    if (!jwt) throw new UnauthorizedException('Invalid credentials.');

    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (e) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }
}
