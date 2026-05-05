/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { FaceAttendance } from './components/FaceAttendance';
import { Dashboard } from './pages/Dashboard';
import { Exams } from './pages/Exams';
import { Sports } from './pages/Sports';
import { Internships } from './pages/Internships';
import { AiAssistant } from './pages/AiAssistant';
import { Analytics } from './pages/Analytics';

export type Language = 'English' | 'Hindi' | 'Odia' | 'Telugu' | 'Bengali';

export interface User {
  regNo: string;
  name: string;
  rollNo: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('English');

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'assistant': return <AiAssistant language={language} user={user} />;
      case 'exams': return <Exams />;
      case 'sports': return <Sports />;
      case 'internships': return <Internships language={language} />;
      case 'attendance': return <FaceAttendance user={user} />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <Layout 
      user={user}
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      language={language}
      setLanguage={setLanguage}
      onLogout={() => setUser(null)}
    >
      {renderPage()}
    </Layout>
  );
}
