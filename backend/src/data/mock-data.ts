import { GiftCard, Resident, Transaction } from './entities';

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
    imageUrl: 'https://picsum.photos/200/120?random=amazon',
  },
  {
    id: 'gc-starbucks',
    name: '$10 Starbucks',
    brand: 'Starbucks',
    pointCost: 1000,
    imageUrl: 'https://picsum.photos/200/120?random=starbucks',
  },
  {
    id: 'gc-target',
    name: '$25 Target',
    brand: 'Target',
    pointCost: 2500,
    imageUrl: 'https://picsum.photos/200/120?random=target',
  },
  {
    id: 'gc-doordash',
    name: '$15 DoorDash',
    brand: 'DoorDash',
    pointCost: 1500,
    imageUrl: 'https://picsum.photos/200/120?random=doordash',
  },
];
