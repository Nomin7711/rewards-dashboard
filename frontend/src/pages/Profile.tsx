import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ProfileMilestone } from "../components/ProfileMilestone";
import { ProfileTransactionHistory } from "../components/ProfileTransactionHistory";
import { useAuth } from "../context/AuthContext";

export function Profile() {
  const { auth, logout } = useAuth();
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

  if (auth.loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  const points = auth.pointsBalance ?? 0;
  const residentId = auth.residentId ?? 0;

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

        <ProfileMilestone points={points} name={auth.name} />
      </div>

      <ProfileTransactionHistory
        residentId={residentId}
        sectionRef={transactionSectionRef}
      />
    </div>
  );
}
