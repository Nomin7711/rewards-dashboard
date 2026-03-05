import { Outlet } from 'react-router-dom';
import { Nav } from './Nav';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 pb-12 pt-2">
        <Outlet />
      </main>
    </div>
  );
}
