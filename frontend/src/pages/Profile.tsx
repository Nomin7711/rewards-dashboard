import { useAuth } from '../context/AuthContext';

export function Profile() {
  const { auth, logout } = useAuth();

  if (auth.loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Profile</h2>
        <p className="text-gray-600">
          <span className="font-medium text-gray-900">Name:</span> {auth.name ?? '—'}
        </p>
        <p className="mt-2 text-gray-600">
          <span className="font-medium text-gray-900">Points:</span>{' '}
          <span className="text-theme-gradient">
            {auth.pointsBalance != null ? auth.pointsBalance.toLocaleString() : '—'}
          </span>
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-6 rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ background: 'linear-gradient(90deg, #30cfd0, #330867)' }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
