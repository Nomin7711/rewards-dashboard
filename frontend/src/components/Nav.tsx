import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/my-cards', label: 'My Cards' },
  { to: '/profile', label: 'Profile' },
];

export function Nav() {
  return (
    <nav className="flex justify-center py-4">
      <div className="flex rounded-full bg-gray-200/80 px-2 py-1.5 shadow-sm">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-300 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
