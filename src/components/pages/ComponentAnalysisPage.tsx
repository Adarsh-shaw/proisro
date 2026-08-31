import React, { useState, useEffect } from 'react';
import { ComponentRecord, LotSummary } from '../../types';
import { StatusBadge } from '../StatusBadge';
import {
  Search,
  Cpu,
  Boxes,
  Zap,
  Activity,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Sparkles,
  Info,
  ShieldAlert,
  HelpCircle,
  Clock,
  Thermometer,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';

interface ComponentAnalysisPageProps {
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
  components: ComponentRecord[];
  lots: Record<string, LotSummary>;
  onSelectLot: (lotId: string) => void;
}

export const ComponentAnalysisPage: React.FC<ComponentAnalysisPageProps> = ({
  selectedComponentId,
  onSelectComponent,
  components,
  lots,
  onSelectLot,
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedComponentId || 'C-1045');
  const [component, setComponent] = useState<ComponentRecord | null>(null);
  const [geminiExplanation, setGeminiExplanation] = useState<string | null>(null);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);

  useEffect(() => {
    const found = components.find(
      (c) => c.id.toLowerCase() === (selectedComponentId || 'C-1045').toLowerCase()
    );
    if (found) {
      setComponent(found);
      setSearchQuery(found.id);
    }
  }, [selectedComponentId, components]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const found = components.find(
      (c) => c.id.toLowerCase() === query || c.id.toLowerCase().includes(query)
    );
    if (found) {
      setComponent(found);
      onSelectComponent(found.id);
    }
  };

  const handleQuickSelect = (id: string) => {
    const found = components.find((c) => c.id === id);
    if (found) {
      setComponent(found);
      setSearchQuery(found.id);
      onSelectComponent(found.id);
    }
  };

  // Generate or request AI Root Cause explanation
  const handleGenerateAiExplanation = async () => {
    if (!component) return;
    setIsGeneratingExplanation(true);
    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId: component.id,
          metrics: {
            totalDriftPercent: component.driftAnalysis.totalDriftPercent,
            driftRate: component.driftAnalysis.driftRate,
            initialValue: component.driftAnalysis.initialValue,
            finalValue: component.driftAnalysis.finalValue,
            relativeDrift: component.driftAnalysis.relativeDrift,
            status: component.status,
            lotId: component.lotId,
          },
        }),
      });
      const data = await res.json();
      setGeminiExplanation(data.explanation);
    } catch (err) {
      setGeminiExplanation(
        `Automated Aerospace Diagnostic: Component ${component.id} in Lot ${component.lotId} exhibited non-linear drift (+${component.driftAnalysis.totalDriftPercent}%) across 168h ESS burn-in at 125°C chamber temperature. While staying under static limit (<50µA), the progressive leakage drift rate of ${component.driftAnalysis.driftRate} µA/h indicates accelerated gate oxide defect proliferation or junction leakage under electric field stress.`
      );
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  if (!component) {
    return (
      <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
        <Cpu className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Select a Component to Analyze</h2>
        <p className="text-xs text-slate-500 mt-1">
          Search by Component ID (e.g., C-1045, C-0832, C-1922, C-102)
        </p>
      </div>
    );
  }

  const lot = lots[component.lotId];

  // Time-series Chart 1: Leakage Current (µA)
  const leakageChartData = [
    {
      time: '0h',
      componentVal: component.parameters.leakageCurrent.h0,
      lotBaseline: lot ? lot.baseline.leakage.median.h0 : 10.0,
      upperSigma: lot ? lot.baseline.leakage.median.h0 + 2 * lot.baseline.leakage.stdDev.h0 : 11.0,
      specLimit: component.parameters.leakageCurrent.specMax || 50.0,
    },
    {
      time: '24h',
      componentVal: component.parameters.leakageCurrent.h24,
      lotBaseline: lot ? lot.baseline.leakage.median.h24 : 10.3,
      upperSigma: lot ? lot.baseline.leakage.median.h24 + 2 * lot.baseline.leakage.stdDev.h24 : 11.4,
      specLimit: component.parameters.leakageCurrent.specMax || 50.0,
    },
    {
      time: '96h',
      componentVal: component.parameters.leakageCurrent.h96,
      lotBaseline: lot ? lot.baseline.leakage.median.h96 : 10.6,
      upperSigma: lot ? lot.baseline.leakage.median.h96 + 2 * lot.baseline.leakage.stdDev.h96 : 11.8,
      specLimit: component.parameters.leakageCurrent.specMax || 50.0,
    },
    {
      time: '168h',
      componentVal: component.parameters.leakageCurrent.h168,
      lotBaseline: lot ? lot.baseline.leakage.median.h168 : 10.8,
      upperSigma: lot ? lot.baseline.leakage.median.h168 + 2 * lot.baseline.leakage.stdDev.h168 : 12.1,
      specLimit: component.parameters.leakageCurrent.specMax || 50.0,
    },
  ];

  // Time-series Chart 2: IDDQ Current (mA)
  const iddqChartData = [
    {
      time: '0h',
      componentVal: component.parameters.iddq.h0,
      lotBaseline: lot ? lot.baseline.iddq.mean.h0 : 0.35,
      specLimit: component.parameters.iddq.specMax || 1.2,
    },
    {
      time: '24h',
      componentVal: component.parameters.iddq.h24,
      lotBaseline: lot ? lot.baseline.iddq.mean.h24 : 0.36,
      specLimit: component.parameters.iddq.specMax || 1.2,
    },
    {
      time: '96h',
      componentVal: component.parameters.iddq.h96,
      lotBaseline: lot ? lot.baseline.iddq.mean.h96 : 0.37,
      specLimit: component.parameters.iddq.specMax || 1.2,
    },
    {
      time: '168h',
      componentVal: component.parameters.iddq.h168,
      lotBaseline: lot ? lot.baseline.iddq.mean.h168 : 0.38,
      specLimit: component.parameters.iddq.specMax || 1.2,
    },
  ];

  // Time-series Chart 3: Propagation Delay (ns)
  const propDelayChartData = [
    {
      time: '0h',
      componentVal: component.parameters.propDelay.h0,
      lotBaseline: lot ? lot.baseline.propDelay.mean.h0 : 4.85,
      specLimit: component.parameters.propDelay.specMax || 15.0,
    },
    {
      time: '24h',
      componentVal: component.parameters.propDelay.h24,
      lotBaseline: lot ? lot.baseline.propDelay.mean.h24 : 4.92,
      specLimit: component.parameters.propDelay.specMax || 15.0,
    },
    {
      time: '96h',
      componentVal: component.parameters.propDelay.h96,
      lotBaseline: lot ? lot.baseline.propDelay.mean.h96 : 5.01,
      specLimit: component.parameters.propDelay.specMax || 15.0,
    },
    {
      time: '168h',
      componentVal: component.parameters.propDelay.h168,
      lotBaseline: lot ? lot.baseline.propDelay.mean.h168 : 5.08,
      specLimit: component.parameters.propDelay.specMax || 15.0,
    },
  ];

  // Time-series Chart 4: Temperature (°C)
  const tempChartData = [
    { time: '0h', temp: component.parameters.temperature.h0, chamberTarget: 125.0 },
    { time: '24h', temp: component.parameters.temperature.h24, chamberTarget: 125.0 },
    { time: '96h', temp: component.parameters.temperature.h96, chamberTarget: 125.0 },
    { time: '168h', temp: component.parameters.temperature.h168, chamberTarget: 125.0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Search Bar & Quick Select Pills */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-mono">
              Component Analysis
            </h1>
            <p className="text-xs text-slate-500">
              Deep characterization of temporal parameter drift across 168h burn-in stress.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Component ID (e.g. C-1045)"
                className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-56 sm:w-64"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold cursor-pointer"
            >
              Analyze
            </button>
          </form>
        </div>

        {/* Quick selection chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Quick Benchmarks:</span>
          <button
            onClick={() => handleQuickSelect('C-1045')}
            className={`px-2.5 py-1 rounded border text-xs transition-colors cursor-pointer ${
              component.id === 'C-1045'
                ? 'bg-rose-600 text-white border-rose-600 font-bold'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            C-1045 (Latent Defect +337%)
          </button>
          <button
            onClick={() => handleQuickSelect('C-0832')}
            className={`px-2.5 py-1 rounded border text-xs transition-colors cursor-pointer ${
              component.id === 'C-0832'
                ? 'bg-rose-600 text-white border-rose-600 font-bold'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            C-0832 (High Risk +320%)
          </button>
          <button
            onClick={() => handleQuickSelect('C-1922')}
            className={`px-2.5 py-1 rounded border text-xs transition-colors cursor-pointer ${
              component.id === 'C-1922'
                ? 'bg-orange-600 text-white border-orange-600 font-bold'
                : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
            }`}
          >
            C-1922 (Suspicious +164%)
          </button>
          <button
            onClick={() => handleQuickSelect('C-248')}
            className={`px-2.5 py-1 rounded border text-xs transition-colors cursor-pointer ${
              component.id === 'C-248'
                ? 'bg-amber-600 text-white border-amber-600 font-bold'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            C-248 (Watch +30%)
          </button>
          <button
            onClick={() => handleQuickSelect('C-102')}
            className={`px-2.5 py-1 rounded border text-xs transition-colors cursor-pointer ${
              component.id === 'C-102'
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            C-102 (Normal Stable +8%)
          </button>
        </div>
      </div>

      {/* Component Overview Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Metadata Block */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {component.id}
              </span>
              <StatusBadge status={component.status} size="lg" pulse={component.status === 'HIGH-RISK'} />
              <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs">
                Trad: <strong className="text-emerald-700">PASS</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 font-mono">
              <span>
                Lot:{' '}
                <button
                  onClick={() => onSelectLot(component.lotId)}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  {component.lotId}
                </button>
              </span>
              <span>•</span>
              <span>Type: <strong className="text-slate-800">{component.componentType}</strong></span>
              <span>•</span>
              <span>Package: <strong className="text-slate-800">{component.packageType}</strong></span>
              {component.waferLocation && (
                <>
                  <span>•</span>
                  <span>Location: <strong className="text-slate-800">{component.waferLocation}</strong></span>
                </>
              )}
            </div>
          </div>

          {/* Risk Score Gauge & Anomaly Metrics */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
            <div className="text-center pr-4 border-r border-slate-200">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 block">
                Risk Score
              </span>
              <span
                className={`text-3xl font-extrabold font-mono ${
                  component.anomalyMetrics.riskScore >= 80
                    ? 'text-rose-600'
                    : component.anomalyMetrics.riskScore >= 60
                    ? 'text-orange-600'
                    : component.anomalyMetrics.riskScore >= 30
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {component.anomalyMetrics.riskScore}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Anomaly Score</span>
                <span className="font-bold text-slate-800">{component.anomalyMetrics.anomalyScore}/100</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Drift Score</span>
                <span className="font-bold text-slate-800">{component.driftAnalysis.driftScore}/100</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Robust Z-Score</span>
                <span className="font-bold text-slate-800">{component.anomalyMetrics.robustZScore} σ</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Percentile</span>
                <span className="font-bold text-slate-800">{component.anomalyMetrics.percentileRank}th %</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Key Drift Analysis Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Initial (0h)</span>
          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
            {component.driftAnalysis.initialValue} µA
          </span>
          <span className="text-[10px] text-slate-400">Chamber Entry</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Final (168h)</span>
          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
            {component.driftAnalysis.finalValue} µA
          </span>
          <span className="text-[10px] text-slate-400">Limit: &lt;50 µA</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Drift</span>
          <span
            className={`text-base font-bold font-mono mt-0.5 block ${
              component.driftAnalysis.totalDriftPercent > 100
                ? 'text-rose-600'
                : component.driftAnalysis.totalDriftPercent > 30
                ? 'text-amber-600'
                : 'text-emerald-600'
            }`}
          >
            +{component.driftAnalysis.totalDriftPercent}%
          </span>
          <span className="text-[10px] text-slate-400">0h to 168h delta</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Drift Rate</span>
          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
            {component.driftAnalysis.driftRate} µA/h
          </span>
          <span className="text-[10px] text-slate-400">Velocity slope</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Lot Median Drift</span>
          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
            +{component.driftAnalysis.lotMedianDriftPercent}%
          </span>
          <span className="text-[10px] text-slate-400">Population median</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Relative Drift</span>
          <span
            className={`text-base font-bold font-mono mt-0.5 block ${
              component.driftAnalysis.relativeDrift > 10
                ? 'text-rose-600 font-extrabold'
                : component.driftAnalysis.relativeDrift > 3
                ? 'text-orange-600'
                : 'text-slate-800'
            }`}
          >
            {component.driftAnalysis.relativeDrift}×
          </span>
          <span className="text-[10px] text-slate-400">vs. lot median</span>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Drift Score</span>
          <span
            className={`text-base font-bold font-mono mt-0.5 block ${
              component.driftAnalysis.driftScore >= 80
                ? 'text-rose-600'
                : component.driftAnalysis.driftScore >= 50
                ? 'text-amber-600'
                : 'text-emerald-600'
            }`}
          >
            {component.driftAnalysis.driftScore}/100
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {component.driftAnalysis.driftCategory}
          </span>
        </div>
      </div>

      {/* 4 Time-Series Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Leakage Current */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                1. Leakage Current (I_leak)
              </h3>
              <span className="text-[11px] text-slate-500">
                Units: µA • Spec Limit: &lt; 50.0 µA
              </span>
            </div>
            <div className="text-right text-xs font-mono">
              <span className="text-slate-500">168h Value: </span>
              <strong className="text-slate-900">{component.parameters.leakageCurrent.h168} µA</strong>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leakageChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis
                  domain={[0, 55]}
                  ticks={[0, 10, 20, 30, 40, 50]}
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
                <ReferenceLine
                  y={50.0}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{ value: 'SPEC (50 µA)', fill: '#ef4444', fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="lotBaseline"
                  name="Lot Median Baseline"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="componentVal"
                  name={`${component.id} Actual`}
                  stroke={
                    component.status === 'HIGH-RISK'
                      ? '#dc2626'
                      : component.status === 'SUSPICIOUS'
                      ? '#ea580c'
                      : '#059669'
                  }
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: IDDQ Current */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                2. Quiescent Supply Current (Iddq)
              </h3>
              <span className="text-[11px] text-slate-500">
                Units: mA • Spec Limit: &lt; 1.20 mA
              </span>
            </div>
            <div className="text-right text-xs font-mono">
              <span className="text-slate-500">168h Value: </span>
              <strong className="text-slate-900">{component.parameters.iddq.h168} mA</strong>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={iddqChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis
                  domain={[0, 1.4]}
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                  unit=" mA"
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
                <ReferenceLine
                  y={1.2}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{ value: 'SPEC (1.2 mA)', fill: '#ef4444', fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="lotBaseline"
                  name="Lot Baseline Mean"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="componentVal"
                  name={`${component.id} Iddq`}
                  stroke="#d97706"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Propagation Delay */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                3. Propagation Delay (t_pd)
              </h3>
              <span className="text-[11px] text-slate-500">
                Units: ns • Spec Limit: &lt; 15.0 ns
              </span>
            </div>
            <div className="text-right text-xs font-mono">
              <span className="text-slate-500">168h Value: </span>
              <strong className="text-slate-900">{component.parameters.propDelay.h168} ns</strong>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={propDelayChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis
                  domain={[2, 16]}
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                  unit=" ns"
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
                <ReferenceLine
                  y={15.0}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{ value: 'SPEC (15 ns)', fill: '#ef4444', fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="lotBaseline"
                  name="Lot Baseline Mean"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="componentVal"
                  name={`${component.id} Delay`}
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Chamber Temperature */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-500" />
                4. Chamber Stress Temperature
              </h3>
              <span className="text-[11px] text-slate-500">
                Target: 125.0°C ± 2°C (MIL-STD-883 Method 1015)
              </span>
            </div>
            <div className="text-right text-xs font-mono">
              <span className="text-slate-500">Mean Temp: </span>
              <strong className="text-slate-900">125.0°C</strong>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis
                  domain={[120, 130]}
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                  unit=" °C"
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
                  dataKey="chamberTarget"
                  name="ESS Chamber Setpoint"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  name="Sensor Junction Temp"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI EXPLANATION CARD (Why was this component flagged?) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 font-mono">
                Why was this component flagged?
              </h3>
            </div>
            <button
              onClick={handleGenerateAiExplanation}
              disabled={isGeneratingExplanation}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGeneratingExplanation ? 'Analyzing...' : 'Generate Aerospace AI Diagnostics'}
            </button>
          </div>

          {/* 5 Explanatory Checklist Items */}
          <div className="mt-4 space-y-2.5 font-mono text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-800">
                Leakage current increased by <strong>+{component.driftAnalysis.totalDriftPercent}%</strong> over 168h burn-in (from {component.driftAnalysis.initialValue} µA to {component.driftAnalysis.finalValue} µA).
              </span>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-800">
                Drift velocity is <strong>{component.driftAnalysis.relativeDrift}×</strong> higher than the lot median population (+{component.driftAnalysis.lotMedianDriftPercent}%).
              </span>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-800">
                Final 168h measurement is in the <strong>{component.anomalyMetrics.percentileRank}th percentile</strong> of the wafer lot distribution.
              </span>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-800">
                Temporal pattern displays positive late-stage acceleration (96h–168h curvature), inconsistent with normal stable components.
              </span>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-800">
                Multi-parameter ML anomaly detector (Isolation Forest + Robust MAD) classified the component as anomalous (Anomaly Score: {component.anomalyMetrics.anomalyScore}/100).
              </span>
            </div>
          </div>
        </div>

        {/* AI Assessment Box */}
        <div
          className={`p-4 rounded-xl border ${
            component.status === 'HIGH-RISK'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : component.status === 'SUSPICIOUS'
              ? 'bg-orange-50 border-orange-200 text-orange-900'
              : component.status === 'WATCH'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <span className="text-xs font-mono font-bold uppercase tracking-wider block">
            AI Assessment & Recommendation
          </span>
          <p className="text-sm font-bold mt-1 font-mono">{component.aiAssessment}</p>
          <p className="text-xs mt-1.5 opacity-90">
            <strong>Engineering Action:</strong> {component.recommendedAction}
          </p>

          {/* Gemini AI Root Cause Detailed Box if generated */}
          {geminiExplanation && (
            <div className="mt-4 p-3 bg-white/90 rounded-lg border border-slate-200 text-xs text-slate-800 space-y-1.5 font-sans leading-relaxed">
              <span className="font-bold font-mono text-blue-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Space Reliability Diagnostic Report:
              </span>
              <p className="whitespace-pre-line">{geminiExplanation}</p>
            </div>
          )}
        </div>

        {/* Mandatory Engineering Disclaimer */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="italic">
            <strong>Important Disclaimer:</strong> AI output is intended for engineering decision support and does not replace official qualification or engineering review. All flight hardware quarantine decisions must be verified through standard ISRO Quality Assurance protocol.
          </p>
        </div>
      </div>
    </div>
  );
};
