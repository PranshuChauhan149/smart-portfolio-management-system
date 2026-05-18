import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Aurora Background Effects */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      <div className="glass-card" style={{
        padding: '60px 40px',
        textAlign: 'center',
        maxWidth: 500,
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{
          fontSize: '100px',
          fontWeight: 900,
          lineHeight: 1,
          marginBottom: 16,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          404
        </h1>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15 }}>
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Home size={18} />
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
