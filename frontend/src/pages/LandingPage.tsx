import React, { useState } from 'react';

const LandingPageFeature: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setGeneratedResult(prompt);
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in transition-all duration-300 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            AI Landing Page Generator
          </h1>
          <p className="text-slate-400 mt-2">Generate high-converting landing pages instantly using fine-tuned models.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass rounded-2xl p-6 border border-white/5 shadow-lg flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-slate-200 mb-6">Campaign Details</h2>
            <form onSubmit={handleGenerate} className="flex flex-col flex-1 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Describe Your Product/Offer</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A B2B SaaS platform that automates email outreach with AI..."
                  className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Target Audience</label>
                <input 
                  type="text"
                  placeholder="e.g., Marketing Managers, Sales Leaders"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Visual Theme</label>
                <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                  <option>Modern SaaS (Tech)</option>
                  <option>Minimalist (E-commerce)</option>
                  <option>Corporate & Trust (Finance)</option>
                  <option>Playful & Vibrant (Consumer)</option>
                </select>
              </div>

              <div className="mt-auto pt-4">
                <button 
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isGenerating || !prompt.trim() ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/25 cursor-pointer'}`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Landing Page
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Preview Area */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="glass shadow-2xl rounded-2xl border border-white/5 flex-1 overflow-hidden flex flex-col relative w-full h-full min-h-[500px]">
             
            {/* Browser Header Mock */}
            <div className="bg-slate-900/80 px-4 py-3 border-b border-white/5 flex items-center gap-4 shrink-0 shadow-sm z-10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
              </div>
              <div className="flex-1">
                <div className="bg-slate-800/80 rounded block w-full py-1.5 px-3 text-xs text-center text-slate-400 font-mono">
                  {generatedResult ? 'preview.yoursaas.app/lp-draft-xyz' : 'Preview Area'}
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 bg-gradient-to-br from-slate-900/50 to-slate-800/50 relative overflow-y-auto">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse gap-6 text-emerald-400">
                  <div className="w-16 h-16 rounded-full border-b-2 border-emerald-400 animate-spin"></div>
                  <div className="text-xl font-medium">Assembling components...</div>
                  <div className="flex gap-2 mt-4">
                    <div className="w-64 h-4 bg-slate-800 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-48 h-4 bg-slate-800 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-56 h-4 bg-slate-800 rounded"></div>
                  </div>
                </div>
              ) : generatedResult ? (
                <div className="absolute inset-0 animate-fade-in bg-white text-slate-800 flex flex-col">
                   <header className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <div className="font-bold text-xl text-indigo-600">YourBrand</div>
                      <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
                        <span>Features</span>
                        <span>Pricing</span>
                        <span className="text-indigo-600">Get Started</span>
                      </nav>
                   </header>
                   <main className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-4xl mx-auto">
                      <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 shadow-sm border border-indigo-100">AI Generated Landing Page</span>
                      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        Transform your cold outreach into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">warm opportunities.</span>
                      </h1>
                      <p className="text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
                        Based on your prompt: "{generatedResult}"
                      </p>
                      <div className="flex gap-4">
                         <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 transition-transform">Start Free Trial</button>
                         <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors">View Demo</button>
                      </div>
                   </main>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-8 text-center gap-4">
                  <svg className="w-16 h-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">Your generated landing page will appear here.</p>
                  <p className="text-sm">Ready to be customized, exported to Nano Banana, or deployed directly.</p>
                </div>
              )}
            </div>
            
            {/* Action Bar (only visible when generated) */}
            {generatedResult && !isGenerating && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex gap-4 shadow-2xl z-20 animate-fade-in">
                <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Edit Code
                </button>
                <div className="w-px h-5 bg-white/20 self-center"></div>
                <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  Export to Nano Banana
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageFeature;
