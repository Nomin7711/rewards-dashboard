import { useCallback, useEffect, useState } from 'react';
import * as api from '../api/client';
import { MyGiftCardDetailModal } from '../components/MyGiftCardDetailModal';
import { MyGiftCards } from '../components/MyGiftCards';
import { WelcomeCard } from '../components/WelcomeCard';
import { useAuth } from '../context/AuthContext';
import type { RedeemedGiftCard } from '../types';

export function MyCards() {
  const { auth } = useAuth();
  const [myCards, setMyCards] = useState<RedeemedGiftCard[]>([]);
  const [selectedMyCard, setSelectedMyCard] = useState<RedeemedGiftCard | null>(null);

  const load = useCallback(async () => {
    if (!auth.residentId) return;
    try {
      const cards = await api.getMyGiftCards(auth.residentId);
      setMyCards(cards);
    } catch {
      setMyCards([]);
    }
  }, [auth.residentId]);

  useEffect(() => {
    load();
  }, [load]);

  if (auth.loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WelcomeCard name={auth.name} pointsBalance={auth.pointsBalance} />
      <MyGiftCards cards={myCards} onCardClick={setSelectedMyCard} />
      <MyGiftCardDetailModal
        card={selectedMyCard}
        onClose={() => setSelectedMyCard(null)}
      />
    </div>
  );
}
