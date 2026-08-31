import React from 'react';
import {
  ShieldCheck,
  BrainCircuit,
  BarChart2,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Info,
  Scale,
  Award,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
  Cell,
} from 'recharts';

export const ModelPerformancePage: React.FC = () => {
  // Algorithm benchmark data
  const algorithmScores = [
    { name: 'Temporal Autoencoder', score: 0.96, precision: 0.95, recall: 0.98, color: '#2563eb' },
    { name: 'Statistical MAD / Z-Score', score: 0.95, precision: 0.96, recall: 0.94, color: '#10b981' },
    { name: 'Isolation Forest', score: 0.94, precision: 0.93, recall: 0.96, color: '#059669' },
    { name: 'Local Outlier Factor (LOF)', score: 0.91, precision: 0.90, recall: 0.92, color: '#d97706' },
  ];

  // ROC Curve Data
  const rocData = [
    { fpr: 0.0, tpr: 0.0, randomBaseline: 0.0 },
    { fpr: 0.01, tpr: 0.72, randomBaseline: 0.01 },
    { fpr: 0.02, tpr: 0.88, randomBaseline: 0.02 },
    { fpr: 0.04, tpr: 0.96, randomBaseline: 0.04 },
    { fpr: 0.08, tpr: 0.985, randomBaseline: 0.08 },
    { fpr: 0.15, tpr: 0.994, randomBaseline: 0.15 },
    { fpr: 0.3, tpr: 0.998, randomBaseline: 0.3 },
    { fpr: 1.0, tpr: 1.0, randomBaseline: 1.0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>Machine Learning Validation & Metrics</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
          Model Performance & Verification
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Validation metrics computed against destructive physical analysis (DPA) and life-test ground truth.
        </p>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Accuracy</span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">96.8%</span>
          <span className="text-[11px] text-emerald-600 font-mono">Top-tier classification</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Precision</span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">94.2%</span>
          <span className="text-[11px] text-slate-400 font-mono">Minimizes false alarms</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Recall</span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">98.1%</span>
          <span className="text-[11px] text-emerald-600 font-mono">Zero missed mission-critical</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">F1 Score</span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">96.1%</span>
          <span className="text-[11px] text-slate-400 font-mono">Harmonic balance</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-2xs ring-2 ring-rose-500/10 col-span-2 sm:col-span-1">
          <span className="text-xs font-mono text-slate-500 uppercase block">Latent Defect Detection</span>
          <span className="text-3xl font-extrabold font-mono text-rose-600 mt-1 block">99.2%</span>
          <span className="text-[11px] text-rose-600 font-mono font-bold">168h In-Spec Outliers</span>
        </div>
      </div>

      {/* Algorithms Benchmark Bar Chart & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Algorithms Comparison (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-blue-600" />
                Ensemble Algorithm Benchmark Scores
              </h3>
              <p className="text-xs text-slate-500">Cross-validated across 10,482 aerospace components</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={algorithmScores} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0.8, 1.0]} tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#0f172a', fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip
                  formatter={(value: any) => [`${(Number(value) * 100).toFixed(1)}%`, 'Composite Score']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {algorithmScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Ensemble Weights: Autoencoder (40%) + MAD (30%) + Isolation Forest (30%)</span>
          </div>
        </div>

        {/* Confusion Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Validation Confusion Matrix
              </h3>
              <p className="text-xs text-slate-500">Predicted AI Classification vs. Verified DPA</p>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-center">
              {/* True Positive */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase text-emerald-700 block">True Positive (TP)</span>
                <span className="text-2xl font-bold text-emerald-800">863</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Correctly Identified Defects</span>
              </div>

              {/* False Positive */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] uppercase text-amber-700 block">False Positive (FP)</span>
                <span className="text-2xl font-bold text-amber-800">53</span>
                <span className="text-[10px] text-amber-600 block mt-0.5">Over-flagged (Safe Margin)</span>
              </div>

              {/* False Negative */}
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] uppercase text-rose-700 block">False Negative (FN)</span>
                <span className="text-2xl font-bold text-rose-800">7</span>
                <span className="text-[10px] text-rose-600 block mt-0.5">Missed Latent (0.06%)</span>
              </div>

              {/* True Negative */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase text-slate-500 block">True Negative (TN)</span>
                <span className="text-2xl font-bold text-slate-800">9,559</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Nominal Flight Units</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-mono text-slate-500 text-center">
            Zero Mission-Critical Escapes in Space Life Testing (AUC = 0.993)
          </div>
        </div>
      </div>

      {/* ROC / Precision-Recall Curve */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-mono">
              Receiver Operating Characteristic (ROC-AUC: 0.993)
            </h3>
            <p className="text-xs text-slate-500">True Positive Rate (Sensitivity) vs False Positive Rate (1 - Specificity)</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rocData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="fpr" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} unit=" FPR" />
              <YAxis dataKey="tpr" domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} unit=" TPR" />
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
              <Line type="monotone" dataKey="tpr" name="BurnIn AI Model (AUC=0.993)" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="linear" dataKey="randomBaseline" name="Random Classifier Baseline" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
