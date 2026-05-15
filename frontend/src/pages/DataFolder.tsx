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
    <div className="p-8 space-y-8 animate-fade-in transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Data Ingestion
          </h1>
          <p className="text-slate-400 mt-2">Upload your CSV/Excel lead lists for validation and sequence matching.</p>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div 
        className={`glass p-12 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500'}`}
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
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-indigo-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-slate-200">Drag & Drop your files here</h3>
        <p className="text-slate-400 mb-6">Supports CSV and Excel files up to 50MB</p>
        <button 
          onClick={onButtonClick}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/30"
        >
          Browse Files
        </button>
      </div>

      {/* Recent Uploads Table */}
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="px-6 py-4 border-b border-white/5 bg-white/5">
          <h2 className="text-lg font-semibold text-slate-200">Recent Uploads</h2>
        </div>
        <div className="p-0">
          {state.files.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No files uploaded yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase text-slate-400 bg-white/5">
                  <th className="px-6 py-3 font-medium">Filename</th>
                  <th className="px-6 py-3 font-medium">Size</th>
                  <th className="px-6 py-3 font-medium">Upload Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {state.files.map((f) => (
                  <tr key={f.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-slate-300 font-medium">{f.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{f.size}</td>
                    <td className="px-6 py-4 text-slate-400">{f.uploadDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${f.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${f.status === 'Completed' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Database Recipients Table */}
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-200">Database Leads</h2>
          <span className="text-xs font-medium px-2 py-1 rounded bg-indigo-500/20 text-indigo-400">
            {state.recipients.length} Total
          </span>
        </div>
        <div className="p-0">
          {state.recipients.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No recipients in database. Upload a file to see them here.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase text-slate-400 bg-white/5">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {state.recipients.slice(0, 50).map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-slate-300 font-medium">{r.name || '---'}</td>
                    <td className="px-6 py-4 text-slate-400">{r.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(r.created_at).toLocaleDateString()}
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
