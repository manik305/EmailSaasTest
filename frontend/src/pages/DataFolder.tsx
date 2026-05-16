import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const DataFolderPage: React.FC = () => {
  const { state, uploadFileToBackend } = useAppContext();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFileToBackend(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadFileToBackend(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Lead Data Hub
          </h1>
          <p className="text-slate-400 mt-2">Manage your high-value lead profiles with advanced segmentation data.</p>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div 
        className={`glass p-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept=".csv,.xlsx,.xls" 
          onChange={handleChange}
        />
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-indigo-400 shadow-xl">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-slate-100">Drop your lead lists here</h3>
        <p className="text-slate-400 mb-6 text-sm">Supports First Name, Last Name, Designation, Industry, and more.</p>
        <button 
          onClick={onButtonClick}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95"
        >
          Select Files
        </button>
      </div>

      {/* Database Recipients Table */}
      <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Verified Lead Database</h2>
            <p className="text-xs text-slate-400 mt-1">Real-time sync with MongoDB</p>
          </div>
          <div className="flex gap-4">
             <div className="px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
               {state.recipients.length} Profiles
             </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {state.recipients.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              No lead profiles found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/50">
                  <th className="px-6 py-4 font-semibold">Name / Email</th>
                  <th className="px-6 py-4 font-semibold">Designation</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Industry</th>
                  <th className="px-6 py-4 font-semibold">Region</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {state.recipients.map((r) => (
                  <tr key={r.id} className="hover:bg-indigo-500/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-slate-200 font-medium">{r.name || 'Anonymous Lead'}</div>
                      <div className="text-xs text-slate-500">{r.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{r.designation || '---'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{r.department || '---'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{r.industry || '---'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{r.region || '---'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter bg-slate-700 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataFolderPage;
