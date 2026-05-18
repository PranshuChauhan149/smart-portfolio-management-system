import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { notificationService } from '../services';
import { GlassCard, EmptyState, Button } from '../components/UI';
import { formatDistanceToNow } from '../utils/format';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.list({ per_page: 50 });
      setNotifications(res.data.data?.data || []);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const typeColors = {
    success: 'rgba(34,197,94,0.1)',
    warning: 'rgba(245,158,11,0.1)',
    danger: 'rgba(239,68,68,0.1)',
    info: 'rgba(99,102,241,0.1)',
  };

  const typeBorder = {
    success: 'rgba(34,197,94,0.2)',
    warning: 'rgba(245,158,11,0.2)',
    danger: 'rgba(239,68,68,0.2)',
    info: 'rgba(99,102,241,0.2)',
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="section-title">Notifications</h1>
          <p className="section-subtitle">Stay updated with your portfolio alerts</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <Button variant="secondary" onClick={handleMarkAllRead}>
            <CheckCheck size={16} style={{ display: 'inline', marginRight: 8 }} />
            Mark all read
          </Button>
        )}
      </div>

      <GlassCard hover={false} style={{ padding: 24, minHeight: 400 }}>
        {loading ? (
          Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 72, marginBottom: 12, borderRadius: 12 }} />)
        ) : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="All caught up!" description="You don't have any notifications right now." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: notif.is_read ? 'rgba(255,255,255,0.02)' : typeColors[notif.type] || typeColors.info,
                  border: `1px solid ${notif.is_read ? 'rgba(255,255,255,0.05)' : typeBorder[notif.type] || typeBorder.info}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: notif.is_read ? 'default' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {!notif.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                    <h4 style={{ fontSize: 15, fontWeight: notif.is_read ? 500 : 600, color: 'var(--text-primary)' }}>{notif.title}</h4>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>• {formatDistanceToNow(notif.created_at)}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: notif.is_read ? 0 : 16 }}>{notif.message}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: 8, cursor: 'pointer', borderRadius: 8 }}
                  className="hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
