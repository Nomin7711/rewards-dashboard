import { Controller, Get } from '@nestjs/common';
import { GiftCardsService } from './gift-cards.service';

@Controller('gift-cards')
export class GiftCardsController {
  constructor(private readonly giftCards: GiftCardsService) {}

  @Get()
  findAll() {
    return this.giftCards.findAll();
  }
}
