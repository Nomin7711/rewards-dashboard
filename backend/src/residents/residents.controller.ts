import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ResidentsService } from './residents.service';
import { RedeemDto } from './dto/redeem.dto';

@Controller('residents')
export class ResidentsController {
  constructor(private readonly residents: ResidentsService) {}

  @Get(':id/balance')
  getBalance(@Param('id', ParseIntPipe) id: number) {
    return this.residents.getBalance(id);
  }

  @Get(':id/transactions')
  getTransactions(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.residents.getTransactions(id, limitNum);
  }

  @Post(':id/redeem')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  redeem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RedeemDto,
  ) {
    return this.residents.redeem(id, dto);
  }
}
