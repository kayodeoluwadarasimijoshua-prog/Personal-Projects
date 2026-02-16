import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Bell, Settings, Users, BarChart3, FolderOpen, Calendar, Search, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg shadow-indigo-200 shadow-lg" />
          <span className="font-bold text-slate-900 tracking-tight">DaraPro</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem icon={LayoutDashboard} label="Overview" active />
          <NavItem icon={FolderOpen} label="Projects" />
          <NavItem icon={Users} label="Team" />
          <NavItem icon={BarChart3} label="Analytics" />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <NavItem icon={Settings} label="Settings" />
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 transition-colors group">
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs ring-2 ring-white ring-offset-2 ring-offset-slate-100">
              {user?.name?.[0] || 'U'}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}!</h2>
            <p className="text-slate-500">Here's what's happening with your projects today.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard label="Active Projects" value="12" icon={FolderOpen} />
            <StatsCard label="Team Members" value="8" icon={Users} />
            <StatsCard label="Tasks Completed" value="84%" icon={BarChart3} />
            <StatsCard label="Active Sessions" value="3" icon={Calendar} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
               {/* Content for main feed */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false }: any) => (
  <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <Icon size={20} />
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

const StatsCard = ({ label, value, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Icon size={20} /></div>
      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
    </div>
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    <div className="text-sm text-slate-500">{label}</div>
  </div>
);