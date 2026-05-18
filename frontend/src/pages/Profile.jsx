import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Shield, Lock } from 'lucide-react';
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
    <div className="content-area">
      <h1 className="section-title">Profile Settings</h1>
      <p className="section-subtitle">Manage your account preferences and security</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginTop: 32 }}>
        
        {/* Profile Info */}
        <GlassCard hover={false} style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
              <User size={20} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Personal Information</h3>
          </div>

          <form onSubmit={updateProfile}>
            <InputField 
              label="Email Address" 
              value={user?.email || ''} 
              disabled 
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
            
            <InputField 
              label="Full Name" 
              name="name" 
              value={profileForm.name} 
              onChange={handleProfileChange} 
              error={errors.name?.[0]} 
            />

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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <Button type="submit" loading={loading}>Save Changes</Button>
            </div>
          </form>
        </GlassCard>

        {/* Password */}
        <GlassCard hover={false} style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
              <Lock size={20} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Security</h3>
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <Button type="submit" variant="secondary" loading={pwdLoading}>Update Password</Button>
            </div>
          </form>
        </GlassCard>

      </div>
    </div>
  );
}
