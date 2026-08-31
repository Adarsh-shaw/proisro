import React from 'react';
import { PageId } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  ArrowRight,
  Cpu,
  Activity,
  Layers,
  Sparkles,
  GitCompare,
  Satellite,
  BarChart3,
  Flame,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { StaticVsAiComparison } from '../StaticVsAiComparison';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
  onInspectComponent: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onInspectComponent,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Banner Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white border-b border-slate-800 py-16 sm:py-20 lg:py-24">
        {/* Subtle engineering grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* ISRO Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-mono mb-6">
              <Satellite className="w-3.5 h-3.5 text-blue-400" />
              <span>ISRO Problem Statement 26170</span>
              <span className="text-blue-500">•</span>
              <span className="text-slate-300">Space-Grade Electronic Screening</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-mono">
              Detect What Static Limits <span className="text-blue-400">Miss.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              AI-powered dynamic anomaly detection for high-reliability electronic component screening across{' '}
              <strong className="text-white font-mono">0h → 24h → 96h → 168h</strong> environmental burn-in.
            </p>

            {/* Feature Highlights Chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono text-slate-300">
              <span className="px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Hidden Latent Anomalies
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Abnormal Parameter Drift
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Latent Defect Patterns
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multi-Parameter Variance
              </span>
            </div>

            {/* Launch CTA Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Launch Engineering Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('upload-data')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Upload Screening Dataset</span>
              </button>
            </div>
          </div>

          {/* Core Architectural Paradigm: Traditional vs AI Screening Workflow Diagram */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-400">
                Paradigm Shift in Space Electronic Reliability
              </h2>
              <p className="text-sm text-slate-300 font-medium mt-1">
                Static Threshold Screening vs. AI Dynamic Temporal Intelligence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traditional Box */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                      TRADITIONAL SCREENING
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      STATIC SPEC
                    </span>
                  </div>

                  <div className="mt-5 space-y-2.5 font-mono text-xs">
                    <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 text-slate-300 flex items-center justify-between">
                      <span>Electronic Component</span>
                      <span className="text-[11px] text-slate-400">Under 168h ESS</span>
                    </div>
                    <div className="text-center text-slate-500 text-xs">↓</div>
                    <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 text-slate-300 flex items-center justify-between">
                      <span>Static Threshold Limit</span>
                      <span className="text-[11px] text-slate-400">e.g. &lt; 50 µA Max</span>
                    </div>
                    <div className="text-center text-slate-500 text-xs">↓</div>
                    <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-center justify-between font-bold">
                      <span>PASS (False Negative Risk)</span>
                      <span className="text-[10px] bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-200">
                        Blind to Drift
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <span className="text-rose-400 font-bold">Failure Mode:</span> Components with latent gate-oxide breakdown that start at 10µA and drift to 44µA are accepted because 44µA &lt; 50µA.
                </div>
              </div>

              {/* AI Dynamic Screening Box */}
              <div className="rounded-xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 p-6 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-blue-950/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs font-mono font-bold text-blue-300 uppercase">
                        AI DYNAMIC SCREENING
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-600 text-white shadow-xs">
                      TEMPORAL ML
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 font-mono text-[11px]">
                    <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                      <span>1. Component Data</span>
                      <span className="text-blue-400">0h → 24h → 96h → 168h</span>
                    </div>
                    <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                      <span>2. Lot Baseline Extraction</span>
                      <span className="text-blue-400">Median, MAD, Robust Sigma</span>
                    </div>
                    <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                      <span>3. Drift & Acceleration Analysis</span>
                      <span className="text-blue-400">Rate, Curvature, Relative Drift</span>
                    </div>
                    <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-between">
                      <span>4. Ensemble ML Outlier Score</span>
                      <span className="text-blue-400">Isolation Forest + Autoencoder</span>
                    </div>
                    <div className="p-2.5 rounded bg-rose-950/60 border border-rose-600/70 text-rose-300 flex items-center justify-between font-bold">
                      <span>5. Risk Assessment: HIGH-RISK</span>
                      <span className="text-[10px] bg-rose-900 px-1.5 py-0.5 rounded text-rose-100">
                        Latent Defect Caught
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-900/60 text-xs text-blue-200 leading-relaxed">
                  <span className="text-emerald-400 font-bold">Aerospace Advantage:</span> Isolates anomalous temporal signatures early during factory screening before satellite integration.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Showcase Demo Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
              Interactive Proof of Concept
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Live ESS Screening Comparison Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Toggle between anomalous and normal components to observe how dynamic drift detection catches latent defects.
            </p>
          </div>
          <button
            onClick={() => onNavigate('component-analysis')}
            className="text-xs font-mono font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Explore Component Analyzer &rarr;
          </button>
        </div>

        <StaticVsAiComparison onInspectComponent={onInspectComponent} />
      </section>

      {/* 4 Core Technology Pillars */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
              Reliability Architecture
            </h2>
            <p className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Built for Space-Grade Quality Assurance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">
                Multi-Point ESS Time-Series
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Seamless ingestion and temporal tracking across 0h, 24h, 96h, and 168h screening intervals with chamber temperature normalization.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">
                Robust Lot Baselines
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Calculates median, Median Absolute Deviation (MAD), and dynamic sigma envelopes resistant to population skew and outlier distortion.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">
                Drift Rate & Curvature
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Evaluates parameter velocity (µA/h) and acceleration between 96h–168h to identify early onset dielectric breakdown mechanisms.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">
                Explainable AI Decisions
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Clear engineering justifications with percentile ranking, relative drift factors, and actionable qualification recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ISRO Flight Mission Presets Teaser */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900 text-white p-8 md:p-10 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400">
              <Satellite className="w-4 h-4" />
              <span>ISRO QUALIFICATION PIPELINE</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Ready to Inspect 10,482 Screened Components?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Analyze wafer batches across 36 qualification lots, investigate high-risk anomalies, and generate MIL-PRF-38535 Class V compliance reports.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono transition-colors shadow-md cursor-pointer"
            >
              Open Dashboard
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs font-mono transition-colors cursor-pointer"
            >
              Generate Reports
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
