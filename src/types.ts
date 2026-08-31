export type ComponentStatus = 'NORMAL' | 'WATCH' | 'SUSPICIOUS' | 'HIGH-RISK';
export type TraditionalStatus = 'PASS' | 'FAIL';
export type DriftCategory = 'STABLE' | 'LOW_DRIFT' | 'ABNORMAL_DRIFT' | 'ACCELERATING_DRIFT';

export interface TimeSeriesPoints {
  h0: number;
  h24: number;
  h96: number;
  h168: number;
  unit: string;
  specMin?: number;
  specMax?: number;
}

export interface ComponentRecord {
  id: string;
  lotId: string;
  componentType: string;
  packageType: string;
  parameters: {
    leakageCurrent: TimeSeriesPoints;
    iddq: TimeSeriesPoints;
    propDelay: TimeSeriesPoints;
    temperature: TimeSeriesPoints;
  };
  driftAnalysis: {
    initialValue: number;
    finalValue: number;
    totalDriftPercent: number;
    driftRate: number; // unit/hour
    lotMedianDriftPercent: number;
    relativeDrift: number; // X times lot median
    driftCategory: DriftCategory;
    driftScore: number; // 0-100
    accelerationRate: number;
  };
  anomalyMetrics: {
    anomalyScore: number; // 0-100
    isolationForestScore: number; // 0.0 - 1.0
    robustZScore: number;
    madScore: number;
    percentileRank: number;
    failureRisk: number; // 0-100%
    riskScore: number; // 0-100
  };
  status: ComponentStatus;
  traditionalScreening: TraditionalStatus;
  aiScreening: ComponentStatus;
  isLatentDefect: boolean;
  flagReasons: string[];
  aiAssessment: string;
  recommendedAction: string;
  testedDate: string;
  testFacility: string;
  waferLocation?: string;
}

export interface LotSummary {
  lotId: string;
  lotName: string;
  partNumber: string;
  totalComponents: number;
  normalCount: number;
  watchCount: number;
  suspiciousCount: number;
  highRiskCount: number;
  healthyPercentage: number;
  watchPercentage: number;
  suspiciousPercentage: number;
  highRiskPercentage: number;
  waferBatch: string;
  manufactureDate: string;
  screeningStartDate: string;
  screeningEndDate: string;
  facility: string;
  baseline: {
    leakage: {
      mean: { h0: number; h24: number; h96: number; h168: number };
      median: { h0: number; h24: number; h96: number; h168: number };
      stdDev: { h0: number; h24: number; h96: number; h168: number };
      mad: { h0: number; h24: number; h96: number; h168: number };
      p90: { h0: number; h24: number; h96: number; h168: number };
    };
    iddq: {
      mean: { h0: number; h24: number; h96: number; h168: number };
      median: { h0: number; h24: number; h96: number; h168: number };
      stdDev: { h0: number; h24: number; h96: number; h168: number };
    };
    propDelay: {
      mean: { h0: number; h24: number; h96: number; h168: number };
      median: { h0: number; h24: number; h96: number; h168: number };
      stdDev: { h0: number; h24: number; h96: number; h168: number };
    };
  };
}

export interface GlobalDashboardStats {
  totalComponents: number;
  normalCount: number;
  watchCount: number;
  suspiciousCount: number;
  highRiskCount: number;
  lotsAnalyzed: number;
  healthyPercentage: number;
  watchPercentage: number;
  suspiciousPercentage: number;
  highRiskPercentage: number;
  latentDefectsCount: number;
  criticalAlertComponent: ComponentRecord;
}

export interface ModelMetricData {
  modelId: string;
  name: string;
  type: string;
  precision: number;
  recall: number;
  f1: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  rocAuc: number;
  isProduction: boolean;
  description: string;
  trainingTimeMs: number;
  inferenceSpeedSamplesSec: number;
  confusionMatrix: {
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
    truePositive: number;
  };
}

export interface ScreeningReportData {
  reportId: string;
  title: string;
  generatedAt: string;
  generatedBy: string;
  missionName: string;
  lotId: string;
  totalTested: number;
  passedTraditional: number;
  passedAI: number;
  latentDefectsIdentified: number;
  quarantineCount: number;
  actionableRecommendations: string[];
  components: ComponentRecord[];
}

export type PageId =
  | 'landing'
  | 'dashboard'
  | 'component-analysis'
  | 'lot-analysis'
  | 'upload-data'
  | 'anomaly-detection'
  | 'drift-analysis'
  | 'model-performance'
  | 'reports'
  | 'settings';
