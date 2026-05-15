import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const CampaignsPage: React.FC = () => {
  const { state, createCampaign } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  return (
    <div className="p-8 space-y-8 animate-fade-in transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Campaign Management
          </h1>
          <p className="text-slate-400 mt-2">Create and monitor your outreach sequences.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Campaign
        </button>
      </div>

      {/* Campaign List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {state.campaigns.length === 0 ? (
          <div className="lg:col-span-2 glass p-12 text-center text-slate-500 rounded-2xl">
            No campaigns found. Create your first one to get started.
          </div>
        ) : (
          state.campaigns.map((c) => (
            <div key={c.id} className="glass p-6 rounded-2xl border border-white/5 group hover:border-indigo-500/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">{c.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {c.target_segment}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {c.schedule}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'
                }`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Emails Sent</p>
                  <p className="text-lg font-semibold text-slate-300">0</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Open Rate</p>
                  <p className="text-lg font-semibold text-slate-300">0.0%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Created</p>
                  <p className="text-lg font-semibold text-slate-300">{new Date(c.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/5">
                  View Details
                </button>
                <button className="px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-medium transition-colors border border-indigo-500/10">
                  Settings
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl skew-v-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Create New Campaign</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Campaign Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Q4 Outreach Alpha"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-inter"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Target Segment</label>
                  <select 
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-inter"
                    value={newCampaign.target_segment}
                    onChange={(e) => setNewCampaign({...newCampaign, target_segment: e.target.value})}
                  >
                    <option>All Leads</option>
                    <option>Cold Outreach</option>
                    <option>Warm Following</option>
                    <option>Previous Customers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Schedule</label>
                  <select 
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-inter"
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
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30"
                >
                  Initialize
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
