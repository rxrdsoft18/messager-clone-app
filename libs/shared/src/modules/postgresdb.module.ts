import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('POSTGRES_URI', configService.get('POSTGRES_URI'));
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true, // should be false in production
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class PostgresDBModule {}
