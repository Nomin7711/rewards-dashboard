export interface Balance {
  pointsBalance: number;
  name: string;
}

export interface Transaction {
  id: string;
  residentId: number;
  type: 'earn' | 'redeem' | 'adjustment';
  amount: number;
  description: string;
  createdAt: string;
  metadata?: { giftCardId?: string; giftCardName?: string };
}

export interface GiftCard {
  id: string;
  name: string;
  brand: string;
  pointCost: number;
  imageUrl?: string;
  value?: string;
}

export interface RedeemedGiftCard {
  id: string;
  residentId: number;
  giftCardId: string;
  giftCardName: string;
  brand: string;
  amount: string;
  expirationDate: string;
  code: string;
  redeemedAt: string;
  imageUrl?: string;
}

export interface RedeemResponse {
  pointsBalance: number;
  transaction: Transaction;
  redeemedGiftCards: RedeemedGiftCard[];
}

export interface Profile {
  id: number;
  name: string;
  pointsBalance: number;
}
