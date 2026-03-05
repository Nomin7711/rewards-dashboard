import { useCallback, useEffect, useState } from "react";
import * as api from "../api/client";
import type { Transaction } from "../types";

const PAGE_SIZE = 10;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatTransactionDate(createdAt: string): string {
  const d = new Date(createdAt);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface ProfileTransactionHistoryProps {
  residentId: number;
  /** Ref for the section element (e.g. for scroll-into-view from hash) */
  sectionRef?: React.RefObject<HTMLDivElement | null>;
}

export function ProfileTransactionHistory({
  residentId,
  sectionRef,
}: ProfileTransactionHistoryProps) {
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

  return (
    <div
      id="transaction-history"
      ref={sectionRef}
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
                    <p className="font-medium text-gray-900">{tx.description}</p>
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
  );
}
