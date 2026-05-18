import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import { authService } from '../services';
import { setCredentials } from '../store/authSlice';
import { GlassCard } from '../components/UI';
import toast from 'react-hot-toast';

export default function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    risk_preference: 'medium',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await authService.register(form);
      const { user, token } = res.data;
      dispatch(setCredentials({ user, token }));
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.errors) {
        setErrors(errData.errors);
      } else {
        toast.error(errData?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const riskOptions = [
    { value: 'low', label: '🛡️ Conservative', desc: 'Bonds, Gold' },
    { value: 'medium', label: '⚖️ Balanced', desc: 'Stocks, Funds' },
    { value: 'high', label: '🚀 Aggressive', desc: 'Crypto, Growth' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', right: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 10 }}
      >
        <GlassCard hover={false} style={{ padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>S</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>{t('auth.createAccount')}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>{t('auth.createSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="input-field"
                  style={{ paddingLeft: 44 }}
                />
              </div>
              {errors.name && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.name[0]}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>{t('auth.emailLabel')}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="input-field"
                  style={{ paddingLeft: 44 }}
                />
              </div>
              {errors.email && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.email[0]}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>{t('auth.passwordLabel')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="input-field"
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4 }}>{errors.password[0]}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="input-field"
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>

            {/* Risk Preference */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>
                <Shield size={14} style={{ display: 'inline', marginRight: 6 }} />
                Investment Risk Preference
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {riskOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, risk_preference: opt.value })}
                    style={{
                      padding: '12px 8px',
                      borderRadius: 10,
                      border: `1px solid ${form.risk_preference === opt.value ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`,
                      background: form.risk_preference === opt.value ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: form.risk_preference === opt.value ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn-primary"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 12, marginBottom: 20 }}
            >
              {loading ? '...' : t('auth.createBtn') + ' →'}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
