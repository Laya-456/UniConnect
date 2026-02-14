import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/users/chat-partners').then(({ data }) => setPartners(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (userId) {
      const id = parseInt(userId, 10);
      const fromList = partners.find((p) => p.id === id);
      if (fromList) {
        setSelectedPartner(fromList);
      } else {
        setSelectedPartner({ id, full_name: '…', email: '' });
        api.get(`/users/${id}/profile`).then(({ data }) => {
          setSelectedPartner((prev) => (prev?.id === data.id ? { ...prev, full_name: data.full_name } : prev));
        }).catch(() => {
          setSelectedPartner((prev) => (prev?.id === id ? { ...prev, full_name: 'User' } : prev));
        });
      }
    } else {
      setSelectedPartner(partners[0] || null);
    }
  }, [userId, partners]);

  useEffect(() => {
    if (!selectedPartner) {
      setMessages([]);
      return;
    }
    api.get(`/chat/${selectedPartner.id}`).then(({ data }) => setMessages(data)).catch(() => setMessages([]));
  }, [selectedPartner]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner || sending) return;
    setSending(true);
    try {
      await api.post('/chat', { receiver_id: selectedPartner.id, message: newMessage.trim() });
      setNewMessage('');
      api.get(`/chat/${selectedPartner.id}`).then(({ data }) => setMessages(data)).catch(() => {});
    } finally {
      setSending(false);
    }
  };

  if (!selectedPartner && !userId) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Chat</h1>
        <p className="text-slate-500 text-sm mb-4">
          No conversations yet. Go to Connect to find someone and start a chat.
        </p>
        <Link to="/match" className="text-primary-600 font-medium hover:underline">
          Find someone to connect with →
        </Link>
      </div>
    );
  }

  if (!selectedPartner) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Chat</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 border-b border-slate-200">
        {partners.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setSelectedPartner(p);
              navigate(`/chat/${p.id}`);
            }}
            className={`btn-micro shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
              selectedPartner.id === p.id ? 'bg-primary-500 text-white btn-micro-primary' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {p.full_name}
          </button>
        ))}
        {partners.length === 0 && selectedPartner && (
          <span className="text-sm text-slate-500">Chat with {selectedPartner.full_name}</span>
        )}
      </div>

      <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-slate-200 bg-white">
          <p className="font-medium text-slate-800">{selectedPartner.full_name}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((m, idx) => {
            const isLastFromMe = m.sender_id === user.id && idx === messages.length - 1;
            return (
              <div
                key={m.id}
                className={`flex chat-msg-wrapper ${m.sender_id === user.id ? 'justify-end' : 'justify-start'} ${isLastFromMe ? 'chat-msg-just-sent' : ''}`}
              >
                <div
                  className={`chat-msg-bubble max-w-[80%] rounded-xl px-3 py-2 ${
                    m.sender_id === user.id ? 'bg-primary-500 text-white' : 'bg-white border border-slate-200'
                  }`}
                >
                  <p className="text-sm">{m.message}</p>
                  <p className={`text-xs mt-0.5 ${m.sender_id === user.id ? 'text-primary-100' : 'text-slate-500'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={sendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="btn-micro btn-micro-primary px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
