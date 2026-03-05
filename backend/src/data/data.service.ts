/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- in-memory data layer with typed entities */
import { Injectable } from '@nestjs/common';
import { GiftCard, RedeemedGiftCard, Resident, Transaction } from './entities';
import {
  initialGiftCards,
  initialRedeemedGiftCards,
  initialResidents,
  initialTransactions,
} from './mock-data';

function generateRedemptionCode(prefix: string): string {
  const segment = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `${prefix}-${segment()}-${segment()}-${segment()}`;
}

@Injectable()
export class DataService {
  private residents: Resident[] = [...initialResidents];
  private transactions: Transaction[] = [...initialTransactions];
  private giftCards: GiftCard[] = [...initialGiftCards];
  private redeemedGiftCards: RedeemedGiftCard[] = [...initialRedeemedGiftCards];
  private transactionIdCounter = 100;
  private redeemedGiftCardIdCounter = 100;

  getResidents(): Resident[] {
    return this.residents;
  }

  getResidentById(id: number): Resident | undefined {
    return this.residents.find((r) => r.id === id);
  }

  getTransactionsByResidentId(residentId: number): Transaction[] {
    return this.transactions
      .filter((t) => t.residentId === residentId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  getGiftCards(): GiftCard[] {
    return this.giftCards;
  }

  getGiftCardById(id: string): GiftCard | undefined {
    return this.giftCards.find((g) => g.id === id);
  }

  deductPointsAndRecordTransaction(
    residentId: number,
    amount: number,
    description: string,
    metadata?: Transaction['metadata'],
  ): Transaction | null {
    const resident = this.getResidentById(residentId);
    if (!resident || resident.pointsBalance < amount) return null;

    resident.pointsBalance -= amount;
    const tx: Transaction = {
      id: `tx-${this.transactionIdCounter++}`,
      residentId,
      type: 'redeem',
      amount: -amount,
      description,
      createdAt: new Date().toISOString(),
      metadata,
    };
    this.transactions.push(tx);
    return tx;
  }

  getRedeemedGiftCardsByResidentId(residentId: number): RedeemedGiftCard[] {
    return this.redeemedGiftCards
      .filter((r: RedeemedGiftCard) => r.residentId === residentId)
      .sort(
        (a: RedeemedGiftCard, b: RedeemedGiftCard) =>
          new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime(),
      );
  }

  addRedeemedGiftCard(
    residentId: number,
    giftCard: GiftCard,
  ): RedeemedGiftCard {
    const redeemedAt = new Date();
    const expirationDate = new Date(redeemedAt);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    const prefix = giftCard.brand.toUpperCase().slice(0, 4);
    const code = generateRedemptionCode(prefix);
    const record: RedeemedGiftCard = {
      id: `rgc-${this.redeemedGiftCardIdCounter++}`,
      residentId,
      giftCardId: giftCard.id,
      giftCardName: giftCard.name,
      brand: giftCard.brand,
      amount: giftCard.value ?? giftCard.name,
      expirationDate: expirationDate.toISOString().slice(0, 10),
      code,
      redeemedAt: redeemedAt.toISOString(),
      imageUrl: giftCard.imageUrl,
    };
    this.redeemedGiftCards.push(record);
    return record;
  }
}
