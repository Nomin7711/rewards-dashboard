import type { GiftCard } from '../types';

interface FeaturedGiftCardsProps {
  giftCards: GiftCard[];
  onCardClick: (gc: GiftCard) => void;
  pointsBalance: number;
}

export function FeaturedGiftCards({
  giftCards,
  onCardClick,
  pointsBalance,
}: FeaturedGiftCardsProps) {
  if (giftCards.length === 0) return null;
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Featured Gift Cards
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {giftCards.map((gc) => {
          const canRedeem = pointsBalance >= gc.pointCost;
          return (
            <button
              type="button"
              key={gc.id}
              onClick={() => onCardClick(gc)}
              className="min-w-[200px] flex-shrink-0 rounded-xl bg-white text-left shadow-md overflow-hidden hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-theme-teal focus:ring-offset-2"
            >
              <div className="relative h-28 overflow-hidden">
                {gc.imageUrl ? (
                  <img
                    src={gc.imageUrl}
                    alt={gc.brand}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200" />
                )}
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background: 'linear-gradient(90deg, #30cfd0, #330867)',
                  }}
                />
              </div>
              <div className="p-3">
                <p className="font-bold text-gray-900">{gc.brand}</p>
                <p className="text-sm text-gray-500">
                  {gc.value ?? gc.name} Value
                </p>
                <span
                  className="mt-2 inline-block w-full rounded-lg px-3 py-2 text-center text-sm font-medium text-white"
                  style={{
                    background: canRedeem
                      ? 'linear-gradient(90deg, #30cfd0, #330867)'
                      : '#9ca3af',
                  }}
                >
                  {gc.pointCost.toLocaleString()} pts
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
