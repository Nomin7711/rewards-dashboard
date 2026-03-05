import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';

@Injectable()
export class GiftCardsService {
  constructor(private readonly data: DataService) {}

  findAll() {
    return this.data.getGiftCards();
  }
}
