import React, { useCallback, useEffect, useRef, useState } from 'react';

const THRESHOLD = 0.85;
const TRACK_HEIGHT = 52;

interface SlideToRedeemProps {
  onConfirm: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function SlideToRedeem({
  onConfirm,
  disabled,
  loading,
}: SlideToRedeemProps) {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const maxPositionRef = useRef(0);

  const getTrackWidth = useCallback(() => {
    return trackRef.current?.offsetWidth ?? 300;
  }, []);

  const clamp = useCallback(
    (value: number) => {
      const max = getTrackWidth() - TRACK_HEIGHT;
      return Math.max(0, Math.min(value, max));
    },
    [getTrackWidth],
  );

  const handleStart = useCallback(() => {
    if (disabled || loading) return;
    maxPositionRef.current = getTrackWidth() - TRACK_HEIGHT;
    setIsDragging(true);
    setPosition(0);
  }, [disabled, loading, getTrackWidth]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || disabled || loading) return;
      const rect = trackRef.current?.getBoundingClientRect();
      if (rect) {
        const next = clamp(clientX - rect.left - TRACK_HEIGHT / 2);
        setPosition(next);
        if (next >= maxPositionRef.current * THRESHOLD) {
          setIsDragging(false);
          onConfirm();
          setPosition(0);
        }
      }
    },
    [isDragging, disabled, loading, clamp, onConfirm],
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    const max = maxPositionRef.current;
    if (position >= max * THRESHOLD) {
      onConfirm();
      setPosition(0);
    } else {
      setPosition(0);
    }
    setIsDragging(false);
  }, [isDragging, position, onConfirm]);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div className="mt-4">
      <div
        ref={trackRef}
        className="relative select-none rounded-full overflow-hidden touch-none cursor-grab active:cursor-grabbing"
        style={{
          height: TRACK_HEIGHT,
          background: 'linear-gradient(90deg, #30cfd0, #330867)',
        }}
        onMouseDown={() => handleStart()}
        onTouchStart={() => handleStart()}
        onTouchMove={(e) => {
          e.preventDefault();
          handleMove(e.touches[0].clientX);
        }}
        onTouchEnd={handleEnd}
        role="button"
        tabIndex={disabled || loading ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled && !loading) onConfirm();
          }
        }}
        aria-label="Slide to redeem"
      >
        <span
          className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm pointer-events-none"
          style={{ opacity: position > 10 ? 0 : 1 }}
        >
          {loading ? 'Redeeming…' : 'Slide to redeem'}
        </span>
        <div
          className="absolute top-1 left-1 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-100"
          style={{
            width: TRACK_HEIGHT - 8,
            height: TRACK_HEIGHT - 8,
            left: 4 + position,
            transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <svg
            className="w-5 h-5 text-theme-teal"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
