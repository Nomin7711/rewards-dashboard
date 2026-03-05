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

  @Get(':id/transactions')
  getTransactions(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() residentId: number,
    @Query('limit') limit?: string,
  ) {
    if (id !== residentId) throw new ForbiddenException();
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.residents.getTransactions(id, limitNum);
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
