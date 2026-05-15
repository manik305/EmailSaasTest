import React from 'react';
import { useAppContext } from '../context/AppContext';

const DashboardPage: React.FC = () => {
  const { state } = useAppContext();
  const { metrics } = state;

  return (
    <div className="p-8 space-y-8 animate-fade-in transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Campaign Overview
          </h1>
          <p className="text-slate-400 mt-2">Real-time performance metrics and insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {/* Metric Card 1 */}
        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm font-medium">Total Emails Sent</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{metrics.totalEmailsSent.toLocaleString()}</span>
            <span className="text-sm font-medium text-emerald-400">+12%</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm font-medium">Avg. Open Rate</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{metrics.openRate.toFixed(1)}%</span>
            <span className="text-sm font-medium text-emerald-400">+2.4%</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm font-medium">Avg. Click Rate</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{metrics.clickRate.toFixed(1)}%</span>
            <span className="text-sm font-medium text-emerald-400">+1.1%</span>
          </div>
        </div>

        {/* Dynamic Metric 4: File processing */}
        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm font-medium">Leads Processed</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{metrics.dataProcessedCount.toLocaleString()}</span>
            <span className="text-sm font-medium text-slate-400">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
