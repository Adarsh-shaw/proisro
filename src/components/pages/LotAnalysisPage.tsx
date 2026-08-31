import React, { useState } from 'react';
import { ComponentRecord, LotSummary } from '../../types';
import { StatusBadge } from '../StatusBadge';
import {
  Boxes,
  Cpu,
  BarChart3,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertOctagon,
  Calendar,
  Building2,
  SlidersHorizontal,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';

interface LotAnalysisPageProps {
  selectedLotId: string;
  onSelectLot: (lotId: string) => void;
  lots: Record<string, LotSummary>;
  components: ComponentRecord[];
  onInspectComponent: (id: string) => void;
}

export const LotAnalysisPage: React.FC<LotAnalysisPageProps> = ({
  selectedLotId,
  onSelectLot,
  lots,
  components,
  onInspectComponent,
}) => {
  const lotList = Object.values(lots) as LotSummary[];
  const activeLotId = selectedLotId || 'LOT-2026-A17';
  const lot = lots[activeLotId] || lotList[0];

  const safeComponents = Array.isArray(components) ? components : [];
  const lotComponents = safeComponents.filter((c) => c.lotId === activeLotId);

  // Distribution Chart Data (Histogram of drift % in this lot)
  const driftDistributionData = [
    { range: '0% - 10%', count: Math.round(lot.totalComponents * 0.72), category: 'Normal Stable', color: '#10b981' },
    { range: '10% - 25%', count: Math.round(lot.totalComponents * 0.18), category: 'Normal Nominal', color: '#10b981' },
    { range: '25% - 50%', count: lot.watchCount, category: 'Watch Drift', color: '#f59e0b' },
    { range: '50% - 150%', count: lot.suspiciousCount, category: 'Suspicious Drift', color: '#f97316' },
    { range: '> 150%', count: lot.highRiskCount, category: 'High-Risk Outliers', color: '#ef4444' },
  ];

  // Box-plot / Quantile Trend Chart Data (0h, 24h, 96h, 168h)
  const quantileTrendData = [
    {
      time: '0h',
      p10: 9.6,
      median: lot.baseline.leakage.median.h0,
      mean: lot.baseline.leakage.mean.h0,
      p90: lot.baseline.leakage.p90.h0,
      p98: 10.8,
      highRiskSample: 10.2,
    },
    {
      time: '24h',
      p10: 9.9,
      median: lot.baseline.leakage.median.h24,
      mean: lot.baseline.leakage.mean.h24,
      p90: lot.baseline.leakage.p90.h24,
      p98: 11.4,
      highRiskSample: 17.4,
    },
    {
      time: '96h',
      p10: 10.2,
      median: lot.baseline.leakage.median.h96,
      mean: lot.baseline.leakage.mean.h96,
      p90: lot.baseline.leakage.p90.h96,
      p98: 12.0,
      highRiskSample: 29.8,
    },
    {
      time: '168h',
      p10: 10.4,
      median: lot.baseline.leakage.median.h168,
      mean: lot.baseline.leakage.mean.h168,
      p90: lot.baseline.leakage.p90.h168,
      p98: 12.8,
      highRiskSample: 44.6,
    },
  ];

  // Top ranked anomalous components in this lot
  const topAnomalies = [...lotComponents]
    .sort((a, b) => b.anomalyMetrics.anomalyScore - a.anomalyMetrics.anomalyScore)
    .slice(0, 10);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Lot Selector */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold uppercase">
            <Boxes className="w-4 h-4" />
            <span>Wafer Lot Statistical Characterization</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Lot Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical population envelopes and outlier distribution across 168h ESS burn-in.
          </p>
        </div>

        {/* Lot Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono font-bold text-slate-500 uppercase">Select Lot:</label>
          <select
            value={activeLotId}
            onChange={(e) => onSelectLot(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            {lotList.map((l) => (
              <option key={l.lotId} value={l.lotId}>
                {l.lotId} ({l.totalComponents} units • {l.partNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lot Metadata & 5 Key Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Total Components</span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 mt-1 block">
            {lot.totalComponents.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">100% Ingested</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Normal</span>
          <span className="text-2xl font-extrabold font-mono text-emerald-600 mt-1 block">
            {lot.normalCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 font-mono">{lot.healthyPercentage}% of Lot</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Watch</span>
          <span className="text-2xl font-extrabold font-mono text-amber-600 mt-1 block">
            {lot.watchCount}
          </span>
          <span className="text-[11px] text-amber-600 font-mono">{lot.watchPercentage}% of Lot</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Suspicious</span>
          <span className="text-2xl font-extrabold font-mono text-orange-600 mt-1 block">
            {lot.suspiciousCount}
          </span>
          <span className="text-[11px] text-orange-600 font-mono">{lot.suspiciousPercentage}% of Lot</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-2xs ring-2 ring-rose-500/10">
          <span className="text-xs font-mono text-slate-500 uppercase block">High Risk</span>
          <span className="text-2xl font-extrabold font-mono text-rose-600 mt-1 block">
            {lot.highRiskCount}
          </span>
          <span className="text-[11px] text-rose-600 font-mono font-bold">
            {lot.highRiskPercentage}% Latent Defects
          </span>
        </div>
      </div>

      {/* Lot Metadata Details Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Part:</span>
          <strong className="text-blue-400">{lot.partNumber}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Wafer Batch:</span>
          <strong className="text-white">{lot.waferBatch}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Screening Interval:</span>
          <strong className="text-white">{lot.screeningStartDate} → {lot.screeningEndDate}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Facility:</span>
          <strong className="text-slate-200">{lot.facility}</strong>
        </div>
      </div>

      {/* Two Main Charts: Drift Distribution & Quantile Envelope */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drift Distribution Histogram */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Parameter Drift Distribution Histogram
              </h3>
              <p className="text-xs text-slate-500">Component frequency categorized by 168h total drift</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driftDistributionData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="count" name="Component Count" radius={[4, 4, 0, 0]}>
                  {driftDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Lot Baseline Median Drift: +12.1%</span>
            <span className="text-rose-600 font-bold">{lot.highRiskCount} components &gt;150% drift</span>
          </div>
        </div>

        {/* Quantile / Box-Plot Temporal Envelope */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Statistical Population Percentiles (0h → 168h)
              </h3>
              <p className="text-xs text-slate-500">10th, 50th (Median), 90th percentile bands vs. Outlier C-1045</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quantileTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis
                  domain={[8, 50]}
                  ticks={[10, 20, 30, 40, 50]}
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                  unit=" µA"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line
                  type="monotone"
                  dataKey="p90"
                  name="90th Percentile"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="2 2"
                />
                <Line
                  type="monotone"
                  dataKey="median"
                  name="50th Percentile (Median)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="p10"
                  name="10th Percentile"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
                <Line
                  type="monotone"
                  dataKey="highRiskSample"
                  name="Latent Outlier (C-1045)"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Lot 168h Median: {lot.baseline.leakage.median.h168} µA</span>
            <span className="text-slate-700">MAD: ±{lot.baseline.leakage.mad.h168} µA</span>
          </div>
        </div>
      </div>

      {/* Lot Anomalies Ranking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              Flagged Components in {lot.lotId} (Ranked by Anomaly Score)
            </h3>
            <p className="text-xs text-slate-500">
              Outliers requiring secondary characterization or Destructive Physical Analysis (DPA).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Component ID</th>
                <th className="py-2.5 px-3">0h → 168h Leakage</th>
                <th className="py-2.5 px-3">Total Drift</th>
                <th className="py-2.5 px-3">Relative Drift</th>
                <th className="py-2.5 px-3">Anomaly Score</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">AI Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topAnomalies.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-400">#{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{c.id}</td>
                  <td className="py-3 px-3 text-slate-700">
                    {c.parameters.leakageCurrent.h0} → {c.parameters.leakageCurrent.h168} µA
                  </td>
                  <td className="py-3 px-3 font-bold text-rose-600">
                    +{c.driftAnalysis.totalDriftPercent}%
                  </td>
                  <td className="py-3 px-3 text-slate-800">{c.driftAnalysis.relativeDrift}× median</td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {c.anomalyMetrics.anomalyScore}/100
                  </td>
                  <td className="py-3 px-3 font-bold text-rose-600">
                    {c.anomalyMetrics.riskScore}/100
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={c.status} size="sm" pulse={c.status === 'HIGH-RISK'} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onInspectComponent(c.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
