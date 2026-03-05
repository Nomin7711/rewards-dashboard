interface WelcomeCardProps {
  name: string | null;
  pointsBalance: number | null;
}

export function WelcomeCard({ name, pointsBalance }: WelcomeCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Welcome back,</p>
          <p className="text-2xl font-bold text-gray-900">{name ?? '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Your Points</p>
          <p className="text-4xl font-bold text-theme-gradient">
            {pointsBalance != null
              ? pointsBalance.toLocaleString()
              : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
