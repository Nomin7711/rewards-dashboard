import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import * as api from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Transaction } from "../types";

const PAGE_SIZE = 10;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

function getRankTier(points: number): (typeof RANK_TIERS)[number] {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (points >= RANK_TIERS[i].minPoints) return RANK_TIERS[i];
  }
  return RANK_TIERS[0];
}

function getPointsToNextLevel(points: number): number | null {
  const currentIndex = RANK_TIERS.findIndex((r) => r.minPoints > points);
  if (currentIndex === -1) return null; // already at max (platinum)
  return RANK_TIERS[currentIndex].minPoints - points;
}

const RANK_STYLES: Record<
  RankTier,
  { bg: string; iconBg: string; text: string; border: string }
> = {
  bronze: {
    bg: "bg-amber-100",
    iconBg: "bg-amber-200",
    text: "text-amber-800",
    border: "border-amber-300",
  },
  silver: {
    bg: "bg-gray-100",
    iconBg: "bg-gray-300",
    text: "text-gray-800",
    border: "border-gray-400",
  },
  gold: {
    bg: "bg-yellow-100",
    iconBg: "bg-yellow-300",
    text: "text-yellow-800",
    border: "border-yellow-400",
  },
  platinum: {
    bg: "bg-gradient-to-r from-theme-teal/20 to-theme-purple/20",
    iconBg: "bg-theme-teal",
    text: "text-gray-900",
    border: "border-theme-teal",
  },
};

function formatTransactionDate(createdAt: string): string {
  const d = new Date(createdAt);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Profile() {
  const { auth, logout } = useAuth();
  const [txResponse, setTxResponse] = useState<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [txLoading, setTxLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [monthFilter, setMonthFilter] = useState<number | "all">("all");

  const residentId = auth.residentId ?? 0;
  const points = auth.pointsBalance ?? 0;
  const rank = getRankTier(points);
  const pointsToNext = getPointsToNextLevel(points);
  const transactionSectionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (
      location.hash === "#transaction-history" &&
      transactionSectionRef.current
    ) {
      transactionSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  const loadTransactions = useCallback(() => {
    if (!residentId) return;
    setTxLoading(true);
    const options: { month?: number; year?: number } = {};
    if (yearFilter !== "all") options.year = yearFilter;
    if (monthFilter !== "all") options.month = monthFilter;
    api
      .getTransactions(residentId, page, PAGE_SIZE, options)
      .then(setTxResponse)
      .catch(() =>
        setTxResponse({
          data: [],
          total: 0,
          page: 1,
          limit: PAGE_SIZE,
          totalPages: 0,
        }),
      )
      .finally(() => setTxLoading(false));
  }, [residentId, page, yearFilter, monthFilter]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    setPage(1);
  }, [yearFilter, monthFilter]);

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    "all",
    currentYear,
    currentYear - 1,
    currentYear - 2,
  ] as const;
  const monthOptions = [
    "all",
    ...Array.from({ length: 12 }, (_, i) => i + 1),
  ] as const;

  if (auth.loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  function segmentProgress(i: number): number {
    if (i === 0) return 1;
    const prev = RANK_TIERS[i - 1].minPoints;
    const next = RANK_TIERS[i].minPoints;
    const range = next - prev;
    if (points <= prev) return 0;
    if (points >= next) return 1;
    return (points - prev) / range;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Profile</h2>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-theme-teal focus:ring-offset-2"
            style={{
              background: "linear-gradient(90deg, #30cfd0, #330867)",
            }}
          >
            Sign out
          </button>
        </div>
        <p className="text-gray-600">
          <span className="font-medium text-gray-900">Name:</span>{" "}
          {auth.name ?? "—"}
        </p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 p-5">
          <p className="text-gray-700">
            Hey {auth.name ?? "there"} 👋, welcome back! You&apos;re doing
            great. Cheers to you.
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
                const segPercent = segmentProgress(i);
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
      </div>

      <div
        id="transaction-history"
        ref={transactionSectionRef}
        className="rounded-2xl bg-white p-6 shadow-md scroll-mt-4"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Transaction history
        </h2>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Year
            <select
              value={yearFilter}
              onChange={(e) =>
                setYearFilter(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-theme-teal focus:outline-none focus:ring-1 focus:ring-theme-teal"
            >
              <option value="all">All</option>
              {yearOptions
                .filter((y) => y !== "all")
                .map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Month
            <select
              value={monthFilter}
              onChange={(e) =>
                setMonthFilter(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-theme-teal focus:outline-none focus:ring-1 focus:ring-theme-teal"
            >
              <option value="all">All</option>
              {monthOptions
                .filter((m) => m !== "all")
                .map((m) => (
                  <option key={m} value={m}>
                    {MONTH_NAMES[m - 1]}
                  </option>
                ))}
            </select>
          </label>
        </div>

        {txLoading ? (
          <p className="py-8 text-center text-gray-500">
            Loading transactions…
          </p>
        ) : !txResponse?.data.length ? (
          <p className="py-8 text-center text-gray-500">
            No transactions in this period.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {txResponse.data.map((tx) => (
                <li key={tx.id} className="py-3 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {tx.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTransactionDate(tx.createdAt)}
                      </p>
                    </div>
                    <span
                      className={
                        tx.amount >= 0
                          ? "font-medium text-green-600"
                          : "font-medium text-red-600"
                      }
                    >
                      {tx.amount >= 0 ? "+" : ""}
                      {tx.amount.toLocaleString()} pts
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {txResponse.totalPages > 1 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">
                  Page {txResponse.page} of {txResponse.totalPages} (
                  {txResponse.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={txResponse.page <= 1}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => Math.min(txResponse.totalPages, p + 1))
                    }
                    disabled={txResponse.page >= txResponse.totalPages}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
