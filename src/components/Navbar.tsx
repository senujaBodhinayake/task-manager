'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function Navbar() {
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/50 border-b border-white/10 px-6 py-4 flex items-center justify-between transition-all duration-300">
      <Link href="/dashboard" className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-sm hover:opacity-80 transition-opacity">
        TaskManager
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 shadow-sm active:scale-95"
      >
        Logout
      </button>
    </nav>
  );
}