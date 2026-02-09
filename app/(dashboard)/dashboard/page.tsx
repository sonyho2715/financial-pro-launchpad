import Link from 'next/link';
import { FileText, Users, TrendingUp, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-white font-medium">Prospects</h3>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-sm text-gray-500 mt-1">Total contacts</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white font-medium">Analyses</h3>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-sm text-gray-500 mt-1">Balance sheets completed</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-white font-medium">Referrals</h3>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-sm text-gray-500 mt-1">Referrals received</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dashboard/balance-sheet" className="group flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl p-4 transition-colors">
            <div>
              <p className="text-white font-medium">New Personal Analysis</p>
              <p className="text-sm text-gray-500">Run a personal balance sheet</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </Link>

          <Link href="/dashboard/balance-sheet/business" className="group flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl p-4 transition-colors">
            <div>
              <p className="text-white font-medium">New Business Analysis</p>
              <p className="text-sm text-gray-500">Run a business balance sheet</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
