import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Download, FileSpreadsheet, Users, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

const mockLogs = [
  { id: 1, name: 'Subham Sahu', regNo: '202456010', date: '2026-05-05', time: '08:45 AM', status: 'Present', livenessStatus: 'Verified' },
  { id: 2, name: 'Ananda Sagar Dakua', regNo: '202456008', date: '2026-05-05', time: '08:47 AM', status: 'Present', livenessStatus: 'Verified' },
  { id: 3, name: 'K Sumit Dora', regNo: '202456031', date: '2026-05-05', time: '08:50 AM', status: 'Present', livenessStatus: 'Verified' },
  { id: 4, name: 'Kartik Jena', regNo: '202456035', date: '2026-05-05', time: '09:05 AM', status: 'Late', livenessStatus: 'Verified' },
  { id: 5, name: 'Drishika Parida', regNo: '202457012', date: '2026-05-05', time: '--', status: 'Absent', livenessStatus: '--' },
  { id: 6, name: 'P. Alisha Dora', regNo: '202457029', date: '2026-05-05', time: '08:42 AM', status: 'Proxy Attempt', livenessStatus: 'Flagged' },
  { id: 7, name: 'S. Sradha Suman', regNo: '202457028', date: '2026-05-05', time: '08:55 AM', status: 'Present', livenessStatus: 'Verified' },
];

const weeklyData = [
  { name: 'Mon', Present: 120, Absent: 10, Late: 5 },
  { name: 'Tue', Present: 125, Absent: 5, Late: 5 },
  { name: 'Wed', Present: 110, Absent: 20, Late: 5 },
  { name: 'Thu', Present: 130, Absent: 2, Late: 3 },
  { name: 'Fri', Present: 115, Absent: 15, Late: 5 },
];

const monthlyTrend = [
  { week: 'Week 1', rate: 85 },
  { week: 'Week 2', rate: 88 },
  { week: 'Week 3', rate: 82 },
  { week: 'Week 4', rate: 91 },
];

export function Analytics() {
  const [filter, setFilter] = useState('All');

  const filteredLogs = filter === 'All' 
    ? mockLogs 
    : mockLogs.filter(log => log.status === filter || log.livenessStatus === filter);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Attendance Analytics</h1>
          <p className="text-gray-400 mt-1">Monitor attendance trends, export logs, and detect proxy attempts.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-primary-500/25 shrink-0">
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-display font-bold text-white">135</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Attendance</p>
              <p className="text-2xl font-display font-bold text-white">88%</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-500/10 rounded-lg text-primary-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Late Arrivals</p>
              <p className="text-2xl font-display font-bold text-white">12</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-red-400 text-sm">Proxy Attempts</p>
              <p className="text-2xl font-display font-bold text-white">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="font-display font-semibold text-lg text-white mb-6">Weekly Attendance Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#112240', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="Present" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Late" stackId="a" fill="#fbbf24" />
                <Bar dataKey="Absent" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="font-display font-semibold text-lg text-white mb-6">Monthly Attendance Rate (%)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#112240', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#00D2FF" strokeWidth={3} dot={{ r: 6, fill: '#0A1628', stroke: '#00D2FF', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-accent" />
            Detailed Attendance Logs
          </h3>
          <div className="flex bg-navy-800 p-1 rounded-lg border border-white/10 shrink-0">
            {['All', 'Present', 'Absent', 'Late', 'Flagged'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filter === type ? 'bg-navy-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Student Info</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Liveness / Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-white">{log.name}</p>
                    <p className="text-xs text-gray-500">{log.regNo}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-300">{log.date}</p>
                    <p className="text-xs text-gray-500">{log.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                      ${log.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' :
                        log.status === 'Late' ? 'bg-primary-500/20 text-primary-400' :
                        log.status === 'Absent' ? 'bg-red-500/20 text-red-400' :
                        'bg-red-500/30 text-red-500 border border-red-500/50'
                      }
                    `}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {log.livenessStatus === 'Verified' ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <CheckCircle className="w-4 h-4" /> Real Face Verified
                      </span>
                    ) : log.livenessStatus === 'Flagged' ? (
                      <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                        <ShieldAlert className="w-4 h-4" /> Proxy Suspected
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">{log.livenessStatus}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No logs found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
