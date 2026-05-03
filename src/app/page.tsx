import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI DecodeX — Smart Past Paper Analyzer | Ace Your Exams',
  description: 'Upload past question papers, get AI-powered topic analysis, syllabus mapping, and a personalized study plan. Study smarter, not harder.',
};

const features = [
  {
    icon: '📄',
    title: 'Multi-Paper Upload',
    desc: 'Upload multiple years of past papers (PDF or images) in one go. We handle the heavy lifting.',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.1))',
  },
  {
    icon: '🤖',
    title: 'AI Pattern Analysis',
    desc: 'Gemini AI extracts topic frequency, question types, difficulty distribution, and year-wise trends.',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.1))',
  },
  {
    icon: '📚',
    title: 'Syllabus Cross-Reference',
    desc: 'Map extracted topics against your official syllabus to identify coverage gaps instantly.',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.1))',
  },
  {
    icon: '🎯',
    title: 'Topic Importance Scoring',
    desc: 'Topics ranked by predicted exam weight — Critical, High, Medium, and Low priority badges.',
    gradient: 'linear-gradient(135deg, rgba(234,179,8,0.2), rgba(249,115,22,0.1))',
  },
  {
    icon: '📅',
    title: 'Smart Study Planner',
    desc: 'Auto-generated 6-week study schedule prioritized by topic importance scores and your timeline.',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(20,184,166,0.1))',
  },
  {
    icon: '📊',
    title: 'Visual Analytics',
    desc: 'Interactive charts: frequency bars, year trends, coverage heatmaps, and difficulty curves.',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
  },
];

const steps = [
  { num: '01', title: 'Upload Papers', desc: 'Drag & drop multiple past question papers and your syllabus document', icon: '📤' },
  { num: '02', title: 'AI Analysis', desc: 'Our AI engine processes every question, mapping topics and patterns automatically', icon: '⚡' },
  { num: '03', title: 'Study Smart', desc: 'Get ranked topic lists, visual insights, and a personalized study schedule', icon: '🏆' },
];

const stats = [
  { value: '95%', label: 'Accuracy in topic extraction' },
  { value: '10x', label: 'Faster than manual review' },
  { value: '6 weeks', label: 'Auto-generated study plans' },
  { value: '∞', label: 'Papers you can analyze' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }} className="bg-grid">
        {/* Background glows */}
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '600px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            {/* Eyebrow */}
            <div className="animate-fade-in" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.375rem 1rem', borderRadius: '999px',
              background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
              fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-accent)',
              marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              <span>✨</span> AI-Powered Exam Intelligence
            </div>

            {/* Headline */}
            <h1 className="display-xl animate-fade-in-up animate-delay-1" style={{ marginBottom: '1.5rem' }}>
              Stop Guessing.{' '}
              <span className="text-gradient">Start Studying Smart.</span>
            </h1>

            {/* Sub */}
            <p className="animate-fade-in-up animate-delay-2" style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
            }}>
              Upload past question papers and your syllabus. Get instant AI analysis of
              topic frequencies, difficulty patterns, and a personalized study planner — all in seconds.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up animate-delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/upload" className="btn btn-primary btn-lg">
                🚀 Analyze My Papers
              </Link>
              <Link href="/dashboard" className="btn btn-secondary btn-lg">
                📊 See Demo Dashboard
              </Link>
            </div>

            {/* Social proof */}
            <p className="animate-fade-in-up animate-delay-4" style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              No account required · Works with any subject · Free to use
            </p>
          </div>

          {/* Hero visual */}
          <div className="animate-fade-in-up animate-delay-5" style={{ marginTop: '4rem' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '860px',
              margin: '0 auto',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(20px)',
            }}>
              {/* Window chrome */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
                <div style={{ flex: 1, height: '26px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', marginLeft: '0.5rem' }} />
              </div>

              {/* Fake dashboard preview */}
              <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
                {[
                  { label: 'Topics Found', value: '47', icon: '🔍', color: '#7c3aed' },
                  { label: 'High-Yield', value: '12', icon: '🎯', color: '#ef4444' },
                  { label: 'Papers Analyzed', value: '8', icon: '📄', color: '#06b6d4' },
                  { label: 'Coverage', value: '78%', icon: '📚', color: '#22c55e' },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px', padding: '1rem',
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Fake bars */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Topic Frequency Distribution</div>
                {[
                  { topic: 'Data Structures & Algorithms', pct: 88, color: '#ef4444' },
                  { topic: 'Operating Systems', pct: 72, color: '#f97316' },
                  { topic: 'Database Management', pct: 65, color: '#eab308' },
                  { topic: 'Computer Networks', pct: 54, color: '#22c55e' },
                  { topic: 'Software Engineering', pct: 41, color: '#06b6d4' },
                ].map((b, i) => (
                  <div key={i} style={{ marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{b.topic}</span>
                      <span style={{ fontSize: '0.72rem', color: b.color, fontWeight: 600 }}>{b.pct}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="grid-4">
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.25rem',
                }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="page-header" style={{ padding: 0, marginBottom: '1rem' }}>
              <div className="eyebrow">🛠️ Everything you need</div>
            </div>
            <h2 className="display-lg">Powerful Features for{' '}
              <span className="text-gradient">Smarter Prep</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: '520px', margin: '1rem auto 0' }}>
              From raw question papers to a personalized study plan — AI DecodeX handles the entire analysis pipeline.
            </p>
          </div>

          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="card" style={{ background: f.gradient, borderColor: 'rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="page-header" style={{ padding: 0, marginBottom: '1rem' }}>
              <div className="eyebrow">⚡ Simple workflow</div>
            </div>
            <h2 className="display-lg">Get Insights in{' '}
              <span className="text-gradient">3 Simple Steps</span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '2rem', position: 'relative', flexWrap: 'wrap' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ flex: 1, minWidth: '200px', textAlign: 'center' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem', margin: '0 auto 1.25rem',
                  boxShadow: '0 0 30px rgba(124,58,237,0.4)',
                }}>
                  {s.icon}
                </div>
                <div style={{
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-accent)',
                  letterSpacing: '0.1em', marginBottom: '0.5rem',
                }}>STEP {s.num}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div style={{
            background: 'var(--gradient-card)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <h2 className="display-lg" style={{ marginBottom: '1rem' }}>
              Ready to <span className="text-gradient">Ace Your Exams?</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
              Upload your first set of past papers and let AI DecodeX reveal the patterns that lead to exam success.
            </p>
            <Link href="/upload" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
              🚀 Upload Papers Now — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem 0', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © 2026 AI DecodeX · Built for the AI Hackathon · Powered by Google Gemini AI
          </p>
        </div>
      </footer>
    </>
  );
}
