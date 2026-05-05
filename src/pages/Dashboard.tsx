import React from 'react';
import { motion } from 'motion/react';
import { User } from '../App';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const attendance = 72; // yellow
  const cgpa = 8.4;
  const maxCgpa = 10;
  
  const getAttendanceColor = (att: number) => {
    if (att >= 75) return 'text-emerald-500';
    if (att >= 65) return 'text-primary-500';
    return 'text-red-500';
  };
  
  const getAttendanceBg = (att: number) => {
    if (att >= 75) return 'bg-emerald-500';
    if (att >= 65) return 'bg-primary-500';
    return 'bg-red-500';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Attendance Warning Banner */}
      {attendance < 75 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
          <p className="text-red-200 text-sm">
            <strong className="text-red-400 font-bold">Warning:</strong> Your attendance ({attendance}%) is below the required 75% threshold. Please attend upcoming classes to avoid academic penalties.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
          
          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start relative z-10">
            <div className="w-32 h-32 rounded-2xl bg-navy-800 border-2 border-primary-500/30 overflow-hidden shrink-0">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=0A1628&textColor=F5A623`} alt="Profile" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-white tracking-tight">{user.name}</h1>
                <p className="text-primary-500 font-medium tracking-wide">B.Tech in Computer Science & Engineering</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Registration No.</p>
                  <p className="font-semibold">{user.regNo}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Roll No.</p>
                  <p className="font-semibold">{user.rollNo}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Semester</p>
                  <p className="font-semibold">3rd (Second Year)</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Section</p>
                  <p className="font-semibold">CSE-B</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Overview */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-6">
          <h2 className="font-display font-semibold text-white">Academic Overview</h2>
          
          {/* CGPA Ring */}
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" className="stroke-navy-800" strokeWidth="8" fill="none" />
                <motion.circle 
                  initial={{ strokeDashoffset: 226 }}
                  animate={{ strokeDashoffset: 226 - (226 * cgpa) / maxCgpa }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="40" cy="40" r="36" 
                  className="stroke-accent" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeDasharray="226"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold text-white">{cgpa}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Overall CGPA</p>
              <p className="text-sm font-medium text-white">Top 15% of class</p>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Attendance Bar */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Attendance</p>
              <p className={`text-xl font-bold ${getAttendanceColor(attendance)}`}>{attendance}%</p>
            </div>
            <div className="h-2 w-full bg-navy-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${attendance}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full ${getAttendanceBg(attendance)}`} 
              />
            </div>
          </div>
        </div>

      </div>

      {/* Quick Access / Announcements */}
      <h3 className="font-display font-semibold text-lg text-white mt-8 mb-4">Announcements</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: FileText, title: 'Hall tickets available', date: '2 hours ago' },
          { icon: CheckCircle2, title: 'Course registration for next semester is open', date: 'Yesterday' }
        ].map((ann, i) => (
          <div key={i} className="glass-card p-4 rounded-xl flex items-start gap-4 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="p-2 bg-navy-800 rounded-lg text-primary-500">
              <ann.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">{ann.title}</p>
              <p className="text-xs text-gray-500 mt-1">{ann.date}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
