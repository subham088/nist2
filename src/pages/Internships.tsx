import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, MapPin, Currency, Calendar, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Language } from '../App';
import { GoogleGenAI } from '@google/genai';

interface Internship {
  id: string;
  role: string;
  company: string;
  location: string;
  stipend: string;
  duration: string;
  deadline: string;
  tags: string[];
  details: string;
}

const internships: Internship[] = [
  {
    id: '1', role: 'SDE Intern', company: 'Google', location: 'Remote', stipend: '₹1,00,000/mo', duration: '6 Months', deadline: '2026-06-01',
    tags: ['CSE', 'Remote', 'Summer'],
    details: 'Looking for a motivated Software Engineering Intern to join our Search team. Strong algorithmic skills in C++ or Python required.'
  },
  {
    id: '2', role: 'Frontend Developer Intern', company: 'Atlassian', location: 'Bengaluru (Hybrid)', stipend: '₹80,000/mo', duration: '3 Months', deadline: '2026-05-20',
    tags: ['CSE', 'Hybrid', 'React'],
    details: 'Join our Jira UI team. Experience with React, TypeScript, and modern state management is highly preferred.'
  },
  {
    id: '3', role: 'Hardware Design Intern', company: 'Intel', location: 'On-site', stipend: '₹60,000/mo', duration: '6 Months', deadline: '2026-07-15',
    tags: ['ECE', 'On-site', 'VLSI'],
    details: 'Assist in designing next-generation memory controllers. Knowledge of Verilog/VHDL and digital logic required.'
  }
];

export function Internships({ language }: { language: Language }) {
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggleSave = (id: string) => setSaved(prev => ({ ...prev, [id]: !prev[id] }));

  const generateSummary = async (job: Internship) => {
    if (summaries[job.id]) return; // Already summarized
    setLoadingId(job.id);
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || 'fake-key-for-mock';
      
      if (apiKey === 'fake-key-for-mock') {
        await new Promise(r => setTimeout(r, 1000));
        setSummaries(prev => ({ ...prev, [job.id]: `(Mock Summary in ${language}): This is a great opportunity at ${job.company} for a ${job.role}.` }));
      } else {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 150,
            system: `Summarize this internship opportunity in 1-2 concise sentences. Focus on the core role and key requirements. Translate and respond ONLY in ${language}.`,
            messages: [
              { role: 'user', content: `Company: ${job.company}. Role: ${job.role}. Details: ${job.details}` }
            ]
          })
        });

        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        
        setSummaries(prev => ({ ...prev, [job.id]: data.content[0].text || 'Summary not available.' }));
      }
    } catch (e) {
      console.error('Anthropic API Error:', e);
      setSummaries(prev => ({ ...prev, [job.id]: 'AI Summary unavailable. Please check API Key or CORS settings.' }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Internship Mail Center</h1>
        <p className="text-gray-400 mt-1">Curated opportunities for NIST students. Use AI to summarize details in {language}.</p>
      </div>

      <div className="space-y-4">
        {internships.map(job => (
          <div key={job.id} className="glass-card rounded-2xl p-6 border-l-4 border-l-accent hover:bg-white/5 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-display font-bold text-white">{job.role}</h3>
                <p className="text-primary-500 font-medium">{job.company}</p>
              </div>
              <button onClick={() => toggleSave(job.id)} className="text-gray-400 hover:text-primary-500 transition-colors p-2 -mr-2">
                {saved[job.id] ? <BookmarkCheck className="w-6 h-6 text-primary-500" /> : <Bookmark className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/10 text-gray-300">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-gray-500" /> {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Currency className="w-4 h-4 text-gray-500 flex-shrink-0" /> ₹ {job.stipend.replace('₹', '')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4 text-gray-500" /> Apply by {new Date(job.deadline).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
              </div>
            </div>

            {/* AI Summary Section */}
            <div className="bg-navy-900 border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-primary-500 font-medium text-sm">
                  <Bot className="w-4 h-4" />
                  AI Context ({language})
                </div>
                {!summaries[job.id] && (
                  <button 
                    onClick={() => generateSummary(job)}
                    disabled={loadingId === job.id}
                    className="text-xs bg-navy-800 hover:bg-navy-700 px-3 py-1 rounded-md text-white transition-colors disabled:opacity-50"
                  >
                    {loadingId === job.id ? 'Summarizing...' : 'Summarize'}
                  </button>
                )}
              </div>
              
              {summaries[job.id] ? (
                <p className="text-gray-300 text-sm italic border-l-2 border-primary-500/50 pl-3">
                  "{summaries[job.id]}"
                </p>
              ) : (
                <p className="text-gray-500 text-xs">
                  {job.details}
                </p>
              )}
            </div>
            
            <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent font-medium transition-colors border border-accent/20">
              Apply Now <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
