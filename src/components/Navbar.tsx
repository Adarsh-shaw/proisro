import React, { useState } from 'react';
import { PageId } from '../types';
import {
  Bell,
  Menu,
  X,
  CheckCircle2,
  AlertOctagon,
  Search,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate?: (page: PageId) => void;
  onSelectPage?: (page: PageId) => void;
  onSearchComponent?: (id: string) => void;
  onOpenComponent?: (id: string) => void;
  totalComponents?: number;
  highRiskCount?: number;
  notificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onSelectPage,
  onSearchComponent,
  onOpenComponent,
  totalComponents = 10482,
  highRiskCount = 81,
  notificationsCount = 3,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePageSelect = (page: PageId) => {
    if (onNavigate) onNavigate(page);
    else if (onSelectPage) onSelectPage(page);
    setMobileMenuOpen(false);
  };

  const handleOpenComp = (id: string) => {
    if (onSearchComponent) onSearchComponent(id);
    else if (onOpenComponent) onOpenComponent(id);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleOpenComp(searchQuery.trim().toUpperCase());
      handlePageSelect('component-analysis');
      setSearchQuery('');
    }
  };

  const navItems: { id: PageId; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'component-analysis', label: 'Components' },
    { id: 'lot-analysis', label: 'Lot Intelligence' },
    { id: 'drift-analysis', label: 'Drift Analysis' },
    { id: 'anomaly-detection', label: 'Anomalies' },
    { id: 'upload-data', label: 'Upload Data' },
    { id: 'model-performance', label: 'Model' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shrink-0">
      {/* Sleek Command Navbar Header */}
      <div className="w-full px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => handlePageSelect('landing')}
            className="flex items-center gap-3 text-left focus:outline-hidden group"
          >
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center shadow-xs group-hover:bg-blue-400 transition-colors">
              <div className="w-4 h-4 border-2 border-white rotate-45"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              BurnIn <span className="text-blue-400">AI</span>
            </span>
          </button>

          {/* Sleek Horizontal Navigation */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => handlePageSelect('landing')}
              className={`transition-colors cursor-pointer ${
                currentPage === 'landing'
                  ? 'text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold'
                  : 'text-slate-300 hover:text-white pb-1'
              }`}
            >
              Overview
            </button>
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageSelect(item.id)}
                  className={`transition-colors cursor-pointer ${
                    active
                      ? 'text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold'
                      : 'text-slate-300 hover:text-white pb-1'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Quick Search, Mission Status, Notifications, Avatar */}
        <div className="flex items-center gap-4">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search C-1045..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 text-slate-200 placeholder-slate-400 text-xs rounded-full pl-8 pr-3 py-1.5 border border-slate-700 focus:outline-hidden focus:border-blue-500 w-36 lg:w-44 transition-all"
            />
          </form>

          {/* ISRO Mission Status Pill */}
          <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-800 px-3 py-1 rounded-full border border-slate-700/60">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-slate-300 font-mono text-[11px] font-medium tracking-wide">
              ISRO MISSION STATUS: OPERATIONAL
            </span>
          </div>

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 relative transition-colors cursor-pointer"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {notificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900"></span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Reliability Alerts (3)
                  </span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded border border-rose-200">
                    1 CRITICAL
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto text-left">
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      handlePageSelect('component-analysis');
                      handleOpenComp('C-1045');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-600 font-mono flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-600"></span> Latent Defect Flagged
                      </span>
                      <span className="text-[10px] text-slate-400">10m ago</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 font-medium">
                      Component <strong>C-1045</strong> in Lot A17 exhibited +337% leakage current drift.
                      Static test passed, AI flagged HIGH-RISK.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      handlePageSelect('lot-analysis');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-600 font-mono flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Lot A17 168h Complete
                      </span>
                      <span className="text-[10px] text-slate-400">1h ago</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">
                      1,240 components screened. 11 high-risk anomalies isolated for DPA review.
                    </p>
                  </div>

                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-600 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Model Retraining Synced
                      </span>
                      <span className="text-[10px] text-slate-400">3h ago</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">
                      Isolation Forest & Autoencoder ensemble updated with 96.8% accuracy.
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      handlePageSelect('anomaly-detection');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All Flagged Anomalies &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div
            onClick={() => handlePageSelect('settings')}
            className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-xs font-semibold text-slate-200 cursor-pointer transition-colors shadow-xs"
            title="User Profile: Dr. K. Sivanandan (URSC Lead)"
          >
            JD
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => handlePageSelect('landing')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === 'landing' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Overview
          </button>
          {navItems.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handlePageSelect(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
