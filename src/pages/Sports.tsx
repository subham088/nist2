import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, MoveRight, Medal } from 'lucide-react';

const CATEGORIES = ['All', 'Cricket', 'Football', 'Basketball', 'Table Tennis'];

export function Sports() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Sports & Campus Life</h1>
          <p className="text-gray-400 mt-1">Get involved, represent NIST, and track events.</p>
        </div>
        <button className="bg-primary-500 hover:bg-primary-400 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-primary-500/25 shrink-0">
          Register for Tryouts
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap border ${
              activeCategory === cat ? 'bg-accent/20 border-accent/50 text-accent' : 'bg-navy-800 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Score Widget */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 relative overflow-hidden flex flex-col justify-center min-h-[250px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Live Match</span>
            </div>
            <span className="text-gray-400 text-sm">Inter-University Basketball</span>
          </div>

          <div className="flex items-center justify-between w-full max-w-lg mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center border border-white/10 mb-3 mx-auto">
                <Trophy className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="font-bold text-white text-lg">NIST</h3>
            </div>
            
            <div className="text-center px-4">
              <h2 className="text-5xl font-display font-bold text-white tracking-widest">74 <span className="text-gray-500 mx-2">-</span> 68</h2>
              <p className="text-accent text-sm mt-2">4th Quarter (02:14)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center border border-white/10 mb-3 mx-auto">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-300 text-lg">VIT</h3>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-white mb-6 flex items-center gap-2">
            <Medal className="w-5 h-5 text-primary-500" />
            Hall of Fame
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Champions: Zonal Cricket', date: 'March 2026' },
              { title: 'Runners up: State Volleyball', date: 'Feb 2026' },
              { title: 'Gold Medal: 100m Sprint', date: 'Jan 2026' }
            ].map((ach, i) => (
              <div key={i} className="flex gap-4 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center shrink-0">
                  #{i + 1}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{ach.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{ach.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Mock */}
      <h3 className="font-display font-semibold text-lg text-white mt-8 mb-4">Recent Highlights</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="aspect-square bg-navy-800 rounded-2xl border border-white/5 relative group overflow-hidden">
            {/* Using abstract shapes as gallery placeholders for a cleaner look */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900" />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-[40px] opacity-20 ${i%2===0?'bg-accent':'bg-primary-500'}`} />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button className="text-white font-medium flex items-center gap-2">View <MoveRight className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  );
}
