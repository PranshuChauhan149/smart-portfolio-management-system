import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldAlert, CheckCircle, Trash2, Send, Eye } from 'lucide-react';
import { adminService } from '../services';
import { GlassCard, Button, Modal, Badge, InputField } from '../components/UI';
import { formatDate } from '../utils/format';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'info', user_id: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        const res = await adminService.users({ search, per_page: 50 });
        if (active) {
          setUsers(res.data.data.data);
        }
      } catch {
        toast.error('Failed to fetch users');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [search]);

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateUserStatus(id, status);
      setUsers(users.map(u => u.id === id ? { ...u, status } : u));
      toast.success(`User marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This will delete all their data.')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await adminService.sendNotification(notifForm);
      toast.success(notifForm.user_id ? 'Notification sent to user' : 'Broadcast sent to all users');
      setIsNotifModalOpen(false);
      setNotifForm({ title: '', message: '', type: 'info', user_id: '' });
    } catch {
      toast.error('Failed to send notification');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <Badge type="success">Active</Badge>;
      case 'pending': return <Badge type="warning">Pending</Badge>;
      case 'suspended': return <Badge type="danger">Suspended</Badge>;
      default: return <Badge type="info">{status}</Badge>;
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="section-title">Manage Users</h1>
          <p className="section-subtitle">Administer platform investors and accounts</p>
        </div>
        <Button onClick={() => { setNotifForm({ ...notifForm, user_id: '' }); setIsNotifModalOpen(true); }}>
          <Send size={16} style={{ display: 'inline', marginRight: 8 }} />
          Broadcast Notification
        </Button>
      </div>

      <GlassCard hover={false} style={{ padding: 24 }}>
        <div style={{ marginBottom: 24, position: 'relative', maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: 40 }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Risk Pref</th>
                <th>Portfolios</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton" style={{ width: 150, height: 20 }} /></td>
                    <td><div className="skeleton" style={{ width: 60, height: 20 }} /></td>
                    <td><div className="skeleton" style={{ width: 80, height: 20 }} /></td>
                    <td><div className="skeleton" style={{ width: 40, height: 20 }} /></td>
                    <td><div className="skeleton" style={{ width: 100, height: 20 }} /></td>
                    <td><div className="skeleton" style={{ width: 120, height: 20, float: 'right' }} /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No users found</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr
                    key={u.id}
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td>{getStatusBadge(u.status)}</td>
                    <td><span style={{ textTransform: 'capitalize' }}>{u.risk_preference}</span></td>
                    <td>{u.portfolios_count || 0} assets</td>
                    <td>{formatDate(u.created_at)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${u.id}`); }}
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {u.status !== 'active' && (
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(u.id, 'active'); }} style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }} title="Activate">
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {u.status !== 'suspended' && (
                          <button onClick={(e) => { e.stopPropagation(); updateStatus(u.id, 'suspended'); }} style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }} title="Suspend">
                            <ShieldAlert size={16} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setNotifForm({ ...notifForm, user_id: u.id }); setIsNotifModalOpen(true); }}
                          style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary)', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }} 
                          title="Send Notification"
                        >
                          <Send size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteUser(u.id); }} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }} title="Delete User">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal isOpen={isNotifModalOpen} onClose={() => setIsNotifModalOpen(false)} title={notifForm.user_id ? "Send Notification to User" : "Broadcast to All Users"}>
        <form onSubmit={sendNotification}>
          <InputField label="Title" value={notifForm.title} onChange={e => setNotifForm({...notifForm, title: e.target.value})} required placeholder="e.g. System Update" />
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Message</label>
            <textarea 
              value={notifForm.message} 
              onChange={e => setNotifForm({...notifForm, message: e.target.value})} 
              className="input-field" 
              style={{ minHeight: 100, resize: 'vertical' }} 
              required
              placeholder="Enter your message here..."
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Type</label>
            <select value={notifForm.type} onChange={e => setNotifForm({...notifForm, type: e.target.value})} className="select-field">
              <option value="info">Info (Blue)</option>
              <option value="success">Success (Green)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="danger">Danger (Red)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button variant="secondary" onClick={() => setIsNotifModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={formLoading}>Send</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
