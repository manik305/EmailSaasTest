import React, { useState } from 'react';

const SocialMedia: React.FC = () => {
  const [posts, setPosts] = useState([
    { id: '1', platform: 'LinkedIn', content: 'Exciting news! We are launching our new AI features today...', status: 'Scheduled', time: 'Tomorrow, 10:00 AM' },
    { id: '2', platform: 'Twitter', content: 'AI is changing the world of email marketing. Check out our latest...', status: 'Published', time: '2 hours ago' },
  ]);

  const platformIcons: Record<string, React.ReactNode> = {
    LinkedIn: (
      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    Twitter: (
      <svg className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
      </svg>
    ),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Social Media Hub</h1>
          <p className="text-slate-400">Manage and schedule posts across LinkedIn, Facebook, and Twitter.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition shadow-lg shadow-indigo-500/20">
          Create New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Analytics Card */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Channel Engagement</h3>
          <div className="space-y-4">
            {['LinkedIn', 'Facebook', 'Twitter'].map((platform) => (
              <div key={platform} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-slate-700/50 flex items-center justify-center">
                   {platform === 'LinkedIn' ? platformIcons.LinkedIn : null}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{platform}</span>
                    <span className="text-slate-400">84% reach</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Card */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Recent & Upcoming</h3>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/30 flex gap-4">
                <div className="mt-1">{platformIcons[post.platform] || null}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{post.content}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${post.status === 'Scheduled' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-green-500/10 text-green-400'}`}>
                      {post.status}
                    </span>
                    <span className="text-[10px] text-slate-500">{post.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
