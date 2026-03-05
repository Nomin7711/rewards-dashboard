type RankTier = "bronze" | "silver" | "gold" | "platinum";

const RANK_TIERS: {
  tier: RankTier;
  label: string;
  icon: string;
  minPoints: number;
}[] = [
  { tier: "bronze", label: "Bronze", icon: "●", minPoints: 0 },
  { tier: "silver", label: "Silver", icon: "☆", minPoints: 500 },
  { tier: "gold", label: "Gold", icon: "★", minPoints: 1500 },
  { tier: "platinum", label: "Platinum", icon: "✦", minPoints: 3000 },
];

function getPointsToNextLevel(points: number): number | null {
  const currentIndex = RANK_TIERS.findIndex((r) => r.minPoints > points);
  if (currentIndex === -1) return null;
  return RANK_TIERS[currentIndex].minPoints - points;
}

function segmentProgress(
  points: number,
  i: number,
): number {
  if (i === 0) return 1;
  const prev = RANK_TIERS[i - 1].minPoints;
  const next = RANK_TIERS[i].minPoints;
  const range = next - prev;
  if (points <= prev) return 0;
  if (points >= next) return 1;
  return (points - prev) / range;
}

interface ProfileMilestoneProps {
  points: number;
  name: string | null;
}

export function ProfileMilestone({ points, name }: ProfileMilestoneProps) {
  const pointsToNext = getPointsToNextLevel(points);
  const segProgress = (i: number) => segmentProgress(points, i);

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 p-5">
      <p className="text-gray-700">
        Hey {name ?? "there"} 👋, welcome back! You&apos;re doing great. Cheers
        to you.
      </p>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700">
          You have earned{" "}
          <span className="font-bold text-theme-teal">
            {points.toLocaleString()}
          </span>{" "}
          <span className="text-gray-500">points</span>
          {(() => {
            const unlockedNames = RANK_TIERS.filter(
              (r) => points >= r.minPoints,
            ).map((r) => r.label);
            if (unlockedNames.length === 0) return null;
            return (
              <span className="text-gray-600">
                {" "}
                · Unlocked{" "}
                <span className="font-semibold text-gray-900">
                  {unlockedNames.join(" & ")}
                </span>
              </span>
            );
          })()}
        </p>

        <div className="mt-4 flex items-end">
          {RANK_TIERS.map((r, i) => {
            const unlocked = points >= r.minPoints;
            const segPercent = segProgress(i);
            return (
              <div
                key={r.tier}
                className={`flex items-end ${i === 0 ? "flex-shrink-0" : "min-w-0 flex-1"}`}
              >
                {i > 0 && (
                  <div className="relative flex min-w-0 flex-1 flex-col justify-center">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${segPercent * 100}%`,
                          background:
                            "linear-gradient(90deg, #30cfd0, #330867)",
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-shrink-0 flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm ${
                      unlocked
                        ? "border-theme-teal bg-theme-teal/20 text-theme-teal"
                        : "border-gray-200 bg-gray-100 text-gray-400"
                    }`}
                  >
                    {unlocked ? (
                      <span
                        className="text-xs font-bold"
                        aria-label="Unlocked"
                      >
                        ✓
                      </span>
                    ) : (
                      r.icon
                    )}
                  </div>
                  <p className="mt-1 max-w-[72px] truncate text-center text-xs text-gray-600">
                    {r.label}
                  </p>
                  <p className="text-center text-xs text-gray-500">
                    {r.minPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {pointsToNext !== null ? (
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-theme-teal/10 px-4 py-3 text-sm">
            <span className="text-theme-teal" aria-hidden>
              ★
            </span>
            <span className="font-semibold text-gray-800">
              {pointsToNext.toLocaleString()} points away from next level.
            </span>
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-theme-teal/10 px-4 py-3 text-sm">
            <span className="text-theme-teal" aria-hidden>
              ✦
            </span>
            <span className="font-semibold text-gray-800">
              You&apos;ve reached the highest level!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
