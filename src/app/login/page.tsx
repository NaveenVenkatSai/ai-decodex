'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPwd, setShowRegPwd] = useState(false);

  useEffect(() => {
    if (session) router.push('/upload');
  }, [session, router]);

  useEffect(() => {
    const err = searchParams.get('error');
    if (err === 'CredentialsSignin') setError('Invalid email or password. Please try again.');
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await signIn('credentials', {
      email: loginEmail, password: loginPassword,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) setError('Invalid email or password. Please try again.');
    else router.push('/upload');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (regPassword !== regConfirm) { setError('Passwords do not match.'); return; }
    if (regPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); }
      else {
        setSuccess('Account created! Signing you in…');
        await signIn('credentials', { email: regEmail, password: regPassword, redirect: false });
        router.push('/upload');
      }
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  if (status === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 48, height: 48 }} />
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', color: 'var(--text-primary)',
    fontSize: '0.9rem', outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8rem',
    fontWeight: 600, color: 'var(--text-secondary)',
    marginBottom: '0.4rem', textAlign: 'left',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />

      {/* Card */}
      <div className="animate-fade-in-up" style={{
        background: 'rgba(13,20,36,0.9)', backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(124,58,237,0.18)', borderRadius: '24px',
        padding: '2.5rem 2rem', width: '100%', maxWidth: '400px', margin: '1rem',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            borderRadius: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.75rem',
            margin: '0 auto 1rem', boxShadow: '0 0 30px rgba(124,58,237,0.35)',
          }}>🧠</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: '0.4rem' }}>
            {tab === 'login' ? 'Sign in to AI DecodeX' : 'Join AI DecodeX — it\'s free'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', marginBottom: '1.5rem' }}>
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
              style={{
                flex: 1, padding: '0.55rem', borderRadius: '7px', border: 'none',
                background: tab === t ? 'rgba(124,58,237,0.5)' : 'transparent',
                color: tab === t ? 'white' : 'var(--text-muted)',
                fontWeight: tab === t ? 600 : 400, fontSize: '0.875rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {t === 'login' ? '🔑 Sign In' : '✨ Register'}
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.65rem 0.9rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.82rem' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '0.65rem 0.9rem', marginBottom: '1rem', color: '#86efac', fontSize: '0.82rem' }}>
            ✅ {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input id="login-email" type="email" required placeholder="you@example.com"
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input id="login-password" type={showLoginPwd ? 'text' : 'password'} required
                  placeholder="Enter your password" value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '2.8rem' }}
                  onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}>
                  {showLoginPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button id="login-submit-btn" type="submit" disabled={loading}
              style={{
                width: '100%', padding: '0.85rem',
                background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                border: 'none', borderRadius: '10px', color: 'white',
                fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', marginTop: '0.25rem',
                boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
              }}>
              {loading ? '⏳ Signing in…' : '🚀 Sign In'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input id="reg-name" type="text" required placeholder="John Doe"
                value={regName} onChange={e => setRegName(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Email address</label>
              <input id="reg-email" type="email" required placeholder="you@example.com"
                value={regEmail} onChange={e => setRegEmail(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-password" type={showRegPwd ? 'text' : 'password'} required
                  placeholder="Min. 6 characters" value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '2.8rem' }}
                  onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button type="button" onClick={() => setShowRegPwd(!showRegPwd)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}>
                  {showRegPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Confirm password</label>
              <input id="reg-confirm" type="password" required placeholder="Re-enter password"
                value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                style={{ ...inputStyle, borderColor: regConfirm && regConfirm !== regPassword ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)' }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = regConfirm && regConfirm !== regPassword ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)')}
              />
            </div>
            {/* Password strength bar */}
            {regPassword && (
              <div>
                <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '2px', transition: 'all 0.3s', width: regPassword.length < 6 ? '25%' : regPassword.length < 10 ? '60%' : '100%', background: regPassword.length < 6 ? '#ef4444' : regPassword.length < 10 ? '#f59e0b' : '#22c55e' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Strength: {regPassword.length < 6 ? 'Weak' : regPassword.length < 10 ? 'Good' : 'Strong'}
                </span>
              </div>
            )}
            <button id="register-submit-btn" type="submit" disabled={loading}
              style={{
                width: '100%', padding: '0.85rem',
                background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                border: 'none', borderRadius: '10px', color: 'white',
                fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', marginTop: '0.25rem',
                boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
              }}>
              {loading ? '⏳ Creating account…' : '✨ Create Account'}
            </button>
          </form>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0 1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Guest */}
        <button id="guest-access-btn" onClick={() => router.push('/dashboard')}
          style={{
            width: '100%', padding: '0.7rem',
            background: 'transparent', border: '1px solid var(--border-accent)',
            borderRadius: '10px', color: 'var(--text-secondary)',
            fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
          👀 View Demo Dashboard
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" style={{ width: 48, height: 48 }} /></div>}>
      <LoginForm />
    </Suspense>
  );
}
