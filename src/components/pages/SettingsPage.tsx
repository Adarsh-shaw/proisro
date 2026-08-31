import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Shield,
  RotateCcw,
  Save,
  CheckCircle2,
  Cpu,
  Thermometer,
  Zap,
  Activity,
  HelpCircle,
} from 'lucide-react';

interface SettingsPageProps {
  onRefreshData?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onRefreshData }) => {
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [watchThreshold, setWatchThreshold] = useState(30);
  const [suspiciousThreshold, setSuspiciousThreshold] = useState(50);
  const [highRiskThreshold, setHighRiskThreshold] = useState(100);
  const [leakageUsl, setLeakageUsl] = useState(50.0);
  const [iddqUsl, setIddqUsl] = useState(1.2);
  const [delayUsl, setDelayUsl] = useState(15.0);
  const [chamberTemp, setChamberTemp] = useState(125.0);
  const [chamberHours, setChamberHours] = useState(168);
  const [madSensitivity, setMadSensitivity] = useState(3.0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold uppercase">
            <Settings className="w-4 h-4" />
            <span>Screening Parameters & Model Hyperparameters</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            System & Screening Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure qualification thresholds, MIL-STD stress envelopes, and anomaly detection sensitivities.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configuration Updated</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Anomaly Drift Thresholds */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold font-mono text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            1. Temporal Drift Classification Thresholds
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Watch */}
            <div className="space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <label className="font-bold text-amber-700 flex items-center justify-between">
                <span>WATCH Threshold</span>
                <span className="text-sm font-extrabold">+{watchThreshold}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={watchThreshold}
                onChange={(e) => setWatchThreshold(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-[11px] text-slate-500">
                Components exceeding this total drift over 168h trigger telemetry watch flags.
              </p>
            </div>

            {/* Suspicious */}
            <div className="space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <label className="font-bold text-orange-700 flex items-center justify-between">
                <span>SUSPICIOUS Threshold</span>
                <span className="text-sm font-extrabold">+{suspiciousThreshold}%</span>
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={suspiciousThreshold}
                onChange={(e) => setSuspiciousThreshold(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <p className="text-[11px] text-slate-500">
                Components routed for secondary ESS thermal cycling inspection.
              </p>
            </div>

            {/* High-Risk */}
            <div className="space-y-2 p-4 rounded-lg bg-slate-50 border border-rose-200">
              <label className="font-bold text-rose-700 flex items-center justify-between">
                <span>HIGH-RISK Latent Threshold</span>
                <span className="text-sm font-extrabold">+{highRiskThreshold}%</span>
              </label>
              <input
                type="range"
                min="60"
                max="200"
                value={highRiskThreshold}
                onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
              <p className="text-[11px] text-slate-500">
                Critical latent defects flagged for automatic flight quarantine.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Specification Limits (USL) & Chamber Config */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold font-mono text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Activity className="w-4 h-4 text-emerald-600" />
            2. Traditional Screening Limits (USL) & Environmental Stress
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div>
              <label className="text-slate-600 font-bold block mb-1">Leakage Current USL (µA)</label>
              <input
                type="number"
                step="0.1"
                value={leakageUsl}
                onChange={(e) => setLeakageUsl(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">Spec Max: 50.0 µA</span>
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">IDDQ Current USL (mA)</label>
              <input
                type="number"
                step="0.05"
                value={iddqUsl}
                onChange={(e) => setIddqUsl(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">Spec Max: 1.20 mA</span>
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">Propagation Delay USL (ns)</label>
              <input
                type="number"
                step="0.5"
                value={delayUsl}
                onChange={(e) => setDelayUsl(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">Spec Max: 15.0 ns</span>
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">Chamber Stress Temp (°C)</label>
              <input
                type="number"
                step="1"
                value={chamberTemp}
                onChange={(e) => setChamberTemp(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400">Target: 125.0 °C</span>
            </div>
          </div>
        </div>

        {/* Section 3: Save Actions */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setWatchThreshold(30);
              setSuspiciousThreshold(50);
              setHighRiskThreshold(100);
              setLeakageUsl(50.0);
              setIddqUsl(1.2);
              setDelayUsl(15.0);
              setChamberTemp(125.0);
            }}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
          >
            Reset to ISRO Standards
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
