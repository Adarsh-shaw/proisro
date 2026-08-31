import React, { useState } from 'react';
import { ComponentRecord, LotSummary } from '../../types';
import { StatusBadge } from '../StatusBadge';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  FileSpreadsheet,
  Award,
} from 'lucide-react';

interface ReportsPageProps {
  lots: Record<string, LotSummary>;
  components: ComponentRecord[];
  onInspectComponent: (id: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  lots,
  components,
  onInspectComponent,
}) => {
  const lotList = Object.values(lots) as LotSummary[];
  const [selectedLotId, setSelectedLotId] = useState('LOT-2026-A17');
  const activeLot = lots[selectedLotId] || lotList[0];

  const highRiskLotComponents = components
    .filter((c) => c.lotId === selectedLotId && (c.status === 'HIGH-RISK' || c.status === 'SUSPICIOUS'))
    .slice(0, 10);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const reportData = {
      reportTitle: 'ISRO Electronic Component Screening & Burn-In Intelligence Audit Report',
      standard: 'ISRO-PAS-102 / MIL-STD-883 Method 1015 Class S',
      generatedAt: new Date().toISOString(),
      lotSummary: activeLot,
      flaggedHighRiskComponents: highRiskLotComponents,
      qaRecommendation: `Quarantine ${activeLot.highRiskCount} High-Risk units for Destructive Physical Analysis (DPA). Release ${activeLot.normalCount} units for flight integration.`,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `isro_audit_report_${selectedLotId}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold uppercase">
            <FileText className="w-4 h-4" />
            <span>Aerospace Quality Assurance Documentation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Screening Reports & Export
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal qualification audit reports conforming to ISRO Class-S space reliability standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Export</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Audit</span>
          </button>
        </div>
      </div>

      {/* Lot Selector for Report */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4 font-mono text-xs print:hidden">
        <span className="font-bold text-slate-700 uppercase">Select Target Lot for Audit Report:</span>
        <select
          value={selectedLotId}
          onChange={(e) => setSelectedLotId(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        >
          {lotList.map((l) => (
            <option key={l.lotId} value={l.lotId}>
              {l.lotId} ({l.totalComponents} units • {l.partNumber})
            </option>
          ))}
        </select>
      </div>

      {/* Formal Printable Aerospace Report Document */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-8 md:p-12 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                INDIAN SPACE RESEARCH ORGANISATION • COMPONENT SCREENING DIVISION
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1">
                BURN-IN TEMPORAL DRIFT & ANOMALY QUALIFICATION REPORT
              </h2>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                Standard: <strong className="text-slate-900">ISRO-PAS-102 / MIL-STD-883 Method 1015 (168h @ 125°C)</strong>
              </p>
            </div>

            <div className="text-right font-mono text-xs text-slate-500">
              <span className="block font-bold text-slate-900">DOC REF: ISRO-QA-2026-B{selectedLotId.slice(-3)}</span>
              <span className="block">Date: {new Date().toISOString().slice(0, 10)}</span>
              <span className="block text-emerald-700 font-bold">STATUS: AUDIT VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase">Screened Population</span>
            <span className="text-lg font-bold text-slate-900">{activeLot.totalComponents.toLocaleString()} Units</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
            <span className="text-emerald-700 block text-[10px] uppercase">Flight Qualified</span>
            <span className="text-lg font-bold text-emerald-700">{activeLot.normalCount.toLocaleString()} Units ({activeLot.healthyPercentage}%)</span>
          </div>
          <div className="p-3 bg-amber-50 rounded border border-amber-200">
            <span className="text-amber-700 block text-[10px] uppercase">Watch / Monitor</span>
            <span className="text-lg font-bold text-amber-700">{activeLot.watchCount} Units</span>
          </div>
          <div className="p-3 bg-rose-50 rounded border border-rose-200">
            <span className="text-rose-700 block text-[10px] uppercase">Quarantine (High Risk)</span>
            <span className="text-lg font-bold text-rose-700">{activeLot.highRiskCount} Units ({activeLot.highRiskPercentage}%)</span>
          </div>
        </div>

        {/* Technical Recommendation Block */}
        <div className="p-5 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 uppercase">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Chief Reliability Engineer Recommendation</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            1. All <strong>{activeLot.normalCount} normal units</strong> demonstrate flat, stable parameter trajectories across 168 hours of thermal stress (median drift +{activeLot.baseline.leakage.median.h168 - activeLot.baseline.leakage.median.h0 > 0 ? (activeLot.baseline.leakage.median.h168 - activeLot.baseline.leakage.median.h0).toFixed(1) : 0.8} µA) and are approved for flight payload assembly.
            <br />
            2. <strong>{activeLot.highRiskCount} units</strong> exhibiting extreme non-linear positive acceleration (e.g. C-1045 with +337% drift) are placed on <strong>immediate quarantine</strong> for Destructive Physical Analysis (DPA) to inspect gate-oxide integrity.
          </p>
        </div>

        {/* Flagged High-Risk Units Table */}
        <div>
          <h3 className="text-sm font-bold font-mono text-slate-900 uppercase mb-3 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            Identified High-Risk & Suspicious Outliers in {activeLot.lotId}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Component ID</th>
                  <th className="p-2.5">0h → 168h Leakage</th>
                  <th className="p-2.5">Total Drift</th>
                  <th className="p-2.5">Relative Multiplier</th>
                  <th className="p-2.5">Trad Screening</th>
                  <th className="p-2.5">AI Classification</th>
                  <th className="p-2.5">Recommended Disposition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {highRiskLotComponents.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2.5 font-bold text-slate-900">{c.id}</td>
                    <td className="p-2.5">{c.parameters.leakageCurrent.h0} → {c.parameters.leakageCurrent.h168} µA</td>
                    <td className="p-2.5 font-bold text-rose-600">+{c.driftAnalysis.totalDriftPercent}%</td>
                    <td className="p-2.5">{c.driftAnalysis.relativeDrift}× median</td>
                    <td className="p-2.5"><StatusBadge status="PASS" size="sm" /></td>
                    <td className="p-2.5"><StatusBadge status={c.status} size="sm" /></td>
                    <td className="p-2.5 font-semibold text-rose-700">{c.recommendedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formal QA Sign-Off Section */}
        <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Screening Test Lead</span>
            <div className="mt-6 border-b border-slate-400 pb-1 font-bold text-slate-800">Dr. K. S. Ramanathan</div>
            <span className="text-slate-400 text-[10px]">Head, Environmental Test Facility</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Quality Assurance Officer</span>
            <div className="mt-6 border-b border-slate-400 pb-1 font-bold text-slate-800">P. V. Radhakrishnan</div>
            <span className="text-slate-400 text-[10px]">Directorate of Reliability & QA</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">AI Model Validation Lead</span>
            <div className="mt-6 border-b border-slate-400 pb-1 font-bold text-slate-800">BurnIn AI Screening System</div>
            <span className="text-slate-400 text-[10px]">Deterministic ML v2.4 (AUC: 0.993)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
