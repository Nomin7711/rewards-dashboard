import type { GiftCard } from '../types';

interface GiftCardsGridProps {
  giftCards: GiftCard[];
  onCardClick: (gc: GiftCard) => void;
  pointsBalance: number;
}

export function GiftCardsGrid({
  giftCards,
  onCardClick,
  pointsBalance,
}: GiftCardsGridProps) {
  if (giftCards.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">
        No gift cards in this category.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {giftCards.map((gc) => {
        const canRedeem = pointsBalance >= gc.pointCost;
        return (
          <button
            type="button"
            key={gc.id}
            onClick={() => onCardClick(gc)}
            className="rounded-xl bg-white text-left shadow-md overflow-hidden hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-theme-teal focus:ring-offset-2"
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
  );
}
