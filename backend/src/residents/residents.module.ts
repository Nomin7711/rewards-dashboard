import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ResidentsController } from './residents.controller';
import { ResidentsService } from './residents.service';

@Module({
  imports: [AuthModule],
  controllers: [ResidentsController],
  providers: [ResidentsService],
})
export class ResidentsModule {}
