import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { GiftCardsModule } from './gift-cards/gift-cards.module';
import { ResidentsModule } from './residents/residents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AuthModule,
    DataModule,
    ResidentsModule,
    GiftCardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
