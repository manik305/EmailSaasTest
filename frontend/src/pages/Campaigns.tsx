import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const CampaignsPage: React.FC = () => {
  const { state, createCampaign } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    target_segment: 'All Leads',
    schedule: 'Daily'
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCampaign(newCampaign);
    setShowCreateModal(false);
    setNewCampaign({ name: '', target_segment: 'All Leads', schedule: 'Daily' });
  };

  const selectedCampaign = state.campaigns.find(c => c.id === selectedCampaignId);

  const folders = [
    { name: 'Inbox', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-blue-400' },
    { name: 'Drafts', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'text-amber-400' },
    { name: 'Sent', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8', color: 'text-emerald-400' },
    { name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'text-purple-400' },
  ];

  const subFolders = [
    { name: 'Alpha Sequence', count: 12 },
    { name: 'Beta Testing', count: 5 },
    { name: 'Cold Templates', count: 24 },
    { name: 'Follow-ups', count: 8 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Campaign Hub
          </h1>
          <p className="text-slate-400 mt-2">Scale your outreach with multi-channel sub-campaigns.</p>
        </div>
        {!selectedCampaignId && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Campaign
          </button>
        )}
        {selectedCampaignId && (
          <button 
            onClick={() => setSelectedCampaignId(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all flex items-center gap-2 border border-slate-700"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </button>
        )}
      </div>

      {!selectedCampaignId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.campaigns.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 bg-slate-800/20 border border-dashed border-slate-700 p-12 text-center text-slate-500 rounded-3xl">
              No active campaigns. Create one to start reaching out.
            </div>
          ) : (
            state.campaigns.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedCampaignId(c.id)}
                className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all group cursor-pointer shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{c.name}</h3>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                    {c.target_segment}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {c.schedule}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/30">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Emails</p>
                    <p className="text-sm font-bold text-slate-200">1,240</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Open Rate</p>
                    <p className="text-sm font-bold text-emerald-400">24.5%</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Campaign Overview */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                 ACTIVE SEQUENCE
               </span>
            </div>
            <h2 className="text-4xl font-black text-slate-100 mb-2">{selectedCampaign?.name}</h2>
            <p className="text-slate-400 max-w-xl">Deep integration with {selectedCampaign?.target_segment} using {selectedCampaign?.schedule} automated triggers.</p>
          </div>

          {/* Core Folders */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <div key={folder.name} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center ${folder.color} group-hover:scale-110 transition-transform shadow-lg`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={folder.icon} />
                  </svg>
                </div>
                <span className="font-semibold text-slate-200">{folder.name}</span>
              </div>
            ))}
          </div>

          {/* Sub-Folders (Bottom Section) */}
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                 <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                 </svg>
                 Campaign Sub-folders
               </h3>
               <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition">NEW FOLDER +</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {subFolders.map((sub) => (
                 <div key={sub.name} className="flex flex-col p-4 bg-slate-900/60 rounded-2xl border border-slate-800/50 hover:border-indigo-500/30 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <svg className="w-8 h-8 text-slate-700 group-hover:text-indigo-500/50 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-800 px-1.5 py-0.5 rounded">{sub.count} items</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-300">{sub.name}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 w-full max-w-md p-8 rounded-3xl border border-slate-700 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white">New Campaign Initiation</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Internal Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Enterprise Reach 2026"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Segment</label>
                  <select 
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                    value={newCampaign.target_segment}
                    onChange={(e) => setNewCampaign({...newCampaign, target_segment: e.target.value})}
                  >
                    <option>All Leads</option>
                    <option>Cold Outreach</option>
                    <option>Warm Following</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Cadence</label>
                  <select 
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                    value={newCampaign.schedule}
                    onChange={(e) => setNewCampaign({...newCampaign, schedule: e.target.value})}
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Once</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-700 text-slate-300 font-medium hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/30"
                >
                  Start Sequence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
