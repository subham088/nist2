import React, { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Calendar, 
  Trophy, 
  Briefcase,
  Bell,
  Globe,
  LogOut,
  Menu,
  X,
  UserCheck,
  Activity
} from 'lucide-react';
import { User, Language } from '../App';

interface LayoutProps {
  children: ReactNode;
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onLogout: () => void;
}

const LANGUAGES: Language[] = ['English', 'Hindi', 'Odia', 'Telugu', 'Bengali'];

export function Layout({ children, user, activeTab, setActiveTab, language, setLanguage, onLogout }: LayoutProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'exams', label: 'Exams', icon: Calendar },
    { id: 'sports', label: 'Sports', icon: Trophy },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'attendance', label: 'Face Scan', icon: UserCheck },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-navy-900 text-gray-100 font-sans overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-navy-800/80 backdrop-blur-xl border-r border-white/5 flex-col z-20 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/25">
            <span className="font-display font-bold text-white text-xl">N</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white tracking-wide">NIST</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Student Portal</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary-500' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Top Header */}
        <header className="h-16 glass-card border-b border-white/5 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-display font-semibold text-white capitalize hidden sm:block">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <div className="md:hidden flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-md flex items-center justify-center">
                <span className="font-display font-bold text-white text-sm">N</span>
              </div>
              <h1 className="font-display font-bold text-white tracking-wide">NIST</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium">{language}</span>
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 w-40 glass-card rounded-xl py-2 z-50 border border-white/10 shadow-xl">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowLanguageDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        language === lang ? 'bg-primary-500/20 text-primary-500' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_rgba(0,210,255,0.8)]"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-primary-500 opacity-80">{user.regNo}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-navy-800 border border-primary-500/30 flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=0A1628&textColor=F5A623`} alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 pb-24 md:pb-8 relative">
          {children}
        </div>
        
        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 z-50 px-2 py-2 flex justify-around">
          {navItems.slice(0, 5).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === item.id ? 'text-primary-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
