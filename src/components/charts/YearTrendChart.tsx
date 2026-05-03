'use client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { TopicData } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const COLORS = ['#7c3aed', '#06b6d4', '#ef4444', '#22c55e', '#f97316'];

export default function YearTrendChart({ topics, years }: { topics: TopicData[]; years: number[] }) {
  const data = {
    labels: years.map(String),
    datasets: topics.slice(0, 4).map((t, i) => ({
      label: t.topic.length > 22 ? t.topic.slice(0, 22) + '…' : t.topic,
      data: years.map(y => t.yearWise[y] ?? 0),
      borderColor: COLORS[i],
      backgroundColor: COLORS[i] + '15',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: COLORS[i],
      tension: 0.4,
      fill: false,
    })),
  };

  return (
    <div style={{ height: '320px', position: 'relative' }}>
      <Line data={data} options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12, font: { size: 11 }, padding: 12 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} questions` } },
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', stepSize: 1 } },
        },
      }} />
    </div>
  );
}
