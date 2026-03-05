import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RedeemedGiftCard } from '../data/entities';
import { RedeemDto } from './dto/redeem.dto';
import { ResidentsService } from './residents.service';

@Controller('residents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ResidentsController {
  constructor(private readonly residents: ResidentsService) {}

  @Get(':id/balance')
  getBalance(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() residentId: number,
  ) {
    if (id !== residentId) throw new ForbiddenException();
    return this.residents.getBalance(id);
  }

  @Get(':id/profile')
  getProfile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() residentId: number,
  ) {
    if (id !== residentId) throw new ForbiddenException();
    return this.residents.getProfile(id);
  }

  @Get(':id/my-gift-cards')
  getMyGiftCards(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() residentId: number,
  ): RedeemedGiftCard[] {
    if (id !== residentId) throw new ForbiddenException();
    return this.residents.getMyGiftCards(id);
  }

  @Get(':id/transactions')
  getTransactions(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() residentId: number,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    if (id !== residentId) throw new ForbiddenException();
    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 10;
    return this.residents.getTransactions(id, page, limit);
  }

  @Post(':id/redeem')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  redeem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() residentId: number,
    @Body() dto: RedeemDto,
  ) {
    if (id !== residentId) throw new ForbiddenException();
    return this.residents.redeem(id, dto);
  }
}
