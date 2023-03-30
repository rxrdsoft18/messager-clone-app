import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  getPresence(): string {
    return 'Hello World!';
  }
}
