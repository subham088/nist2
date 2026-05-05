import { useState } from 'react';
import { motion } from 'motion/react';
import { User } from '../App';
import { GraduationCap } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const allowedUsers = [
  { name: 'subham sahu', rollNo: '202456010' },
  { name: 'ananda sagar dakua', rollNo: '202456008' },
  { name: 'k sumit dora', rollNo: '202456031' },
  { name: 'kartik jena', rollNo: '202456035' },
  { name: 'drishika parida', rollNo: '202457012' },
  { name: 'p. alisha dora', rollNo: '202457029' },
  { name: 's.sradha suman', rollNo: '202457028' },
];

export function Login({ onLogin }: LoginProps) {
  const [regNo, setRegNo] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (regNo && rollNo && name && password) {
      const isAllowed = allowedUsers.some(
        user => user.name.toLowerCase() === name.trim().toLowerCase() && 
                user.rollNo === rollNo.trim()
      );

      if (isAllowed) {
        // Fix capitalization for display
        const displayUser = allowedUsers.find(
          user => user.name.toLowerCase() === name.trim().toLowerCase() && user.rollNo === rollNo.trim()
        );
        onLogin({ 
          regNo, 
          rollNo: displayUser!.rollNo, 
          name: displayUser!.name.replace(/\b\w/g, l => l.toUpperCase()) // basic title case
        });
      } else {
        setError('Invalid credentials. Only authorized students can login.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-navy-900">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 rounded-2xl z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-navy-800 rounded-xl flex items-center justify-center border border-primary-500/20 mb-4 shadow-lg shadow-primary-500/25">
            <GraduationCap className="text-primary-500 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide text-center">NIST UNIVERSITY</h1>
          <p className="text-primary-500 text-sm font-medium tracking-widest uppercase mt-1">Student Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Registration Number</label>
            <input
              type="text"
              required
              placeholder="e.g. 2201234"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Roll Number</label>
            <input
              type="text"
              required
              placeholder="e.g. CSE-22-101"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-500 hover:bg-primary-400 text-white font-bold py-3.5 rounded-xl mt-6 transition-colors duration-200 outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-navy-900"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
}
