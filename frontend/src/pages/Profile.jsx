import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { User, Shield, Lock, Mail, BadgeCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import { authService } from '../services';
import { updateUser } from '../store/authSlice';
import { GlassCard, Button, InputField, SelectField } from '../components/UI';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    risk_preference: user?.risk_preference || 'medium',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pwdErrors, setPwdErrors] = useState({});

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    if (pwdErrors[e.target.name]) setPwdErrors({ ...pwdErrors, [e.target.name]: '' });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await authService.updateProfile(profileForm);
      dispatch(updateUser(res.data.user));
      toast.success('Profile updated successfully');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdErrors({});
    try {
      await authService.changePassword(passwordForm);
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      toast.success('Password changed successfully');
    } catch (err) {
      if (err.response?.data?.errors) {
        setPwdErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || 'Failed to change password');
      }
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="content-area profile-page">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="profile-hero glass-card-static"
        style={{ padding: 24, marginBottom: 24 }}
      >
        <div className="profile-hero-top">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.14)', color: '#6366F1', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
              <Sparkles size={14} /> Account center
            </div>
            <h1 className="section-title" style={{ marginBottom: 8 }}>Profile Settings</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>Update your identity, risk profile, and security settings from one clean place.</p>
          </div>

          <div className="profile-hero-badge">
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 12px 28px rgba(99,102,241,0.28)' }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Signed in as</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name}</div>
            </div>
          </div>
        </div>

        <div className="profile-hero-stats">
          <div className="profile-stat-chip">
            <Mail size={16} />
            <span>{user?.email}</span>
          </div>
          <div className="profile-stat-chip">
            <BadgeCheck size={16} />
            <span>{user?.role === 'admin' ? 'Admin access' : 'Investor access'}</span>
          </div>
          <div className="profile-stat-chip">
            <ArrowUpRight size={16} />
            <span>Risk: {profileForm.risk_preference}</span>
          </div>
        </div>
      </motion.div>

      <div className="profile-grid">
        {/* Profile Info */}
        <GlassCard hover={false} style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Personal Information</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Edit your public profile details</p>
            </div>
          </div>

          <form onSubmit={updateProfile}>
            <div className="profile-form-grid">
              <InputField 
                label="Email Address" 
                value={user?.email || ''} 
                disabled 
                style={{ opacity: 0.72, cursor: 'not-allowed' }}
              />
              
              <InputField 
                label="Full Name" 
                name="name" 
                value={profileForm.name} 
                onChange={handleProfileChange} 
                error={errors.name?.[0]} 
              />
            </div>

            <SelectField 
              label="Risk Preference" 
              name="risk_preference" 
              value={profileForm.risk_preference} 
              onChange={handleProfileChange} 
              error={errors.risk_preference?.[0]}
            >
              <option value="low">Conservative (Low Risk)</option>
              <option value="medium">Balanced (Medium Risk)</option>
              <option value="high">Aggressive (High Risk)</option>
            </SelectField>

            <div className="profile-action-row">
              <div className="profile-note">Your risk setting affects advice, summaries, and recommendations.</div>
              <Button type="submit" loading={loading}>Save Changes</Button>
            </div>
          </form>
        </GlassCard>

        {/* Password */}
        <GlassCard hover={false} style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
              <Lock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Security</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Keep your account protected</p>
            </div>
          </div>

          <form onSubmit={updatePassword}>
            <InputField 
              label="Current Password" 
              type="password" 
              name="current_password" 
              value={passwordForm.current_password} 
              onChange={handlePasswordChange} 
              error={pwdErrors.current_password?.[0]} 
              required
            />
            
            <div className="profile-form-grid">
              <InputField 
                label="New Password" 
                type="password" 
                name="password" 
                value={passwordForm.password} 
                onChange={handlePasswordChange} 
                error={pwdErrors.password?.[0]} 
                required
                minLength={8}
              />
              
              <InputField 
                label="Confirm New Password" 
                type="password" 
                name="password_confirmation" 
                value={passwordForm.password_confirmation} 
                onChange={handlePasswordChange} 
                required
              />
            </div>

            <div className="profile-action-row">
              <div className="profile-note">Use at least 8 characters with a mix of letters, numbers, and symbols.</div>
              <Button type="submit" variant="secondary" loading={pwdLoading}>Update Password</Button>
            </div>
          </form>
        </GlassCard>

      </div>
    </div>
  );
}
