import React, { useState } from 'react';
import { ComponentRecord, GlobalDashboardStats, LotSummary, PageId } from '../../types';
import { MetricCard } from '../MetricCard';
import { StatusBadge } from '../StatusBadge';
import { StaticVsAiComparison } from '../StaticVsAiComparison';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface DashboardPageProps {
  stats: GlobalDashboardStats;
  lots: Record<string, LotSummary>;
  criticalComponent: ComponentRecord;
  onNavigate: (page: PageId) => void;
  onInspectComponent: (id: string) => void;
  onSelectLot: (lotId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  lots,
  criticalComponent,
  onNavigate,
  onInspectComponent,
  onSelectLot,
}) => {
  const [selectedParameter, setSelectedParameter] = useState<'leakage' | 'iddq' | 'delay'>('leakage');

  // Burn-In Trend Multi-Line Chart Data
  const trendData = [
    {
      time: '0h',
      lotAverage: 10.0,
      c102: 10.0,
      c248: 10.4,
      c891: 10.1,
      c1045: 10.2,
      specLimit: 50.0,
    },
    {
      time: '24h',
      lotAverage: 10.3,
      c102: 10.3,
      c248: 11.2,
      c891: 12.8,
      c1045: 17.4,
      specLimit: 50.0,
    },
    {
      time: '96h',
      lotAverage: 10.6,
      c102: 10.5,
      c248: 12.4,
      c891: 17.5,
      c1045: 29.8,
      specLimit: 50.0,
    },
    {
      time: '168h',
      lotAverage: 10.8,
      c102: 10.8,
      c248: 13.6,
      c891: 24.2,
      c1045: 44.6,
      specLimit: 50.0,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Burn-In Screening Intelligence
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Problem Statement 26170: AI-Driven Anomaly Detection in Component Stress Screening
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('upload-data')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Launch New Analysis
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Export PDF / Audit
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Components */}
        <MetricCard
          title="Total Components"
          value={stats.totalComponents || 10482}
          subtitle="Processed 2026-A17"
          statusColor="slate"
          onClick={() => onNavigate('component-analysis')}
        />

        {/* Normal */}
        <MetricCard
          title="Normal"
          value={stats.normalCount || 9612}
          subtitle={`${(((stats.normalCount || 9612) / (stats.totalComponents || 10482)) * 100).toFixed(1)}% Population`}
          statusColor="emerald"
          onClick={() => onNavigate('anomaly-detection')}
        />

        {/* Watch */}
        <MetricCard
          title="Watch"
          value={stats.watchCount || 542}
          subtitle="Minor Variance"
          statusColor="amber"
          onClick={() => onNavigate('anomaly-detection')}
        />

        {/* Suspicious */}
        <MetricCard
          title="Suspicious"
          value={stats.suspiciousCount || 247}
          subtitle="Deviated Slope"
          statusColor="orange"
          onClick={() => onNavigate('anomaly-detection')}
        />

        {/* High-Risk */}
        <MetricCard
          title="High-Risk"
          value={stats.highRiskCount || 81}
          subtitle="Latent Defect Flag"
          statusColor="rose"
          highlight={true}
          onClick={() => onNavigate('anomaly-detection')}
        />

        {/* Lots Analyzed */}
        <MetricCard
          title="Lots Analyzed"
          value={stats.lotsAnalyzed || 36}
          subtitle="Batch Intelligence"
          statusColor="slate"
          onClick={() => onNavigate('lot-analysis')}
        />
      </div>

      {/* Main 12-Col Split: Parameter Drift (8 cols) & Latent Defect Dark Card (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Parameter Drift Across Burn-In Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Parameter Drift Across Burn-In</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Leakage Current (µA) monitoring for Lot LOT-2026-A17 (0h → 24h → 96h → 168h)
                </p>
              </div>

              {/* Legends matching sleek design */}
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase">
                <div className="flex items-center gap-1 text-slate-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <span>Lot Avg</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span>C-1045</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                  <span>C-0891</span>
                </div>
              </div>
            </div>

            {/* Interactive Parameter Toggle */}
            <div className="flex items-center gap-1.5 mb-3">
              <button
                onClick={() => setSelectedParameter('leakage')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  selectedParameter === 'leakage'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Leakage Current (µA)
              </button>
              <button
                onClick={() => setSelectedParameter('iddq')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  selectedParameter === 'iddq'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                IDDQ Current (mA)
              </button>
              <button
                onClick={() => setSelectedParameter('delay')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  selectedParameter === 'delay'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Prop Delay (ns)
              </button>
            </div>

            {/* Line Chart */}
            <div className="h-64 w-full relative pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 55]}
                    ticks={[0, 10, 20, 30, 40, 50]}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    unit=" µA"
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <ReferenceLine
                    y={50.0}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{
                      value: 'SPEC LIMIT (50 µA)',
                      fill: '#ef4444',
                      position: 'insideTopRight',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  />
                  {/* Lot Average Baseline */}
                  <Line
                    type="monotone"
                    dataKey="lotAverage"
                    name="Lot Baseline"
                    stroke="#e2e8f0"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#94a3b8' }}
                  />
                  {/* Normal Sample */}
                  <Line
                    type="monotone"
                    dataKey="c102"
                    name="C-102 (Nominal)"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    dot={{ r: 2.5, fill: '#94a3b8' }}
                  />
                  {/* Suspicious Sample */}
                  <Line
                    type="monotone"
                    dataKey="c891"
                    name="C-0891 (Deviated)"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#64748b' }}
                  />
                  {/* C-1045 Anomaly */}
                  <Line
                    type="monotone"
                    dataKey="c1045"
                    name="C-1045 (High-Risk Anomaly)"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    strokeDasharray="4 2"
                    dot={{ r: 4, fill: '#3b82f6' }}
                    activeDot={{ r: 6, fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <span>Stress Profile: 125°C Dynamic Burn-In, 5.5V Core VDD</span>
            <span className="font-semibold text-blue-600">
              C-1045 exhibits non-linear temporal acceleration (+337.2%)
            </span>
          </div>
        </div>

        {/* Right: Latent Defect Alert Dark Card (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 rounded-xl shadow-lg p-6 text-white flex flex-col relative overflow-hidden justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <div className="w-32 h-32 border-4 border-white rounded-full"></div>
          </div>

          <div>
            <div className="bg-red-600 inline-block px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-4">
              Latent Defect Alert
            </div>

            <h2 className="text-xl font-bold mb-0.5 text-white">Component C-1045</h2>
            <p className="text-slate-400 text-xs mb-6">Lot: LOT-2026-A17 | Logic IC Tier-1</p>

            <div className="space-y-3.5 mb-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">Static Screening</span>
                <span className="text-xs font-bold text-green-400">PASS (&lt; 50µA)</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">AI Assessment</span>
                <span className="text-xs font-bold text-red-500 uppercase tracking-wide">
                  High-Risk Anomaly
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">Total Drift Rate</span>
                <span className="text-sm font-mono text-white font-bold">+337.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Confidence Score</span>
                <span className="text-sm font-bold text-white">91/100</span>
              </div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50 text-[11px] leading-relaxed text-slate-300 italic mb-6">
              &ldquo;Component remains within conventional specification limits but exhibits abnormal temporal
              drift. Probable latent oxide defect detected through slope analysis.&rdquo;
            </div>
          </div>

          <button
            onClick={() => onInspectComponent('C-1045')}
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold text-sm text-white shadow-xs transition-colors cursor-pointer"
          >
            View Deep Analysis
          </button>
        </div>
      </div>

      {/* Bottom Row: Risk Distribution Gauge & Anomaly Ranking Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Circular Gauge (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">
            Risk Distribution
          </div>

          <div className="flex items-center gap-5 my-auto">
            {/* SVG Circular Progress Gauge */}
            <div className="w-20 h-20 relative shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3.5"
                />
                {/* 91.7% Green Circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3.5"
                  strokeDasharray="91.7, 100"
                  strokeLinecap="round"
                />
                {/* High Risk Red Accent */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeDasharray="0.8, 100"
                  strokeDashoffset="-91.7"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800">
                91%
              </div>
            </div>

            {/* Counts Breakdown */}
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Healthy</span>
                <span className="font-bold text-slate-700">9,612</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Watch</span>
                <span className="font-bold text-slate-700">542</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Suspicious</span>
                <span className="font-bold text-slate-700">247</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">High Risk</span>
                <span className="font-bold text-red-500">81</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Overall Fleet: 10,482 units</span>
            <button
              onClick={() => onNavigate('lot-analysis')}
              className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Lot Matrix &rarr;
            </button>
          </div>
        </div>

        {/* Anomaly Ranking Queue Table (2 cols) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Anomaly Ranking Queue
              </div>
              <button
                onClick={() => onNavigate('anomaly-detection')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                View All &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] text-slate-400 border-b border-slate-100 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="pb-2 font-medium">COMPONENT ID</th>
                    <th className="pb-2 font-medium">LOT ID</th>
                    <th className="pb-2 font-medium text-right">ANOMALY SCORE</th>
                    <th className="pb-2 font-medium text-right">DRIFT %</th>
                    <th className="pb-2 font-medium text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-50">
                  <tr
                    onClick={() => onInspectComponent('C-1045')}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors border-b border-slate-50"
                  >
                    <td className="py-2.5 font-bold text-slate-900">C-1045</td>
                    <td className="py-2.5 text-slate-600">LOT-A17</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900">94.2</td>
                    <td className="py-2.5 text-right font-mono font-bold text-red-500">+337.2%</td>
                    <td className="py-2.5 text-right">
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">
                        HIGH-RISK
                      </span>
                    </td>
                  </tr>
                  <tr
                    onClick={() => onInspectComponent('C-0832')}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors border-b border-slate-50"
                  >
                    <td className="py-2.5 font-bold text-slate-700">C-0832</td>
                    <td className="py-2.5 text-slate-600">LOT-A17</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900">89.1</td>
                    <td className="py-2.5 text-right font-mono font-bold text-orange-500">+142.5%</td>
                    <td className="py-2.5 text-right">
                      <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">
                        SUSPICIOUS
                      </span>
                    </td>
                  </tr>
                  <tr
                    onClick={() => onInspectComponent('C-1922')}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors border-b border-slate-50"
                  >
                    <td className="py-2.5 font-bold text-slate-700">C-1922</td>
                    <td className="py-2.5 text-slate-600">LOT-B04</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900">81.4</td>
                    <td className="py-2.5 text-right font-mono font-bold text-yellow-600">+88.2%</td>
                    <td className="py-2.5 text-right">
                      <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">
                        WATCH
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Static vs AI Interactive Screening Comparison Deep Drilldown */}
      <StaticVsAiComparison onInspectComponent={onInspectComponent} />
    </div>
  );
};
