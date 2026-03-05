import { GiftCard, RedeemedGiftCard, Resident, Transaction } from './entities';

export const initialResidents: Resident[] = [
  { id: 1, name: 'Alex Rivera', pointsBalance: 2500 },
  { id: 2, name: 'Jordan Lee', pointsBalance: 800 },
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    residentId: 1,
    type: 'earn',
    amount: 500,
    description: 'Rent payment on time',
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'tx-2',
    residentId: 1,
    type: 'earn',
    amount: 2000,
    description: 'Lease renewal bonus',
    createdAt: '2025-02-15T10:00:00Z',
  },
  {
    id: 'tx-3',
    residentId: 1,
    type: 'redeem',
    amount: -500,
    description: 'Redeemed: Amazon Gift Card',
    createdAt: '2025-03-01T14:30:00Z',
    metadata: { giftCardId: 'gc-amazon', giftCardName: 'Amazon Gift Card' },
  },
];

export const initialGiftCards: GiftCard[] = [
  {
    id: 'gc-amazon',
    name: 'Amazon Gift Card',
    brand: 'Amazon',
    pointCost: 500,
    value: '$5',
    imageUrl: 'https://picsum.photos/200/120?random=amazon',
    category: 'shopping',
  },
  {
    id: 'gc-starbucks',
    name: '$10 Starbucks',
    brand: 'Starbucks',
    pointCost: 1000,
    value: '$10',
    imageUrl: 'https://picsum.photos/200/120?random=starbucks',
    category: 'drinks',
  },
  {
    id: 'gc-target',
    name: '$25 Target',
    brand: 'Target',
    pointCost: 2500,
    value: '$25',
    imageUrl: 'https://picsum.photos/200/120?random=target',
    category: 'shopping',
  },
  {
    id: 'gc-doordash',
    name: '$15 DoorDash',
    brand: 'DoorDash',
    pointCost: 1500,
    value: '$15',
    imageUrl: 'https://picsum.photos/200/120?random=doordash',
    category: 'drinks',
  },
  {
    id: 'gc-dunkin',
    name: "$10 Dunkin'",
    brand: "Dunkin'",
    pointCost: 1000,
    value: '$10',
    imageUrl: 'https://picsum.photos/200/120?random=dunkin',
    category: 'drinks',
  },
  {
    id: 'gc-sephora',
    name: '$25 Sephora',
    brand: 'Sephora',
    pointCost: 2500,
    value: '$25',
    imageUrl: 'https://picsum.photos/200/120?random=sephora',
    category: 'beauty',
  },
  {
    id: 'gc-ulta',
    name: '$20 Ulta',
    brand: 'Ulta',
    pointCost: 2000,
    value: '$20',
    imageUrl: 'https://picsum.photos/200/120?random=ulta',
    category: 'beauty',
  },
  {
    id: 'gc-nike',
    name: '$50 Nike',
    brand: 'Nike',
    pointCost: 5000,
    value: '$50',
    imageUrl: 'https://picsum.photos/200/120?random=nike',
    category: 'brands',
  },
  {
    id: 'gc-apple',
    name: '$25 Apple',
    brand: 'Apple',
    pointCost: 2500,
    value: '$25',
    imageUrl: 'https://picsum.photos/200/120?random=apple',
    category: 'brands',
  },
];

export const initialRedeemedGiftCards: RedeemedGiftCard[] = [
  {
    id: 'rgc-1',
    residentId: 1,
    giftCardId: 'gc-amazon',
    giftCardName: 'Amazon Gift Card',
    brand: 'Amazon',
    amount: '$5',
    expirationDate: '2026-03-01',
    code: 'AMZN-XXXX-1234-5678',
    redeemedAt: '2025-03-01T14:30:00Z',
    imageUrl: 'https://picsum.photos/200/120?random=amazon',
  },
];
