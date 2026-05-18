import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, CheckCheck, Trash2, X } from 'lucide-react';
import { notificationService } from '../services';
import { formatDistanceToNow } from '../utils/format';

export default function Navbar({ onMobileMenuOpen }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.list({ per_page: 5 });
      setNotifications(res.data.data?.data || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch { /* ignore */ }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.unreadCount();
      setUnreadCount(res.data.count || 0);
    } catch { /* ignore */ }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  const typeColors = {
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
  };

  return (
    <header className="navbar">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        maxWidth: '100%',
      }}>
        {/* Left side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            className="md:hidden"
            onClick={onMobileMenuOpen}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            <Menu size={18} />
          </button>

          {/* Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search assets, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '8px 12px 8px 36px',
                color: 'var(--text-primary)',
                fontSize: 13,
                width: 240,
                outline: 'none',
                transition: 'all 0.2s',
              }}
              className="hidden md:block"
            />
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Notifications */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <motion.button
              onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) fetchNotifications(); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                position: 'relative',
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: 'var(--color-danger)',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg-primary)',
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: 360,
                    background: 'rgba(15, 23, 42, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    zIndex: 500,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                      Notifications {unreadCount > 0 && <span style={{ background: 'var(--color-danger)', color: 'white', fontSize: 11, padding: '2px 6px', borderRadius: 10, marginLeft: 6 }}>{unreadCount}</span>}
                    </h3>
                    <button
                      onClick={handleMarkAllRead}
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  </div>

                  <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                        <Bell size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <motion.div
                          key={notif.id}
                          onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                          whileHover={{ background: 'rgba(255,255,255,0.04)' }}
                          style={{
                            padding: '14px 20px',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            cursor: notif.is_read ? 'default' : 'pointer',
                            position: 'relative',
                          }}
                        >
                          {!notif.is_read && (
                            <div style={{
                              position: 'absolute',
                              left: 8,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: typeColors[notif.type] || '#6366F1',
                            }} />
                          )}
                          <p style={{ fontSize: 13, fontWeight: notif.is_read ? 400 : 600, color: 'var(--text-primary)', marginBottom: 2, paddingLeft: notif.is_read ? 0 : 8 }}>
                            {notif.title}
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: notif.is_read ? 0 : 8, lineHeight: 1.5 }}>
                            {notif.message.length > 80 ? notif.message.substring(0, 80) + '...' : notif.message}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, paddingLeft: notif.is_read ? 0 : 8 }}>
                            {formatDistanceToNow(notif.created_at)}
                          </p>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => { navigate('/notifications'); setNotifOpen(false); }}
                      style={{ width: '100%', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}
                    >
                      View all notifications →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <motion.button
            onClick={() => navigate('/profile')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
