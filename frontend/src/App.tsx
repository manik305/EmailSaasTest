import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import CampaignsPage from './pages/Campaigns';
import DataFolderPage from './pages/DataFolder';
import EmailConfigPage from './pages/EmailConfig';
import LoginPage from './pages/Login';
import LandingPageFeature from './pages/LandingPage';
import MeetingScheduler from './pages/MeetingScheduler';
import { Chatbot } from './components/Chatbot';

const navIcons: Record<string, React.ReactNode> = {
  '/dashboard': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  '/campaigns': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  '/data-folder': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  '/email-config': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  '/landing-pages': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  '/meetings': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Data Management', path: '/data-folder' },
    { name: 'Email Config', path: '/email-config' },
    { name: 'Landing Pages', path: '/landing-pages' },
    { name: 'Meetings', path: '/meetings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100 font-inter">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-700/50 bg-slate-800/40 backdrop-blur-xl flex flex-col relative z-40">
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50 bg-gradient-to-r from-indigo-500/10 to-transparent">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            EmailSaaS
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/20'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                >
                  {navIcons[item.path]}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700/50">
          <Link
            to="/"
            className="flex items-center justify-center w-full px-4 py-2 text-sm text-slate-400 bg-slate-800/50 hover:bg-slate-700/50 rounded border border-slate-700 transition"
          >
            Logout
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 relative overflow-y-auto bg-slate-900/50">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/0 to-slate-900/0"></div>
        <div className="p-8 relative z-10 glass-panel min-h-[calc(100vh-4rem)] m-6 rounded-2xl">
          {children}
        </div>
        
        {/* Floating Chatbot Widget */}
        <Chatbot />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/campaigns" element={<Layout><CampaignsPage /></Layout>} />
        <Route path="/data-folder" element={<Layout><DataFolderPage /></Layout>} />
        <Route path="/email-config" element={<Layout><EmailConfigPage /></Layout>} />
        <Route path="/landing-pages" element={<Layout><LandingPageFeature /></Layout>} />
        <Route path="/meetings" element={<Layout><MeetingScheduler /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
