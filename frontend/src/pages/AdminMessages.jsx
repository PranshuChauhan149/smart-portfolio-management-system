import { useState, useEffect } from 'react';
import { Mail, Check, MessageSquare } from 'lucide-react';
import { contactService } from '../services'; // Wait, in index.js I put admin messages inside adminService.
import { adminService } from '../services';
import { GlassCard, Button, Badge, EmptyState } from '../components/UI';
import { formatDistanceToNow } from '../utils/format';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await adminService.messages({ per_page: 50 });
      setMessages(res.data.data.data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateMessageStatus(id, status);
      setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
      toast.success(`Message marked as ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'unread': return <Badge type="danger">Unread</Badge>;
      case 'read': return <Badge type="warning">Read</Badge>;
      case 'replied': return <Badge type="success">Replied</Badge>;
      default: return <Badge type="info">{status}</Badge>;
    }
  };

  return (
    <div className="content-area">
      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title">Contact Messages</h1>
        <p className="section-subtitle">Manage inquiries from the landing page</p>
      </div>

      <GlassCard hover={false} style={{ padding: 24, minHeight: 400 }}>
        {loading ? (
          Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 80, marginBottom: 16, borderRadius: 12 }} />)
        ) : messages.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No messages yet" description="You'll see contact form submissions here." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: msg.status === 'unread' ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${msg.status === 'unread' ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                      <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{msg.name}</h4>
                      {getStatusBadge(msg.status)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
                      <Mail size={14} />
                      <a href={`mailto:${msg.email}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{msg.email}</a>
                      <span>•</span>
                      <span>{formatDistanceToNow(msg.created_at)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {msg.status === 'unread' && (
                      <Button size="sm" variant="secondary" onClick={() => updateStatus(msg.id, 'read')}>
                        <Check size={14} style={{ display: 'inline', marginRight: 4 }} /> Mark Read
                      </Button>
                    )}
                    {msg.status !== 'replied' && (
                      <Button size="sm" variant="success" onClick={() => updateStatus(msg.id, 'replied')}>
                        <Check size={14} style={{ display: 'inline', marginRight: 4 }} /> Mark Replied
                      </Button>
                    )}
                  </div>
                </div>

                {msg.subject && <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>Subject: {msg.subject}</div>}
                
                <div style={{ padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12, fontSize: 14, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
