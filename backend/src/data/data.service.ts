import { Injectable } from '@nestjs/common';
import { GiftCard, Resident, Transaction } from './entities';
import {
  initialGiftCards,
  initialResidents,
  initialTransactions,
} from './mock-data';

@Injectable()
export class DataService {
  private residents: Resident[] = [...initialResidents];
  private transactions: Transaction[] = [...initialTransactions];
  private giftCards: GiftCard[] = [...initialGiftCards];
  private transactionIdCounter = 100;

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
}
