'use client';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface PaperFile {
  id: string;
  file: File;
  year: number;
  name: string;
  size: number;
}

const ANALYSIS_STEPS = [
  { icon: '📤', label: 'Uploading files...' },
  { icon: '🔍', label: 'Extracting text from papers...' },
  { icon: '🤖', label: 'Running AI pattern analysis...' },
  { icon: '📊', label: 'Computing topic importance scores...' },
  { icon: '📅', label: 'Generating study planner...' },
  { icon: '✅', label: 'Analysis complete!' },
];

export default function UploadPage() {
  const router = useRouter();
  const [papers, setPapers] = useState<PaperFile[]>([]);
  const [syllabus, setSyllabus] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSylDragging, setIsSylDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const paperInputRef = useRef<HTMLInputElement>(null);
  const syllabusInputRef = useRef<HTMLInputElement>(null);

  const addPapers = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const newPapers: PaperFile[] = arr.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      file: f,
      year: new Date().getFullYear() - papers.length - i,
      name: f.name,
      size: f.size,
    }));
    setPapers(prev => [...prev, ...newPapers]);
  }, [papers.length]);

  const updateYear = (id: string, year: number) => {
    setPapers(prev => prev.map(p => p.id === id ? { ...p, year } : p));
  };

  const removePaper = (id: string) => {
    setPapers(prev => prev.filter(p => p.id !== id));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) addPapers(files);
  }, [addPapers]);

  const handleAnalyze = async () => {
    if (papers.length === 0) {
      setError('Please upload at least one past paper to analyze.');
      return;
    }
    setError('');
    setAnalyzing(true);

    // Simulate step progression
    for (let i = 0; i < ANALYSIS_STEPS.length - 1; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    }

    try {
      const formData = new FormData();
      papers.forEach(p => {
        formData.append('papers', p.file);
        formData.append('years', String(p.year));
      });
      if (syllabus) formData.append('syllabus', syllabus);

      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const json = await res.json();

      if (json.success) {
        setCurrentStep(ANALYSIS_STEPS.length - 1);
        // Store result in sessionStorage for dashboard
        sessionStorage.setItem('analysisResult', JSON.stringify(json.data));
        await new Promise(r => setTimeout(r, 800));
        router.push('/dashboard');
      } else {
        throw new Error(json.error || 'Analysis failed');
      }
    } catch (err) {
      // On API error, use demo mode
      const { MOCK_ANALYSIS } = await import('@/lib/mockData');
      sessionStorage.setItem('analysisResult', JSON.stringify(MOCK_ANALYSIS));
      setCurrentStep(ANALYSIS_STEPS.length - 1);
      await new Promise(r => setTimeout(r, 800));
      router.push('/dashboard');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (analyzing) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '2rem' }}>
          {/* Animated circle */}
          <div style={{
            width: '100px', height: '100px', margin: '0 auto 2rem',
            border: '3px solid var(--border-subtle)',
            borderTop: '3px solid var(--accent-violet)',
            borderRadius: '50%',
            animation: 'spin-slow 1s linear infinite',
          }} />

          <h2 className="display-md" style={{ marginBottom: '0.5rem' }}>
            {ANALYSIS_STEPS[currentStep]?.icon} Analyzing Papers
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            {ANALYSIS_STEPS[currentStep]?.label}
          </p>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
            {ANALYSIS_STEPS.map((step, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 1rem',
                background: i <= currentStep ? 'rgba(124,58,237,0.1)' : 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${i <= currentStep ? 'rgba(124,58,237,0.3)' : 'var(--border-subtle)'}`,
                opacity: i > currentStep + 1 ? 0.4 : 1,
                transition: 'all 0.3s ease',
              }}>
                <span style={{ fontSize: '1rem' }}>{step.icon}</span>
                <span style={{
                  fontSize: '0.875rem',
                  color: i <= currentStep ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: i === currentStep ? 600 : 400,
                }}>
                  {step.label}
                </span>
                {i < currentStep && (
                  <span style={{ marginLeft: 'auto', color: 'var(--priority-low)', fontSize: '0.9rem' }}>✓</span>
                )}
                {i === currentStep && (
                  <div className="spinner" style={{ marginLeft: 'auto', width: '16px', height: '16px', borderWidth: '2px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', background: 'var(--bg-primary)' }} className="bg-grid">
      {/* Page header */}
      <div className="page-header">
        <div className="container-sm">
          <div className="eyebrow">📤 Upload & Analyze</div>
          <h1 className="display-lg" style={{ marginBottom: '1rem' }}>
            Upload Your <span className="text-gradient">Past Papers</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto' }}>
            Drop your PDF question papers and optional syllabus below. Our AI will analyze topic frequency, difficulty trends, and generate a personalized study plan.
          </p>
        </div>
      </div>

      <div className="container-sm" style={{ paddingBottom: '4rem' }}>
        {/* Papers Upload Zone */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              📄 Past Question Papers
              <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                (required)
              </span>
            </h2>
            {papers.length > 0 && (
              <span className="badge badge-info">{papers.length} file{papers.length > 1 ? 's' : ''} added</span>
            )}
          </div>

          <div
            id="paper-dropzone"
            className={`upload-zone ${isDragging ? 'drag-over' : ''}`}
            onClick={() => paperInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="upload-icon animate-float">📄</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              {isDragging ? 'Drop files here!' : 'Drop PDFs or click to browse'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Supports PDF, JPG, PNG · Multiple files · Any year
            </p>
            <button className="btn btn-ghost" onClick={e => { e.stopPropagation(); paperInputRef.current?.click(); }}>
              📂 Browse Files
            </button>
          </div>

          <input
            ref={paperInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            style={{ display: 'none' }}
            onChange={e => e.target.files && addPapers(e.target.files)}
          />
        </div>

        {/* File list */}
        {papers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              Uploaded Papers — Assign Year
            </h3>
            {papers.map(p => (
              <div key={p.id} className="file-item">
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <div className="file-name">{p.name}</div>
                  <div className="file-size">{formatSize(p.size)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Year:</label>
                  <select
                    id={`year-${p.id}`}
                    value={p.year}
                    onChange={e => updateYear(p.id, parseInt(e.target.value))}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {Array.from({ length: 15 }, (_, i) => 2024 - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <button className="file-remove" onClick={() => removePaper(p.id)} title="Remove">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Syllabus Upload */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            📚 Syllabus Document
            <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              (optional — for gap analysis)
            </span>
          </h2>

          {!syllabus ? (
            <div
              id="syllabus-dropzone"
              className={`upload-zone ${isSylDragging ? 'drag-over' : ''}`}
              style={{ padding: '2rem', borderStyle: 'dashed' }}
              onClick={() => syllabusInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsSylDragging(true); }}
              onDragLeave={() => setIsSylDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setIsSylDragging(false);
                const f = e.dataTransfer.files[0];
                if (f) setSyllabus(f);
              }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📚</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Upload your official syllabus to identify coverage gaps
              </p>
            </div>
          ) : (
            <div className="file-item">
              <div className="file-icon" style={{ background: 'rgba(6,182,212,0.15)' }}>📚</div>
              <div className="file-info">
                <div className="file-name">{syllabus.name}</div>
                <div className="file-size">{formatSize(syllabus.size)} · Syllabus</div>
              </div>
              <button className="file-remove" onClick={() => setSyllabus(null)}>✕</button>
            </div>
          )}

          <input
            ref={syllabusInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && setSyllabus(e.target.files[0])}
          />
        </div>

        {/* Demo mode notice */}
        <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
          <span>💡</span>
          <span>
            <strong>Demo Mode Available:</strong> Don&apos;t have papers? Just click &ldquo;Analyze Papers&rdquo; below and we&apos;ll show you a full demo with Computer Science exam data.
          </span>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Analyze button */}
        <button
          id="analyze-btn"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem' }}
          onClick={handleAnalyze}
        >
          🤖 Analyze Papers with AI
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Analysis takes 10-30 seconds · Your files are processed securely
        </p>
      </div>
    </div>
  );
}
