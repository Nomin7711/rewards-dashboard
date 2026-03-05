import { useCallback, useEffect, useState } from 'react';
import * as api from '../api/client';
import { FeaturedGiftCards } from '../components/FeaturedGiftCards';
import { GiftCardModal } from '../components/GiftCardModal';
import { WelcomeCard } from '../components/WelcomeCard';
import { useAuth } from '../context/AuthContext';
import type { GiftCard } from '../types';

export function Rewards() {
  const { auth, refreshBalance } = useAuth();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const gc = await api.getGiftCards();
      setGiftCards(gc);
    } catch {
      setGiftCards([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRedeem = useCallback(
    async (giftCardId: string) => {
      if (!auth.residentId) return;
      setRedeemingId(giftCardId);
      setMessage(null);
      try {
        await api.redeem(auth.residentId, giftCardId);
        await refreshBalance();
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
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Redeem with points
        </h2>
        <FeaturedGiftCards
          giftCards={giftCards}
          onCardClick={setSelectedGiftCard}
          pointsBalance={auth.pointsBalance ?? 0}
        />
      </section>
      <GiftCardModal
        giftCard={selectedGiftCard}
        onClose={() => setSelectedGiftCard(null)}
        onRedeem={handleRedeem}
        redeeming={redeemingId !== null}
        pointsBalance={auth.pointsBalance ?? 0}
      />
    </div>
  );
}
