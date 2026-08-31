import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { ShieldCheck, ShieldAlert, ArrowRight, Activity, HelpCircle, Zap } from 'lucide-react';
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

interface StaticVsAiComparisonProps {
  onInspectComponent?: (componentId: string) => void;
}

export const StaticVsAiComparison: React.FC<StaticVsAiComparisonProps> = ({
  onInspectComponent,
}) => {
  const [selectedDemo, setSelectedDemo] = useState<'latent' | 'normal'>('latent');

  const chartData = [
    {
      time: '0h',
      specLimit: 50.0,
      lotBaseline: 10.0,
      normalComp: 10.0,
      latentComp: 10.2,
    },
    {
      time: '24h',
      specLimit: 50.0,
      lotBaseline: 10.3,
      normalComp: 10.3,
      latentComp: 17.4,
    },
    {
      time: '96h',
      specLimit: 50.0,
      lotBaseline: 10.6,
      normalComp: 10.5,
      latentComp: 29.8,
    },
    {
      time: '168h',
      specLimit: 50.0,
      lotBaseline: 10.8,
      normalComp: 10.8,
      latentComp: 44.6,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded">
              ISRO ESS VALIDATION DEMO
            </span>
            <span className="text-xs text-slate-300">Spec: Leakage Current &lt; 50.0 µA</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1">
            Static Screening vs. AI Dynamic Drift Intelligence
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Traditional testing only checks if 168h value is &lt; 50 µA. Our AI checks the temporal trajectory slope and lot baseline.
          </p>
        </div>

        {/* Demo Selector Buttons */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setSelectedDemo('latent')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedDemo === 'latent'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Latent Defect (C-1045)
          </button>
          <button
            onClick={() => setSelectedDemo('normal')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedDemo === 'normal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Normal Component (C-102)
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Trajectory & Decision Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left 7 Cols: Interactive Trajectory Chart */}
        <div className="lg:col-span-7 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                168-Hour Burn-In Trajectory Analysis
              </h3>
              <p className="text-xs text-slate-500">Chamber Temperature 125°C • Bias Voltage Applied</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-slate-400"></span>
                <span className="text-slate-600">Lot Baseline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-rose-500 stroke-dashed"></span>
                <span className="text-rose-600 font-semibold">Static Limit (50µA)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-3 h-1 rounded ${
                    selectedDemo === 'latent' ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}
                ></span>
                <span className="font-semibold text-slate-900">
                  {selectedDemo === 'latent' ? 'C-1045' : 'C-102'}
                </span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis
                  domain={[0, 55]}
                  ticks={[0, 10, 20, 30, 40, 50]}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  unit=" µA"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <ReferenceLine
                  y={50.0}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: 'MAX SPEC (50 µA)',
                    fill: '#ef4444',
                    position: 'insideTopRight',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="lotBaseline"
                  name="Lot Baseline Average"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 3 }}
                />
                {selectedDemo === 'latent' ? (
                  <Line
                    type="monotone"
                    dataKey="latentComp"
                    name="Latent Component (C-1045)"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#dc2626' }}
                    activeDot={{ r: 7 }}
                  />
                ) : (
                  <Line
                    type="monotone"
                    dataKey="normalComp"
                    name="Normal Component (C-102)"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#059669' }}
                    activeDot={{ r: 7 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Temporal reading timeline pills */}
          <div className="mt-3 grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 font-mono text-center text-xs">
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">0h (Initial)</span>
              <span className="font-bold text-slate-800">
                {selectedDemo === 'latent' ? '10.2 µA' : '10.0 µA'}
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">24h (Early ESS)</span>
              <span className="font-bold text-slate-800">
                {selectedDemo === 'latent' ? '17.4 µA' : '10.3 µA'}
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">96h (Mid ESS)</span>
              <span className="font-bold text-slate-800">
                {selectedDemo === 'latent' ? '29.8 µA' : '10.5 µA'}
              </span>
            </div>
            <div
              className={`p-2 rounded border ${
                selectedDemo === 'latent'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <span className="opacity-70 block text-[10px]">168h (Final)</span>
              <span className="font-bold">
                {selectedDemo === 'latent' ? '44.6 µA' : '10.8 µA'}
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Direct Dual Screening Comparison */}
        <div className="lg:col-span-5 p-5 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Screening Decision Comparison
            </span>

            {/* Comparison Cards */}
            <div className="mt-3 space-y-3">
              {/* Traditional Box */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                      Traditional Static Screening
                    </span>
                  </div>
                  <StatusBadge status="PASS" size="sm" />
                </div>
                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <p>
                    <strong className="text-slate-800">Logic:</strong> Only validates if Final Value (44.6 µA) &lt; 50.0 µA specification limit.
                  </p>
                  <p className="text-rose-600 font-medium">
                    ⚠️ Fatal Oversight: Blind to severe +337% internal parameter degradation.
                  </p>
                </div>
              </div>

              {/* AI Dynamic Box */}
              <div
                className={`p-3.5 rounded-lg border shadow-2xs ${
                  selectedDemo === 'latent'
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap
                      className={`w-3.5 h-3.5 ${
                        selectedDemo === 'latent' ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      AI Dynamic Screening
                    </span>
                  </div>
                  <StatusBadge
                    status={selectedDemo === 'latent' ? 'HIGH-RISK' : 'NORMAL'}
                    size="sm"
                    pulse={selectedDemo === 'latent'}
                  />
                </div>
                <div className="mt-2 text-xs text-slate-700 space-y-1">
                  <p>
                    <strong className="text-slate-900">AI Finding:</strong>{' '}
                    {selectedDemo === 'latent'
                      ? 'Drift rate is 27.9× lot baseline (+337% vs +12%). Positive acceleration indicates gate oxide breakdown.'
                      : 'Drift is nominal (+8.0%), consistent with lot population baseline (+12.1%).'}
                  </p>
                  <div className="flex items-center gap-3 font-mono text-[11px] mt-1 pt-1 border-t border-slate-200/60">
                    <span>
                      Risk Score: <strong>{selectedDemo === 'latent' ? '91/100' : '4/100'}</strong>
                    </span>
                    <span>
                      Drift Rate:{' '}
                      <strong>{selectedDemo === 'latent' ? '0.205 µA/h' : '0.005 µA/h'}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {selectedDemo === 'latent'
                ? 'Target: High-Reliability Logic IC (C-1045)'
                : 'Target: Nominal Qualified Component (C-102)'}
            </span>
            {onInspectComponent && (
              <button
                onClick={() =>
                  onInspectComponent(selectedDemo === 'latent' ? 'C-1045' : 'C-102')
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 font-mono"
              >
                Deep Analysis <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
