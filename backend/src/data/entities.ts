export interface Resident {
  id: number;
  name: string;
  pointsBalance: number;
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
}
