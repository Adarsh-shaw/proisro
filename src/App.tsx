import React, { useState, useEffect } from 'react';
import { PageId, ComponentRecord, LotSummary, GlobalDashboardStats } from './types';
import { generateAllSyntheticData } from './engine/screeningEngine';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/pages/LandingPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { ComponentAnalysisPage } from './components/pages/ComponentAnalysisPage';
import { LotAnalysisPage } from './components/pages/LotAnalysisPage';
import { UploadDataPage } from './components/pages/UploadDataPage';
import { AnomalyDetectionPage } from './components/pages/AnomalyDetectionPage';
import { DriftAnalysisPage } from './components/pages/DriftAnalysisPage';
import { ModelPerformancePage } from './components/pages/ModelPerformancePage';
import { ReportsPage } from './components/pages/ReportsPage';
import { SettingsPage } from './components/pages/SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [selectedComponentId, setSelectedComponentId] = useState<string>('C-1045');
  const [selectedLotId, setSelectedLotId] = useState<string>('LOT-2026-A17');

  // Initialize dataset from deterministic screening engine
  const [dataset, setDataset] = useState<{
    stats: GlobalDashboardStats;
    lots: Record<string, LotSummary>;
    components: ComponentRecord[];
    criticalComponent: ComponentRecord;
  }>(() => generateAllSyntheticData());

  // Attempt to fetch fresh data from Express backend if available
  useEffect(() => {
    async function loadBackendData() {
      try {
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const stats = await statsRes.json();
          const lotsRes = await fetch('/api/lots');
          const lots = lotsRes.ok ? await lotsRes.json() : dataset.lots;
          const compRes = await fetch('/api/components?limit=2000');
          let components = dataset.components;
          if (compRes.ok) {
            const compJson = await compRes.json();
            // Handle both { data: [...] } and raw array responses
            if (Array.isArray(compJson)) {
              components = compJson;
            } else if (compJson && Array.isArray(compJson.data)) {
              components = compJson.data;
            }
          }
          const critRes = await fetch('/api/components/C-1045');
          let critical = dataset.criticalComponent;
          if (critRes.ok) {
            const critJson = await critRes.json();
            critical = critJson.component || critJson;
          }

          setDataset({
            stats,
            lots,
            components: Array.isArray(components) ? components : dataset.components,
            criticalComponent: critical,
          });
        }
      } catch (err) {
        // Fallback to synthetic in-memory dataset
        console.log('Using local deterministic screening engine dataset.');
      }
    }

    loadBackendData();
  }, []);

  const handleInspectComponent = (id: string) => {
    setSelectedComponentId(id);
    setCurrentPage('component-analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLot = (lotId: string) => {
    setSelectedLotId(lotId);
    setCurrentPage('lot-analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Primary Aerospace Command-Center Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSearchComponent={handleInspectComponent}
        totalComponents={dataset.stats.totalComponents}
        highRiskCount={dataset.stats.highRiskCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onInspectComponent={handleInspectComponent}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            stats={dataset.stats}
            lots={dataset.lots}
            criticalComponent={dataset.criticalComponent}
            onNavigate={handleNavigate}
            onInspectComponent={handleInspectComponent}
            onSelectLot={handleSelectLot}
          />
        )}

        {currentPage === 'component-analysis' && (
          <ComponentAnalysisPage
            selectedComponentId={selectedComponentId}
            onSelectComponent={setSelectedComponentId}
            components={dataset.components}
            lots={dataset.lots}
            onSelectLot={handleSelectLot}
          />
        )}

        {currentPage === 'lot-analysis' && (
          <LotAnalysisPage
            selectedLotId={selectedLotId}
            onSelectLot={setSelectedLotId}
            lots={dataset.lots}
            components={dataset.components}
            onInspectComponent={handleInspectComponent}
          />
        )}

        {currentPage === 'upload-data' && (
          <UploadDataPage
            onNavigate={handleNavigate}
            onInspectComponent={handleInspectComponent}
          />
        )}

        {currentPage === 'anomaly-detection' && (
          <AnomalyDetectionPage
            components={dataset.components}
            lots={dataset.lots}
            onInspectComponent={handleInspectComponent}
            onSelectLot={handleSelectLot}
          />
        )}

        {currentPage === 'drift-analysis' && (
          <DriftAnalysisPage
            components={dataset.components}
            lots={dataset.lots}
            onInspectComponent={handleInspectComponent}
          />
        )}

        {currentPage === 'model-performance' && <ModelPerformancePage />}

        {currentPage === 'reports' && (
          <ReportsPage
            lots={dataset.lots}
            components={dataset.components}
            onInspectComponent={handleInspectComponent}
          />
        )}

        {currentPage === 'settings' && <SettingsPage />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs font-mono text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">BurnIn AI</span>
            <span>•</span>
            <span>ISRO Hackathon Problem 26170</span>
          </div>
          <div className="text-slate-400">
            Temporal Drift & Latent Anomaly Detection Platform • Conforming to MIL-STD-883 Method 1015 Class S
          </div>
        </div>
      </footer>
    </div>
  );
}
