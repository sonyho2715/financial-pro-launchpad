import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import DashboardNav from '@/components/layouts/DashboardNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardNav
        firstName={session.firstName}
        lastName={session.lastName}
        email={session.email}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
