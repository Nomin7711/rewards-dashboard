import type { RedeemedGiftCard } from '../types';

function maskCode(code: string): string {
  const parts = code.split('-');
  if (parts.length >= 4) {
    return `.... .... ${parts[parts.length - 1]}`;
  }
  return code.slice(-4).padStart(12, '.');
}

function formatExpiry(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface MyGiftCardsProps {
  cards: RedeemedGiftCard[];
  onCardClick?: (card: RedeemedGiftCard) => void;
}

export function MyGiftCards({ cards, onCardClick }: MyGiftCardsProps) {
  if (cards.length === 0) {
    return (
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          My Gift Cards
        </h2>
        <p className="rounded-xl bg-white p-6 text-gray-500 shadow-md">
          No gift cards yet. Redeem from Featured Gift Cards above.
        </p>
      </section>
    );
  }
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        My Gift Cards
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <button
            type="button"
            key={card.id}
            onClick={() => onCardClick?.(card)}
            className="overflow-hidden rounded-xl bg-white shadow-md text-left hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-theme-teal focus:ring-offset-2"
          >
            <div
              className="relative flex flex-col justify-end p-5 text-white min-h-[140px]"
              style={
                card.imageUrl
                  ? {
                      backgroundImage: `linear-gradient(90deg, rgba(48,207,208,0.9), rgba(51,8,103,0.9)), url(${card.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : {
                      background: 'linear-gradient(90deg, #30cfd0, #330867)',
                    }
              }
            >
              <p className="text-xs opacity-90">Gift Card</p>
              <p className="text-xl font-bold">{card.brand}</p>
              <p className="text-sm font-mono opacity-90">
                Card Number {maskCode(card.code)}
              </p>
            </div>
            <div className="flex justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-700">
              <span>Value {card.amount}</span>
              <span>Expires {formatExpiry(card.expirationDate)}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
