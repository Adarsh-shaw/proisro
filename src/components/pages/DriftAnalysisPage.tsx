import React, { useState } from 'react';
import { ComponentRecord, LotSummary } from '../../types';
import {
  TrendingUp,
  Activity,
  Zap,
  Layers,
  Sparkles,
  Info,
  Flame,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  ReferenceLine,
} from 'recharts';

interface DriftAnalysisPageProps {
  components: ComponentRecord[];
  lots: Record<string, LotSummary>;
  onInspectComponent: (id: string) => void;
}

export const DriftAnalysisPage: React.FC<DriftAnalysisPageProps> = ({
  components,
  lots,
  onInspectComponent,
}) => {
  const [selectedParameter, setSelectedParameter] = useState<'leakage' | 'iddq' | 'delay'>('leakage');

  // Trajectory classification breakdown
  const trajectoryDistribution = [
    { category: 'Stable Flat (<15%)', count: 8740, percentage: 83.4, color: '#10b981', desc: 'Baseline thermal equilibrium' },
    { category: 'Linear Nominal (15%-30%)', count: 872, percentage: 8.3, color: '#059669', desc: 'Standard package stress' },
    { category: 'Moderate Drift (30%-100%)', count: 542, percentage: 5.2, color: '#f59e0b', desc: 'Early dielectric relaxation' },
    { category: 'High Non-Linear (100%-250%)', count: 247, percentage: 2.3, color: '#f97316', desc: 'Junction leakage progression' },
    { category: 'Accelerating Latent (>250%)', count: 81, percentage: 0.8, color: '#ef4444', desc: 'Critical gate-oxide breakdown' },
  ];

  const safeComponents = Array.isArray(components) ? components : [];

  // Scatter plot data: Initial Value (0h) vs Total Drift %
  // Sample 250 components for smooth high-performance rendering
  const scatterNormalData = safeComponents
    .filter((c) => c.status === 'NORMAL')
    .slice(0, 160)
    .map((c) => ({
      x: c.parameters.leakageCurrent.h0,
      y: c.driftAnalysis.totalDriftPercent,
      id: c.id,
      lot: c.lotId,
      status: c.status,
    }));

  const scatterWatchData = components
    .filter((c) => c.status === 'WATCH')
    .slice(0, 30)
    .map((c) => ({
      x: c.parameters.leakageCurrent.h0,
      y: c.driftAnalysis.totalDriftPercent,
      id: c.id,
      lot: c.lotId,
      status: c.status,
    }));

  const scatterSuspiciousData = components
    .filter((c) => c.status === 'SUSPICIOUS')
    .slice(0, 25)
    .map((c) => ({
      x: c.parameters.leakageCurrent.h0,
      y: c.driftAnalysis.totalDriftPercent,
      id: c.id,
      lot: c.lotId,
      status: c.status,
    }));

  const scatterHighRiskData = components
    .filter((c) => c.status === 'HIGH-RISK')
    .map((c) => ({
      x: c.parameters.leakageCurrent.h0,
      y: c.driftAnalysis.totalDriftPercent,
      id: c.id,
      lot: c.lotId,
      status: c.status,
    }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold uppercase">
          <TrendingUp className="w-4 h-4" />
          <span>Physics-of-Failure Temporal Dynamics</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
          Drift Intelligence
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Quantifying non-linear trajectory velocity, late-stage burn-in acceleration, and population deviations.
        </p>
      </div>

      {/* 4 Theoretical & Mathematical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>1. Drift Velocity (µA/h)</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Measures the instantaneous derivative of parameter drift:
            <code className="block bg-slate-100 p-1.5 rounded mt-1 text-slate-800 font-bold">
              v(t) = (I_168h - I_0h) / 168.0
            </code>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>2. Trajectory Curvature</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Differentiates linear thermal relaxation from exponential latent degradation:
            <code className="block bg-slate-100 p-1.5 rounded mt-1 text-slate-800 font-bold">
              a(t) = (I_168 - I_96) - (I_96 - I_24)
            </code>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>3. Relative Multiplier</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Normalizes individual unit drift against the robust lot median:
            <code className="block bg-slate-100 p-1.5 rounded mt-1 text-slate-800 font-bold">
              R_drift = ΔI_unit / Median(ΔI_lot)
            </code>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>4. Screening Criteria</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Dual-threshold gate:
            <span className="block mt-1 font-bold text-amber-700">&gt;30% Drift: Watch</span>
            <span className="block font-bold text-rose-600">&gt;100% Drift: High-Risk Latent</span>
          </p>
        </div>
      </div>

      {/* Main Scatter Plot: Initial Value vs Total Drift % */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Component Drift Vector Space (Initial 0h vs Total 168h Drift %)
            </h3>
            <p className="text-xs text-slate-500">
              Visual proof of latent defect isolation: Notice high-drift components starting at identical normal 0h values (~10µA).
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number"
                dataKey="x"
                name="Initial Leakage (0h)"
                unit=" µA"
                domain={[8, 14]}
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                label={{
                  value: 'Initial Leakage at 0h (µA)',
                  position: 'insideBottom',
                  offset: -10,
                  fontSize: 11,
                  fontFamily: 'monospace',
                  fill: '#64748b',
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Total Drift"
                unit="%"
                domain={[0, 400]}
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                label={{
                  value: 'Total Drift (%) over 168h',
                  angle: -90,
                  position: 'insideLeft',
                  fontSize: 11,
                  fontFamily: 'monospace',
                  fill: '#64748b',
                }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700 text-xs font-mono shadow-lg">
                        <p className="font-bold text-blue-400">{data.id}</p>
                        <p className="text-slate-300">Lot: {data.lot}</p>
                        <p className="text-slate-300">Initial 0h: {data.x} µA</p>
                        <p className="font-bold text-rose-400">Total Drift: +{data.y}%</p>
                        <p className="text-xs uppercase mt-1">Status: {data.status}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />

              <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'WATCH THRESHOLD (+30%)', fill: '#f59e0b', fontSize: 10 }} />
              <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'CRITICAL LATENT DEFECT (+100%)', fill: '#ef4444', fontSize: 10 }} />

              <Scatter name="Normal Stable (91.7%)" data={scatterNormalData} fill="#10b981" />
              <Scatter name="Watch (5.2%)" data={scatterWatchData} fill="#f59e0b" />
              <Scatter name="Suspicious (2.3%)" data={scatterSuspiciousData} fill="#f97316" />
              <Scatter name="High-Risk Latents (0.8%)" data={scatterHighRiskData} fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trajectory Classification Distribution */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 font-mono mb-4">
          Population Trajectory Archetypes across 10,482 Components
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          {trajectoryDistribution.map((item) => (
            <div key={item.category} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="font-bold text-slate-900 text-xs">{item.category}</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900 block">
                {item.count.toLocaleString()}{' '}
                <span className="text-xs text-slate-500 font-normal">({item.percentage}%)</span>
              </span>
              <p className="text-[11px] text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
