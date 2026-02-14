import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Kindness() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [likedIds, setLikedIds] = useState(() => new Set());
  const [sparkId, setSparkId] = useState(null);

  const load = () => {
    api.get('/kindness').then(({ data }) => setPosts(data)).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    setLoading(true);
    setSubmitted(false);
    try {
      await api.post('/kindness', { message: message.trim() });
      setMessage('');
      setSubmitted(true);
      load();
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = (postId) => {
    setLikedIds((prev) => new Set(prev).add(postId));
    setSparkId(postId);
    setTimeout(() => setSparkId(null), 500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-2">Digital Kindness Wall</h1>
      <p className="text-slate-600 text-sm mb-6">Share a positive message for the campus.</p>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Post a message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Something kind or encouraging..."
          />
          {submitted && <p className="text-sm text-accent-600 font-medium">Posted!</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-micro btn-micro-accent w-full py-2.5 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-slate-800 mb-3">Recent messages</h2>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-slate-500 text-sm">No messages yet. Be the first!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col"
            >
              <p className="text-slate-800">{post.message}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-500">
                  {post.full_name ? post.full_name : 'Anonymous'} · {new Date(post.created_at).toLocaleString()}
                </p>
                <button
                  type="button"
                  aria-label="Like"
                  onClick={() => handleLikeClick(post.id)}
                  className={`reaction-like-btn relative px-2 py-1 rounded text-sm transition-colors ${sparkId === post.id ? 'reaction-spark' : ''} ${likedIds.has(post.id) ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'}`}
                >
                  ♥
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
