import React, { useState } from 'react';

const VoiceManager: React.FC = () => {
  const [agents, setAgents] = useState([
    { id: '1', name: 'Inbound Support AI', provider: 'Vapi', status: 'Active', language: 'English' },
    { id: '2', name: 'Outbound Sales AI', provider: 'Twilio', status: 'Inactive', language: 'English' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Voice Calling Agents</h1>
          <p className="text-slate-400">Configure AI-powered calling agents using Vapi and Twilio.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition shadow-lg shadow-indigo-500/20">
          Create New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${agent.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                {agent.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-1">{agent.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{agent.provider} • {agent.language}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 rounded-lg transition">Edit Agent</button>
              <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 rounded-lg transition">Logs</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-slate-100 mb-3">Integrate with Vapi or Twilio</h2>
        <p className="text-slate-400 mb-6">Connect your existing voice infrastructure or create agents directly on our platform using our pre-built templates.</p>
        <div className="flex justify-center gap-4">
          <img src="https://vapi.ai/favicon.ico" alt="Vapi" className="w-8 h-8 rounded opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition cursor-pointer" />
          <img src="https://www.twilio.com/favicon.ico" alt="Twilio" className="w-8 h-8 rounded opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default VoiceManager;
