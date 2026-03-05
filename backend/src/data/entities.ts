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
  imageUrl?: string;
  /** Display value e.g. "$10" */
  value?: string;
  /** Category for filtering: shopping, drinks, beauty, brands */
  category?: string;
}

/** A gift card redeemed by a resident (shows in "My gift cards") */
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
  /** Background/image URL for the card */
  imageUrl?: string;
}
