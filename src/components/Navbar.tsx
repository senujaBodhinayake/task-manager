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
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="text-xl font-bold text-blue-600">
        TaskManager
      </Link>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-red-500 transition"
      >
        Logout
      </button>
    </nav>
  );
}