import { useState } from 'react';
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

interface MyGiftCardDetailModalProps {
  card: RedeemedGiftCard | null;
  onClose: () => void;
}

export function MyGiftCardDetailModal({ card, onClose }: MyGiftCardDetailModalProps) {
  const [showShare, setShowShare] = useState(false);
  const [email, setEmail] = useState('');
  const [shareSent, setShareSent] = useState(false);

  if (!card) return null;

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShareSent(true);
    setShowShare(false);
    setEmail('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-gift-card-modal-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div
            className="relative flex flex-col justify-end p-6 text-white min-h-[180px]"
            style={
              card.imageUrl
                ? {
                    backgroundImage: `linear-gradient(90deg, rgba(48,207,208,0.85), rgba(51,8,103,0.85)), url(${card.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {
                    background: 'linear-gradient(90deg, #30cfd0, #330867)',
                  }
            }
          >
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
            <p className="text-xs opacity-90">Gift Card</p>
            <h2 id="my-gift-card-modal-title" className="text-2xl font-bold">
              {card.brand}
            </h2>
            <p className="mt-1 font-mono text-sm opacity-90">
              Card Number {maskCode(card.code)}
            </p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Value</span>
            <span className="font-medium text-gray-900">{card.amount}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Expires</span>
            <span className="font-medium text-gray-900">
              {formatExpiry(card.expirationDate)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Redeemed</span>
            <span className="font-medium text-gray-900">
              {new Date(card.redeemedAt).toLocaleDateString()}
            </span>
          </div>

          {shareSent ? (
            <p className="rounded-lg bg-green-100 py-2 text-center text-sm font-medium text-green-800">
              Message sent successfully
            </p>
          ) : showShare ? (
            <form onSubmit={handleShareSubmit} className="space-y-3">
              <label htmlFor="share-email" className="block text-sm font-medium text-gray-700">
                Send to email
              </label>
              <input
                id="share-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowShare(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg py-2 text-sm font-medium text-white"
                  style={{ background: 'linear-gradient(90deg, #30cfd0, #330867)' }}
                >
                  Send
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="w-full rounded-lg py-2.5 text-sm font-medium text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(90deg, #30cfd0, #330867)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
