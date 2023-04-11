import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '@app/shared';

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq(
      'PRESENCE_SERVICE',
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
