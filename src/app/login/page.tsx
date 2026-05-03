'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.push('/upload');
  }, [session, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/upload' });
  };

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 48, height: 48 }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }} className="bg-grid">

      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '10%', left: '20%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)',
      }} />

      {/* Login card */}
      <div className="animate-fade-in-up" style={{
        background: 'rgba(13,20,36,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: '420px',
        margin: '1rem',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        textAlign: 'center',
      }}>

        {/* Logo */}
        <div style={{
          width: '72px', height: '72px',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', margin: '0 auto 1.5rem',
          boxShadow: '0 0 40px rgba(124,58,237,0.4)',
        }} className="animate-pulse-glow">
          🧠
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          Welcome to <span className="text-gradient">AI DecodeX</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2.25rem', lineHeight: 1.6 }}>
          Sign in to analyze past papers, track your progress, and generate personalized study plans.
        </p>

        {/* Google Sign-In Button */}
        <button
          id="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0.9rem 1.5rem',
            background: loading ? 'rgba(255,255,255,0.04)' : 'white',
            color: '#1f2937',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)'; }}
        >
          {loading ? (
            <div className="spinner" style={{ width: 20, height: 20, borderColor: 'rgba(0,0,0,0.1)', borderTopColor: '#7c3aed' }} />
          ) : (
            /* Google SVG */
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.75rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or explore without account</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Guest access */}
        <button
          id="guest-access-btn"
          onClick={() => router.push('/dashboard')}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'transparent',
            border: '1px solid var(--border-accent)',
            borderRadius: '12px',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
        >
          👀 View Demo Dashboard
        </button>

        {/* Features */}
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {[
            '🔒 Secure Google sign-in',
            '📊 Save & revisit your analyses',
            '📅 Access your study plans anytime',
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {f}
            </div>
          ))}
        </div>

        <p style={{ marginTop: '1.75rem', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
          Your data is stored securely.
        </p>
      </div>
    </div>
  );
}
