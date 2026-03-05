import { useCallback, useEffect, useState } from 'react';
import * as api from '../api/client';
import { FeaturedGiftCards } from '../components/FeaturedGiftCards';
import { GiftCardModal } from '../components/GiftCardModal';
import { WelcomeCard } from '../components/WelcomeCard';
import { useAuth } from '../context/AuthContext';
import type { GiftCard } from '../types';

const EARN_POINTS_IDEAS: {
  title: string;
  description: string;
  points: string;
}[] = [
  {
    title: 'Share on social media',
    description: 'Post about your community and earn points when you share.',
    points: 'Up to 25 pts',
  },
  {
    title: 'Answer daily quiz',
    description: 'Complete the daily quiz to earn bonus points.',
    points: '10–50 pts',
  },
  {
    title: 'Refer a friend',
    description: 'Invite friends to join; earn points when they sign a lease.',
    points: '500 pts per referral',
  },
  {
    title: 'Lucky Wheel',
    description: 'Spin the wheel for a chance to win extra points.',
    points: '25–250 pts',
  },
  {
    title: 'Participate at gatherings',
    description: 'Attend events, post a photo, and earn points.',
    points: 'Up to 100 pts',
  },
  {
    title: 'Renew contract',
    description: 'Renew your lease and receive a points bonus.',
    points: '1,000 pts',
  },
];

export function Home() {
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

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Earn Points</h2>
        <p className="mb-4 text-sm text-gray-600">
          Here are some ways you can earn more points:
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EARN_POINTS_IDEAS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <span
                  className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  style={{
                    background: 'linear-gradient(90deg, #30cfd0, #330867)',
                  }}
                >
                  {item.points}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
