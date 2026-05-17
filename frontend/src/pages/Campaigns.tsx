import React, { useState } from 'react';
import { useAppContext, API_BASE_URL, CreateCampaignPayload } from '../context/AppContext';
import { ALL_TIMEZONES, TZ_REGIONS, localToUtc } from '../data/timezones';
import { InboxPanel, RecipientsPanel, AnalyticsPanel } from '../components/CampaignPanels';
import EmailConfigPanel from '../components/EmailConfigPanel';
import DataIntegrationPanel from '../components/DataIntegrationPanel';
import type { Panel } from '../components/CampaignPanels';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string,string> = {
    active:'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    draft:'bg-slate-500/10 text-slate-400 border-slate-500/20',
    paused:'bg-amber-500/10 text-amber-400 border-amber-500/20',
    completed:'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[status]??map.draft}`}>{status}</span>;
};

const CampaignsPage: React.FC = () => {
  const { state, createCampaign } = useAppContext();
  const [showModal, setShowModal]     = useState(false);
  const [selectedId, setSelectedId]   = useState<string|null>(null);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [toast, setToast]             = useState<string|null>(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [tzRegion, setTzRegion]         = useState('US & Canada');
  const [tzSearch, setTzSearch]         = useState('');

  const [form, setForm] = useState<CreateCampaignPayload & {
    tone: string; product: string; localDt: string; timezone: string;
  }>({
    name:'', target_segment:'All Leads', schedule:'Once',
    subject:'', body_template:'', send_at:'',
    email_config_id:'',
    tone:'professional', product:'',
    localDt:'', timezone:'America/New_York',
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  // Filtered TZ list
  const tzList = ALL_TIMEZONES.filter(t =>
    t.region === tzRegion &&
    (!tzSearch || t.label.toLowerCase().includes(tzSearch.toLowerCase()))
  );

  const handleGenerate = async () => {
    if (!form.name) { showToast('Enter a campaign name first.'); return; }
    setDraftLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/draft`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ campaign_name:form.name, target_segment:form.target_segment, tone:form.tone, product_or_service:form.product||undefined, include_subject:true }),
      });
      if (res.ok) {
        const d = await res.json();
        setForm(p => ({ ...p, subject: d.subject ?? p.subject, body_template: d.body }));
        showToast('✨ AI draft generated!');
      } else { showToast('Draft generation failed — check EURI_API_KEY.'); }
    } catch { showToast('Network error during draft generation.'); }
    setDraftLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const send_at = form.localDt ? localToUtc(form.localDt, form.timezone) : undefined;
    const created = await createCampaign({
      name: form.name, target_segment: form.target_segment,
      schedule: form.schedule, subject: form.subject || undefined,
      body_template: form.body_template || undefined,
      send_at, email_config_id: form.email_config_id || undefined,
    });
    setSubmitting(false);
    if (created) {
      showToast(`✅ "${created.name}" created${send_at ? ' — scheduled!' : '!'}`);
      setShowModal(false);
      setForm({ name:'',target_segment:'All Leads',schedule:'Once',subject:'',body_template:'',send_at:'',email_config_id:'',tone:'professional',product:'',localDt:'',timezone:'America/New_York' });
    } else { showToast('❌ Failed to create campaign.'); }
  };

  const selected = state.campaigns.find(c => c.id === selectedId);

  const PANELS = [
    { key:'inbox'            as Panel, label:'Inbox',            color:'text-blue-400',   icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { key:'data-integration' as Panel, label:'Data Integration', color:'text-cyan-400',   icon:'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
    { key:'drafts'           as Panel, label:'Drafts',           color:'text-amber-400',  icon:'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { key:'sent'             as Panel, label:'Sent',             color:'text-emerald-400',icon:'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
    { key:'analytics'        as Panel, label:'Analytics',        color:'text-purple-400', icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { key:'email-config'     as Panel, label:'Email Config',     color:'text-rose-400',   icon:'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] px-5 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white shadow-2xl animate-fade-in">{toast}</div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Campaign Hub</h1>
          <p className="text-slate-400 mt-1">{state.campaigns.length} campaigns</p>
        </div>
        {!selectedId ? (
          <button onClick={() => setShowModal(true)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            New Campaign
          </button>
        ) : (
          <button onClick={() => { setSelectedId(null); setActivePanel(null); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all flex items-center gap-2 border border-slate-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back
          </button>
        )}
      </div>

      {/* Campaign List */}
      {!selectedId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.campaigns.length === 0 ? (
            <div className="md:col-span-3 border border-dashed border-slate-700 p-16 text-center text-slate-500 rounded-3xl">
              No campaigns yet. Click <strong className="text-slate-400">New Campaign</strong> to start.
            </div>
          ) : state.campaigns.map(c => (
            <div key={c.id} onClick={() => { setSelectedId(c.id); setActivePanel(null); }}
              className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl hover:border-indigo-500/50 transition-all cursor-pointer group shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors truncate pr-2">{c.name}</h3>
                <StatusBadge status={c.status}/>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {c.target_segment && <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase">{c.target_segment}</span>}
                {c.send_at && <span className="text-[10px] text-amber-400">🕐 {new Date(c.send_at).toLocaleString()}</span>}
              </div>
              {c.subject && <p className="text-xs text-slate-400 truncate italic mb-3">"{c.subject}"</p>}
              <div className="flex justify-between pt-3 border-t border-slate-700/30 text-xs">
                <span className="text-slate-500">{c.email_config_id ? '✅ Mailer linked' : '⚠️ No mailer'}</span>
                <span className="text-slate-500">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Campaign Detail View */
        <div className="space-y-6">
          {/* Campaign header */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-6 right-6"><StatusBadge status={selected?.status ?? 'draft'}/></div>
            <h2 className="text-4xl font-black text-slate-100 mb-2">{selected?.name}</h2>
            {selected?.subject && <p className="text-slate-300 font-medium mb-1">📧 {selected.subject}</p>}
            <p className="text-slate-400">
              {selected?.target_segment} · {selected?.schedule}
              {selected?.send_at && ` · Scheduled: ${new Date(selected.send_at).toLocaleString()}`}
            </p>
          </div>

          {/* Panel tabs — 6 columns on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {PANELS.map(p => (
              <button key={p.key} onClick={() => setActivePanel(activePanel === p.key ? null : p.key)}
                className={`p-4 rounded-xl flex items-center gap-4 border transition-all ${activePanel===p.key ? 'bg-slate-700 border-indigo-500/60' : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50'}`}>
                <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center ${p.color}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={p.icon}/>
                  </svg>
                </div>
                <span className="font-semibold text-slate-200">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Panel content */}
          {activePanel && selectedId && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/40 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                  {activePanel === 'inbox' ? '📥 Inbox' : activePanel === 'data-integration' ? '🔌 Data Integration' : activePanel === 'drafts' ? '✏️ Drafts (Queued to Send)' : activePanel === 'sent' ? '✅ Sent' : '📊 Campaign Analytics'}
                </h3>
                {activePanel === 'sent' && selected?.send_at && (
                  <span className="text-xs text-amber-400">Scheduled: {new Date(selected.send_at).toLocaleString()}</span>
                )}
              </div>
              {activePanel === 'inbox'        && <InboxPanel campaignId={selectedId}/>}
              {activePanel === 'data-integration' && <DataIntegrationPanel campaignId={selectedId} onUploadSuccess={() => showToast('🎉 Excel leads uploaded & merged!')}/>}
              {activePanel === 'drafts'       && <RecipientsPanel campaignId={selectedId} status="pending"/>}
              {activePanel === 'sent'         && <RecipientsPanel campaignId={selectedId} status="sent"/>}
              {activePanel === 'analytics'    && selected && <AnalyticsPanel campaign={selected}/>}
              {activePanel === 'email-config' && selected && (
                <div className="p-6">
                  <EmailConfigPanel
                    campaignId={selectedId}
                    linkedConfigId={selected.email_config_id}
                    onLinked={(cid) => showToast(`✅ Mailer linked: ${cid.slice(-6)}`)}
                  />
                </div>
              )}
            </div>
          )}

          {selected?.body_template && (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Email Body Template</h3>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{selected.body_template}</pre>
            </div>
          )}
        </div>
      )}

      {/* ─── Create Modal ─────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">New Campaign</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-5">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Campaign Name *</label>
                  <input required type="text" placeholder="e.g. Enterprise Reach Q3" value={form.name} onChange={e=>set('name',e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>

                {/* Segment + Cadence */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Target Segment</label>
                    <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none" value={form.target_segment} onChange={e=>set('target_segment',e.target.value)}>
                      {['All Leads','Cold Outreach','Warm Following','Enterprise','SMB','Sales','Marketing'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Cadence</label>
                    <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none" value={form.schedule} onChange={e=>set('schedule',e.target.value)}>
                      {['Once','Daily','Weekly','Bi-Weekly','Monthly'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Email Config */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">📬 Email Account (SMTP Config)</label>
                  <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none" value={form.email_config_id} onChange={e=>set('email_config_id',e.target.value)}>
                    <option value="">— None (attach later) —</option>
                    {state.emailConfigs.map(c=><option key={c.id} value={c.id}>{c.name} · {c.sender_address}</option>)}
                  </select>
                  {state.emailConfigs.length===0 && <p className="text-xs text-amber-400 mt-1">No SMTP configs. Add one in Email Configuration first.</p>}
                </div>

                {/* ── Schedule with full timezone ── */}
                <div className="border border-slate-600/40 rounded-2xl p-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-300">📅 Schedule Send</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Region</label>
                      <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" value={tzRegion} onChange={e=>setTzRegion(e.target.value)}>
                        {TZ_REGIONS.map(r=><option key={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Search country / city</label>
                      <input type="text" placeholder="Filter…" value={tzSearch} onChange={e=>setTzSearch(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Timezone</label>
                    <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" value={form.timezone} onChange={e=>set('timezone',e.target.value)}>
                      {tzList.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Date & Time <span className="text-slate-600">(in selected timezone)</span></label>
                    <input type="datetime-local" value={form.localDt} onChange={e=>set('localDt',e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                  </div>
                  {form.localDt && (
                    <p className="text-xs text-indigo-300">🌐 UTC: {localToUtc(form.localDt, form.timezone)}</p>
                  )}
                </div>

                {/* ── AI Draft ── */}
                <div className="border border-indigo-500/20 bg-indigo-500/5 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">✨</span>
                    <h3 className="text-sm font-bold text-indigo-300">AI Draft Generator</h3>
                    <span className="text-[10px] text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">GPT-4o-mini via Euron</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Tone</label>
                      <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" value={form.tone} onChange={e=>set('tone',e.target.value)}>
                        {['professional','casual','urgent','friendly','persuasive'].map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Product / Service</label>
                      <input type="text" placeholder="e.g. EmailSaaS Pro" value={form.product} onChange={e=>set('product',e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"/>
                    </div>
                  </div>
                  <button type="button" onClick={handleGenerate} disabled={draftLoading}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2">
                    {draftLoading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Generating…</> : '✨ Generate Draft'}
                  </button>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Subject</label>
                  <input type="text" placeholder="Auto-filled by AI or enter manually" value={form.subject} onChange={e=>set('subject',e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Email Body <span className="text-slate-600 text-xs">— tokens: {'{name}'} {'{company}'} {'{designation}'}</span>
                  </label>
                  <textarea rows={6} placeholder="Auto-filled by AI or write your template…" value={form.body_template} onChange={e=>set('body_template',e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm leading-relaxed"/>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 font-medium hover:bg-slate-600 transition-all">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
                    {submitting ? 'Creating…' : 'Launch Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
