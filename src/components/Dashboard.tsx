import React from 'react';
import { Users, Clock, CalendarDays, TrendingUp } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome to the University Portal. Here is today's summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value="1,248" 
          change="+12" 
          icon={<Users className="w-6 h-6 text-blue-600" />} 
          color="bg-blue-50 border-blue-100" 
        />
        <StatCard 
          title="Present Today" 
          value="842" 
          change="68%" 
          icon={<UserCheckIcon className="w-6 h-6 text-emerald-600" />} 
          color="bg-emerald-50 border-emerald-100" 
        />
        <StatCard 
          title="Classes Held" 
          value="24" 
          change="On Schedule" 
          icon={<CalendarDays className="w-6 h-6 text-purple-600" />} 
          color="bg-purple-50 border-purple-100" 
        />
        <StatCard 
          title="Avg Attendance" 
          value="76%" 
          change="+4.2%" 
          icon={<TrendingUp className="w-6 h-6 text-indigo-600" />} 
          color="bg-indigo-50 border-indigo-100" 
        />
      </div>
      
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="p-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
           <img src="https://ui-avatars.com/api/?name=Face+ID&background=e0e7ff&color=4f46e5&size=128" alt="AI" className="rounded-full w-16 h-16 mb-4 opacity-50 grayscale" />
           <p className="font-medium text-slate-600">Navigate to the "Face Attendance" tab on the left to launch the AI Scanning module.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, color }: { title: string, value: string, change: string, icon: React.ReactNode, color: string }) {
  return (
    <div className={`p-6 rounded-2xl border ${color} shadow-sm flex flex-col gap-4`}>
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
        <span className="text-xs font-semibold px-2 py-1 bg-white rounded-full text-slate-600 shadow-sm">{change}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
        <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function UserCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
