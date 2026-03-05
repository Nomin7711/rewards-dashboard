import { useCallback, useEffect, useState } from 'react';
import * as api from '../api/client';
import { FeaturedGiftCards } from '../components/FeaturedGiftCards';
import { GiftCardModal } from '../components/GiftCardModal';
import { MyGiftCardDetailModal } from '../components/MyGiftCardDetailModal';
import { MyGiftCards } from '../components/MyGiftCards';
import { WelcomeCard } from '../components/WelcomeCard';
import { useAuth } from '../context/AuthContext';
import type { GiftCard, RedeemedGiftCard } from '../types';

export function Home() {
  const { auth, refreshBalance } = useAuth();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [myCards, setMyCards] = useState<RedeemedGiftCard[]>([]);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [selectedMyCard, setSelectedMyCard] = useState<RedeemedGiftCard | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!auth.residentId) return;
    try {
      const [gc, my] = await Promise.all([
        api.getGiftCards(),
        api.getMyGiftCards(auth.residentId),
      ]);
      setGiftCards(gc);
      setMyCards(my);
    } catch {
      setGiftCards([]);
      setMyCards([]);
    }
  }, [auth.residentId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRedeem = useCallback(
    async (giftCardId: string) => {
      if (!auth.residentId) return;
      setRedeemingId(giftCardId);
      setMessage(null);
      try {
        const res = await api.redeem(auth.residentId, giftCardId);
        await refreshBalance();
        setMyCards((prev) => [...(res.redeemedGiftCards ?? []), ...prev]);
        setMessage({ type: 'success', text: 'Redeemed successfully!' });
        setSelectedGiftCard(null);
      } catch (e) {
        setMessage({
          type: 'error',
          text: e instanceof Error ? e.message : 'Redemption failed',
        });
      } finally {
        setRedeemingId(null);
      }
    },
    [auth.residentId, refreshBalance],
  );

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
      {message && (
        <div
          className={`rounded-lg px-4 py-2 text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}
      <FeaturedGiftCards
        giftCards={giftCards}
        onCardClick={setSelectedGiftCard}
        pointsBalance={auth.pointsBalance ?? 0}
      />
      <GiftCardModal
        giftCard={selectedGiftCard}
        onClose={() => setSelectedGiftCard(null)}
        onRedeem={handleRedeem}
        redeeming={redeemingId !== null}
        pointsBalance={auth.pointsBalance ?? 0}
      />
      <MyGiftCards cards={myCards} onCardClick={setSelectedMyCard} />
      <MyGiftCardDetailModal
        card={selectedMyCard}
        onClose={() => setSelectedMyCard(null)}
      />
    </div>
  );
}
