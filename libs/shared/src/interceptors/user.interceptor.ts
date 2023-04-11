import {CallHandler, ExecutionContext, Inject, NestInterceptor} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, switchMap } from 'rxjs';
import { UserJwt } from '@app/shared';

export class UserInterceptor implements NestInterceptor {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    if (ctx.getType() !== 'http') return next.handle();

    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) return next.handle();

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) return next.handle();

    return this.authClient
      .send<UserJwt>({ cmd: 'decode-jwt' }, { jwt: token })
      .pipe(
        switchMap(({ user }) => {
          request.user = user;
          return next.handle();
        }),
        catchError(() => next.handle()),
      );
  }
}
