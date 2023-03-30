import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRequest } from './jwt-request.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: JwtRequest) => {
          return request?.jwt;
        },
      ]),
    });
  }

  async validate(payload: any) {
    // return { userId: payload.sub, username: payload.username };
    return { ...payload };
  }
}
