import type { GiftCard } from '../types';
import { SlideToRedeem } from './SlideToRedeem';

interface GiftCardModalProps {
  giftCard: GiftCard | null;
  onClose: () => void;
  onRedeem: (giftCardId: string) => void;
  redeeming: boolean;
  pointsBalance: number;
}

export function GiftCardModal({
  giftCard,
  onClose,
  onRedeem,
  redeeming,
  pointsBalance,
}: GiftCardModalProps) {
  if (!giftCard) return null;

  const canRedeem = pointsBalance >= giftCard.pointCost && !redeeming;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-card-modal-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-t-2xl">
          {giftCard.imageUrl ? (
            <img
              src={giftCard.imageUrl}
              alt={giftCard.brand}
              className="h-40 w-full object-cover"
            />
          ) : (
            <div className="h-40 w-full bg-gray-200" />
          )}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: 'linear-gradient(90deg, #30cfd0, #330867)',
            }}
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-gray-700 hover:bg-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">
          <h2 id="gift-card-modal-title" className="text-xl font-bold text-gray-900">
            {giftCard.brand}
          </h2>
          <p className="mt-1 text-gray-500">{giftCard.name}</p>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Value: <span className="font-medium text-gray-900">{giftCard.value ?? giftCard.name}</span>
            </span>
            <span className="font-bold text-theme-gradient">
              {giftCard.pointCost.toLocaleString()} pts
            </span>
          </div>
          {canRedeem ? (
            <SlideToRedeem
              onConfirm={() => onRedeem(giftCard.id)}
              loading={redeeming}
            />
          ) : (
            <p className="mt-4 text-center text-sm text-gray-500">
              {pointsBalance < giftCard.pointCost
                ? `Need ${(giftCard.pointCost - pointsBalance).toLocaleString()} more pts`
                : 'Redeeming…'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
