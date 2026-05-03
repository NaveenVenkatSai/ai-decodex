import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'AI DecodeX — Smart Past Paper Analyzer',
  description: 'AI-powered past paper analyzer that maps topic frequency against syllabus, ranks high-yield topics, and generates a smart study planner.',
  keywords: 'past paper analyzer, exam preparation, AI study planner, topic frequency, syllabus mapping',
  authors: [{ name: 'AI DecodeX' }],
  openGraph: {
    title: 'AI DecodeX — Smart Past Paper Analyzer',
    description: 'Analyze past papers, identify high-yield topics, and generate smart study plans with AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
