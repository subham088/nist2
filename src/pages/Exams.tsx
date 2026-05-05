import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Calendar, Download } from 'lucide-react';

interface Exam {
  id: string;
  subject: string;
  code: string;
  date: string; // ISO string for easy parsing
  time: string;
  venue: string;
  duration: string;
  type: 'Mid-Sem' | 'End-Sem' | 'Practical';
}

const exams: Exam[] = [
  { id: '1', subject: 'Operating System', code: 'CSE401', date: new Date(Date.now() - 86400000).toISOString(), time: '10:00 AM', venue: 'Block C, Room 301', duration: '3 Hrs', type: 'End-Sem' },
  { id: '2', subject: 'Java Programming', code: 'CSE403', date: new Date(Date.now()).toISOString(), time: '02:00 PM', venue: 'Main Hall', duration: '3 Hrs', type: 'End-Sem' },
  { id: '3', subject: 'Organizational Behavior (OB)', code: 'MGT301', date: new Date(Date.now() + 86400000 * 2).toISOString(), time: '10:00 AM', venue: 'Block B, Room 104', duration: '3 Hrs', type: 'Mid-Sem' },
  { id: '4', subject: 'Computational Intelligence (CI)', code: 'CSE405', date: new Date(Date.now() + 86400000 * 5).toISOString(), time: '09:00 AM', venue: 'Lab 4', duration: '2 Hrs', type: 'Practical' },
  { id: '5', subject: 'Discrete Mathematics (DM)', code: 'MTH202', date: new Date(Date.now() + 86400000 * 7).toISOString(), time: '10:00 AM', venue: 'Block A, Room 201', duration: '3 Hrs', type: 'End-Sem' },
  { id: '6', subject: 'Computer Organization (COA)', code: 'CSE304', date: new Date(Date.now() + 86400000 * 10).toISOString(), time: '02:00 PM', venue: 'Block C, Room 305', duration: '3 Hrs', type: 'End-Sem' },
  { id: '7', subject: 'Augmented Reality (AR)', code: 'CSE501', date: new Date(Date.now() + 86400000 * 12).toISOString(), time: '09:00 AM', venue: 'AR/VR Lab', duration: '2 Hrs', type: 'Practical' },
];

export function Exams() {
  const [filterType, setFilterType] = useState('All');
  
  const filteredExams = filterType === 'All' ? exams : exams.filter(e => e.type === filterType);

  // Sorting strictly by date to support rendering logic
  filteredExams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStatus = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const examDate = new Date(dateStr);
    examDate.setHours(0,0,0,0);
    
    if (examDate.getTime() < today.getTime()) return 'past';
    if (examDate.getTime() === today.getTime()) return 'today';
    return 'upcoming';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Exam Schedule</h1>
          <p className="text-gray-400 mt-1">6th Semester, Computer Science & Engineering</p>
        </div>
        
        <div className="flex bg-navy-800 p-1 rounded-lg border border-white/10 shrink-0">
          {['All', 'End-Sem', 'Practical'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filterType === type ? 'bg-navy-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Timeline */}
      <div className="glass-card rounded-2xl p-6 overflow-x-auto">
        <div className="min-w-[600px] flex items-center">
          {filteredExams.map((exam, idx) => {
            const status = getStatus(exam.date);
            return (
              <div key={exam.id} className="flex-1 relative">
                {/* Connecting Line */}
                {idx !== filteredExams.length - 1 && (
                  <div className={`absolute top-3 left-1/2 w-full h-[2px] ${status === 'past' ? 'bg-white/10' : 'bg-primary-500/30'}`} />
                )}
                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-6 h-6 rounded-full border-4 border-navy-900 flex items-center justify-center
                    ${status === 'past' ? 'bg-gray-500' : status === 'today' ? 'bg-orange-500 animate-pulse' : 'bg-accent'}
                  `} />
                  <p className="text-xs font-semibold text-white mt-2">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-[10px] text-gray-400 text-center px-2 line-clamp-1">{exam.subject}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map(exam => {
          const status = getStatus(exam.date);
          return (
            <div key={exam.id} className={`glass-card rounded-2xl p-6 relative overflow-hidden group ${status === 'today' ? 'border-orange-500/50 shadow-lg shadow-primary-500/15' : ''}`}>
              {status === 'today' && <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-[30px]" />}
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded
                  ${status === 'past' ? 'bg-gray-500/20 text-gray-400' : status === 'today' ? 'bg-orange-500/20 text-orange-400' : 'bg-accent/20 text-accent'}
                `}>
                  {status === 'today' ? 'TODAY' : status === 'past' ? 'COMPLETED' : 'UPCOMING'}
                </span>
                <span className="text-xs text-primary-500 font-bold bg-primary-500/10 px-2 py-1 rounded">{exam.type}</span>
              </div>
              
              <h3 className="text-xl font-display font-bold text-white mb-1 line-clamp-1">{exam.subject}</h3>
              <p className="text-gray-400 text-sm mb-6">{exam.code}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>{new Date(exam.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{exam.time} ({exam.duration})</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{exam.venue}</span>
                </div>
              </div>

              {status !== 'past' && (
                <button className="w-full mt-6 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors border border-white/5">
                  <Download className="w-4 h-4" />
                  Add to Calendar
                </button>
              )}
            </div>
          );
        })}
      </div>

    </motion.div>
  );
}
