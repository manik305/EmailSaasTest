import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const EmailConfigPage: React.FC = () => {
  const { state, updateEmailConfig } = useAppContext();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = (provider: 'Google Workspace' | 'Microsoft 365' | 'Custom SMTP') => {
    setIsConnecting(true);
    // Simulate OAuth / connection flow
    setTimeout(() => {
      updateEmailConfig({
        provider,
        status: 'Connected',
        accountEmail: `user@${provider.toLowerCase().replace(' ', '')}.com`,
        lastSync: new Date().toLocaleTimeString(),
      });
      setIsConnecting(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    updateEmailConfig({
      provider: null,
      status: 'Disconnected',
    });
  };

  const ProviderCard = ({ 
    name, 
    icon, 
    color 
  }: { 
    name: 'Google Workspace' | 'Microsoft 365' | 'Custom SMTP', 
    icon: React.ReactNode, 
    color: string 
  }) => {
    const isThisProvider = state.emailConfig.provider === name;
    
    return (
      <div className={`glass p-6 rounded-2xl border-2 transition-all duration-300 ${isThisProvider ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-white/5 hover:border-white/20'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-xl ${color}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-200">{name}</h3>
            {isThisProvider && <span className="text-xs font-semibold text-emerald-400">Active Connection</span>}
          </div>
        </div>
        
        {isThisProvider ? (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-sm text-emerald-400 font-medium">Connected Account</div>
              <div className="text-slate-200 font-bold mt-1">{state.emailConfig.accountEmail}</div>
              <div className="text-xs text-slate-400 mt-2">Last Sync: {state.emailConfig.lastSync}</div>
            </div>
            <button 
              onClick={handleDisconnect}
              className="w-full py-2.5 px-4 rounded-lg font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={() => handleConnect(name)}
            disabled={isConnecting}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${state.emailConfig.provider ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'}`}
          >
            {isConnecting && !state.emailConfig.provider ? 'Connecting...' : 'Connect Identity'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Email Configuration
          </h1>
          <p className="text-slate-400 mt-2">Connect your email provider to start sending sequences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <ProviderCard 
          name="Google Workspace" 
          color="bg-red-500/20 text-red-400"
          icon={<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>}
        />
        <ProviderCard 
          name="Microsoft 365" 
          color="bg-blue-500/20 text-blue-400"
          icon={<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg>}
        />
         <ProviderCard 
          name="Custom SMTP" 
          color="bg-slate-500/20 text-slate-400"
          icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
      </div>

      <div className="mt-12 glass rounded-2xl p-8 border border-white/5">
        <h2 className="text-2xl font-bold text-slate-200 mb-6">Sender Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Daily Sending Limit</label>
                <input type="number" defaultValue={250} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Delay Between Emails (seconds)</label>
                <input type="number" defaultValue={45} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
             </div>
           </div>
           <div className="p-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col justify-center">
              <h3 className="text-indigo-400 font-semibold mb-2">Recommendation</h3>
              <p className="text-slate-300 text-sm">To maintain high deliverability, we recommend warming up new IP addresses starting at 50 emails/day, scaling up by 25% daily over two weeks.</p>
           </div>
        </div>
        <div className="mt-8 flex justify-end">
           <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/30">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfigPage;
