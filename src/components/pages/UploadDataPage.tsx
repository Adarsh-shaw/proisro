import React, { useState } from 'react';
import { PageId } from '../../types';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Download,
  Loader2,
  Database,
  Cpu,
  Layers,
} from 'lucide-react';

interface UploadDataPageProps {
  onNavigate: (page: PageId) => void;
  onInspectComponent: (id: string) => void;
}

export const UploadDataPage: React.FC<UploadDataPageProps> = ({
  onNavigate,
  onInspectComponent,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'processing' | 'complete'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [analyzedSummary, setAnalyzedSummary] = useState<any>(null);

  const steps = [
    { number: 1, title: 'Validating Data Structure', desc: 'Verifying time points (0h, 24h, 96h, 168h) & parameter ranges.' },
    { number: 2, title: 'Preprocessing & Cleaning', desc: 'Outlier filtering, baseline normalization, chamber temperature calibration.' },
    { number: 3, title: 'Feature Engineering', desc: 'Computing temporal slopes, late-stage acceleration, and robust MAD sigma envelopes.' },
    { number: 4, title: 'Running ML Anomaly Detection', desc: 'Executing Isolation Forest, LOF density estimators, and Autoencoders.' },
    { number: 5, title: 'Generating Risk Scores & Flagging', desc: 'Synthesizing composite risk indices and identifying latent defect candidates.' },
  ];

  const handleStartProcessing = (filename: string, rowCount = 1240) => {
    setUploadedFileName(filename);
    setUploadState('processing');
    setCurrentStep(1);

    // Simulate 5-step interactive pipeline with timed delays
    setTimeout(() => {
      setCurrentStep(2);
      setTimeout(() => {
        setCurrentStep(3);
        setTimeout(() => {
          setCurrentStep(4);
          setTimeout(() => {
            setCurrentStep(5);
            setTimeout(() => {
              setUploadState('complete');
              setAnalyzedSummary({
                total: rowCount,
                normal: Math.round(rowCount * 0.917),
                watch: Math.round(rowCount * 0.052),
                suspicious: Math.round(rowCount * 0.023),
                highRisk: Math.max(1, Math.round(rowCount * 0.008)),
                lotId: 'LOT-2026-X99',
              });
            }, 600);
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleStartProcessing(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleStartProcessing(e.target.files[0].name);
    }
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = `Component_ID,Lot_ID,Component_Type,Parameter,0h,24h,96h,168h,Chamber_Temp_C,Spec_Limit_Max
C-1045,LOT-2026-A17,RH-54HC245,Leakage_Current_uA,10.2,17.4,29.8,44.6,125.0,50.0
C-0832,LOT-2026-A17,RH-54HC245,Leakage_Current_uA,9.8,15.2,26.4,41.2,125.0,50.0
C-1922,LOT-2026-B04,RH-OP27AZ,Leakage_Current_uA,10.4,13.9,19.8,27.5,125.0,50.0
C-0102,LOT-2026-A17,RH-54HC245,Leakage_Current_uA,10.0,10.3,10.5,10.8,125.0,50.0
C-0248,LOT-2026-A17,RH-54HC245,Leakage_Current_uA,10.4,11.2,12.4,13.6,125.0,50.0
C-0891,LOT-2026-A17,RH-54HC245,Leakage_Current_uA,10.1,12.8,17.5,24.2,125.0,50.0`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'isro_screening_burnin_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold uppercase">
          <UploadCloud className="w-4 h-4" />
          <span>Burn-In Dataset Ingestion & AI Pipeline</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
          Upload Burn-In Data
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Ingest multi-interval time-series test records (0h, 24h, 96h, 168h) for automated drift and anomaly extraction.
        </p>
      </div>

      {uploadState === 'idle' && (
        <div className="space-y-6">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center transition-all bg-white ${
              dragOver
                ? 'border-blue-500 bg-blue-50/50 scale-[1.005]'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-mono">
              Drag & drop your screening dataset here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Supported file formats: <strong className="text-slate-700">CSV, XLSX, TXT (Space-Delimited)</strong>. Max file size: 50MB.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <label className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                Browse Files
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <button
                onClick={() => handleStartProcessing('ISRO_54HC245_LotA17_BurnIn_168h.csv', 1240)}
                className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Load ISRO Benchmark Dataset
              </button>
            </div>
          </div>

          {/* Sample Format Specification & Download */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Expected Screening Dataset Schema
                </h3>
                <p className="text-xs text-slate-500">
                  Ensure your column headers match the ISRO qualification format:
                </p>
              </div>

              <button
                onClick={handleDownloadSampleCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-mono font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Sample CSV
              </button>
            </div>

            {/* Schema Table Preview */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Component_ID</th>
                    <th className="py-2.5 px-3">Lot_ID</th>
                    <th className="py-2.5 px-3">Parameter</th>
                    <th className="py-2.5 px-3">0h</th>
                    <th className="py-2.5 px-3">24h</th>
                    <th className="py-2.5 px-3">96h</th>
                    <th className="py-2.5 px-3">168h</th>
                    <th className="py-2.5 px-3">Temperature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">C-1045</td>
                    <td className="py-2 px-3">LOT-2026-A17</td>
                    <td className="py-2 px-3">Leakage_Current_uA</td>
                    <td className="py-2 px-3">10.2</td>
                    <td className="py-2 px-3">17.4</td>
                    <td className="py-2 px-3">29.8</td>
                    <td className="py-2 px-3 font-bold text-rose-600">44.6</td>
                    <td className="py-2 px-3">125.0 °C</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">C-0102</td>
                    <td className="py-2 px-3">LOT-2026-A17</td>
                    <td className="py-2 px-3">Leakage_Current_uA</td>
                    <td className="py-2 px-3">10.0</td>
                    <td className="py-2 px-3">10.3</td>
                    <td className="py-2 px-3">10.5</td>
                    <td className="py-2 px-3 text-emerald-600">10.8</td>
                    <td className="py-2 px-3">125.0 °C</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Upload Processing State (5-step animation) */}
      {uploadState === 'processing' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 font-mono">
              Analyzing Burn-In Screening Dataset
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              File: <strong className="text-slate-800">{uploadedFileName}</strong>
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs max-w-xl mx-auto">
            {steps.map((step) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              const isPending一手 = currentStep < step.number;

              return (
                <div
                  key={step.number}
                  className={`p-3.5 rounded-lg border transition-all flex items-start gap-3 ${
                    isCompleted
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                        {step.number}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold block">
                      Step {step.number}: {step.title}
                    </span>
                    <span className="text-[11px] opacity-80 block mt-0.5">{step.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analysis Complete Summary View */}
      {uploadState === 'complete' && analyzedSummary && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-mono">Analysis Complete</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Dataset <strong>{uploadedFileName}</strong> processed successfully through ISRO ML anomaly pipeline.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase block">Screened</span>
              <span className="text-xl font-bold text-slate-900">{analyzedSummary.total}</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 text-[10px] uppercase block">Normal</span>
              <span className="text-xl font-bold text-emerald-700">{analyzedSummary.normal}</span>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <span className="text-amber-700 text-[10px] uppercase block">Watch</span>
              <span className="text-xl font-bold text-amber-700">{analyzedSummary.watch}</span>
            </div>
            <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
              <span className="text-rose-700 text-[10px] uppercase block">High-Risk</span>
              <span className="text-xl font-bold text-rose-700">{analyzedSummary.highRisk}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('anomaly-detection')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>View Flagged Anomalies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setUploadState('idle');
                setCurrentStep(0);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-mono text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Upload Another Dataset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
