'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const linkStyle = (path: string) => ({
    color: isActive(path) ? 'var(--text-primary)' : undefined,
    fontWeight: isActive(path) ? (600 as number) : undefined,
  });

  if (pathname === '/login') return null;

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">🧠</span>
          AI DecodeX
        </Link>

        <ul className="navbar-links">
          <li><Link href="/" style={linkStyle('/')}>Home</Link></li>
          <li><Link href="/upload" style={linkStyle('/upload')}>Upload</Link></li>
          <li><Link href="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link></li>
          <li><Link href="/study-planner" style={linkStyle('/study-planner')}>Study Planner</Link></li>
        </ul>

        {session ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: '999px', padding: '0.25rem 0.75rem 0.25rem 0.25rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {/* Initials avatar */}
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', color: 'white', fontWeight: 700,
              }}>
                {initials}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session.user?.name?.split(' ')[0]}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>▼</span>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 0.5rem)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)', padding: '0.5rem',
                minWidth: '180px', zIndex: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.25rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{session.user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{session.user?.email}</div>
                </div>
                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.25rem 0' }} />
                <button
                  onClick={() => { setDropdownOpen(false); router.push('/upload'); }}
                  style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', borderRadius: '6px' }}
                >
                  📤 New Analysis
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: '/login' }); }}
                  style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#f87171', fontSize: '0.875rem', cursor: 'pointer', borderRadius: '6px' }}
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="navbar-cta">
            🔐 Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
