import React, { useState, useMemo } from 'react';
import { ComponentRecord, ComponentStatus, LotSummary } from '../../types';
import { StatusBadge } from '../StatusBadge';
import {
  AlertOctagon,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Eye,
  Zap,
} from 'lucide-react';

interface AnomalyDetectionPageProps {
  components: ComponentRecord[];
  lots: Record<string, LotSummary>;
  onInspectComponent: (id: string) => void;
  onSelectLot: (lotId: string) => void;
}

export const AnomalyDetectionPage: React.FC<AnomalyDetectionPageProps> = ({
  components,
  lots,
  onInspectComponent,
  onSelectLot,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLot, setSelectedLot] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [latentDefectsOnly, setLatentDefectsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'anomalyScore' | 'driftScore' | 'failureRisk' | 'totalDriftPercent' | 'id'>('anomalyScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const lotList = Object.values(lots) as LotSummary[];

  const filteredComponents = useMemo(() => {
    let list = Array.isArray(components) ? components : [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.lotId.toLowerCase().includes(q) ||
          c.componentType.toLowerCase().includes(q)
      );
    }

    if (selectedLot !== 'ALL') {
      list = list.filter((c) => c.lotId === selectedLot);
    }

    if (selectedStatus !== 'ALL') {
      list = list.filter((c) => c.status === selectedStatus);
    }

    if (latentDefectsOnly) {
      list = list.filter((c) => c.isLatentDefect);
    }

    // Sort
    return [...list].sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'anomalyScore') {
        valA = a.anomalyMetrics.anomalyScore;
        valB = b.anomalyMetrics.anomalyScore;
      } else if (sortBy === 'driftScore') {
        valA = a.driftAnalysis.driftScore;
        valB = b.driftAnalysis.driftScore;
      } else if (sortBy === 'failureRisk') {
        valA = a.anomalyMetrics.failureRisk;
        valB = b.anomalyMetrics.failureRisk;
      } else if (sortBy === 'totalDriftPercent') {
        valA = a.driftAnalysis.totalDriftPercent;
        valB = b.driftAnalysis.totalDriftPercent;
      } else if (sortBy === 'id') {
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [components, searchQuery, selectedLot, selectedStatus, latentDefectsOnly, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredComponents.length / pageSize) || 1;
  const paginatedData = filteredComponents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportFilteredCsv = () => {
    const headers = [
      'Rank',
      'Component_ID',
      'Lot_ID',
      'Component_Type',
      'Status',
      'Traditional_Status',
      'Leakage_0h_uA',
      'Leakage_168h_uA',
      'Total_Drift_Percent',
      'Drift_Rate_uA_per_h',
      'Relative_Drift_Factor',
      'Anomaly_Score',
      'Drift_Score',
      'Failure_Risk_Percent',
    ];

    const rows = filteredComponents.slice(0, 500).map((c, idx) => [
      idx + 1,
      c.id,
      c.lotId,
      `"${c.componentType}"`,
      c.status,
      c.traditionalScreening,
      c.parameters.leakageCurrent.h0,
      c.parameters.leakageCurrent.h168,
      c.driftAnalysis.totalDriftPercent,
      c.driftAnalysis.driftRate,
      c.driftAnalysis.relativeDrift,
      c.anomalyMetrics.anomalyScore,
      c.driftAnalysis.driftScore,
      c.anomalyMetrics.failureRisk,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `isro_anomalies_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-600 font-semibold uppercase">
            <AlertOctagon className="w-4 h-4" />
            <span>AI-Driven Outlier Isolation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">
            Anomaly Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized ranking of anomalous components based on multi-parameter temporal drift vectors.
          </p>
        </div>

        <button
          onClick={handleExportFilteredCsv}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search Component / Lot ID..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Lot Filter */}
          <div>
            <select
              value={selectedLot}
              onChange={(e) => {
                setSelectedLot(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All 36 Lots</option>
              {lotList.map((l) => (
                <option key={l.lotId} value={l.lotId}>
                  {l.lotId} ({l.totalComponents} units)
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="HIGH-RISK">HIGH-RISK (Critical)</option>
              <option value="SUSPICIOUS">SUSPICIOUS (Secondary ESS)</option>
              <option value="WATCH">WATCH (Minor Drift)</option>
              <option value="NORMAL">NORMAL (Nominal)</option>
            </select>
          </div>

          {/* Latent Defects Toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs font-mono text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={latentDefectsOnly}
                onChange={(e) => {
                  setLatentDefectsOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="font-semibold text-rose-700">Latent Defects Only</span>
              <span className="text-[10px] text-slate-400">(Pass Static, Fail AI)</span>
            </label>
          </div>
        </div>

        {/* Active Filter Metrics */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono pt-3 border-t border-slate-100 gap-2">
          <span className="text-slate-500">
            Showing <strong className="text-slate-900">{filteredComponents.length.toLocaleString()}</strong> of {components.length.toLocaleString()} components
          </span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Sort By:</span>
            <button
              onClick={() => {
                if (sortBy === 'anomalyScore') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortBy('anomalyScore'); setSortOrder('desc'); }
              }}
              className={`px-2 py-0.5 rounded border text-xs cursor-pointer ${
                sortBy === 'anomalyScore' ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
              }`}
            >
              Anomaly Score {sortBy === 'anomalyScore' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
            </button>
            <button
              onClick={() => {
                if (sortBy === 'totalDriftPercent') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortBy('totalDriftPercent'); setSortOrder('desc'); }
              }}
              className={`px-2 py-0.5 rounded border text-xs cursor-pointer ${
                sortBy === 'totalDriftPercent' ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
              }`}
            >
              Total Drift % {sortBy === 'totalDriftPercent' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Main Anomaly Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Rank</th>
                <th className="py-3 px-3.5">Component</th>
                <th className="py-3 px-3.5">Lot ID</th>
                <th className="py-3 px-3.5">Leakage (0h → 168h)</th>
                <th className="py-3 px-3.5">Total Drift</th>
                <th className="py-3 px-3.5">Anomaly Score</th>
                <th className="py-3 px-3.5">Drift Score</th>
                <th className="py-3 px-3.5">Failure Risk</th>
                <th className="py-3 px-3.5">Traditional</th>
                <th className="py-3 px-3.5">AI Status</th>
                <th className="py-3 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((c, idx) => {
                const globalRank = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-400">#{globalRank}</td>
                    <td className="py-3 px-3.5 font-bold text-slate-900 flex items-center gap-1.5">
                      {c.isLatentDefect && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                      )}
                      <span>{c.id}</span>
                    </td>
                    <td className="py-3 px-3.5">
                      <button
                        onClick={() => onSelectLot(c.lotId)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {c.lotId}
                      </button>
                    </td>
                    <td className="py-3 px-3.5 text-slate-700">
                      {c.parameters.leakageCurrent.h0} → {c.parameters.leakageCurrent.h168} µA
                    </td>
                    <td className="py-3 px-3.5 font-bold">
                      <span
                        className={
                          c.driftAnalysis.totalDriftPercent > 100
                            ? 'text-rose-600'
                            : c.driftAnalysis.totalDriftPercent > 30
                            ? 'text-amber-600'
                            : 'text-slate-700'
                        }
                      >
                        +{c.driftAnalysis.totalDriftPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900">
                      {c.anomalyMetrics.anomalyScore}/100
                    </td>
                    <td className="py-3 px-3.5 font-medium text-slate-700">
                      {c.driftAnalysis.driftScore}/100
                    </td>
                    <td className="py-3 px-3.5 font-bold text-rose-600">
                      {c.anomalyMetrics.failureRisk}%
                    </td>
                    <td className="py-3 px-3.5">
                      <StatusBadge status={c.traditionalScreening} size="sm" />
                    </td>
                    <td className="py-3 px-3.5">
                      <StatusBadge status={c.status} size="sm" pulse={c.status === 'HIGH-RISK'} />
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={() => onInspectComponent(c.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-500">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredComponents.length} items)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
