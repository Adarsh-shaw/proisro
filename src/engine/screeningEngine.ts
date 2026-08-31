import {
  ComponentRecord,
  ComponentStatus,
  DriftCategory,
  GlobalDashboardStats,
  LotSummary,
  ModelMetricData,
  TraditionalStatus,
} from '../types';

// Mathematical & Statistical Helper Functions
export function calculateMean(values: number[]): number {
  if (!values.length) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Number((sum / values.length).toFixed(4));
}

export function calculateMedian(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(4));
}

export function calculateStdDev(values: number[], mean: number): number {
  if (values.length < 2) return 0;
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
    (values.length - 1);
  return Number(Math.sqrt(variance).toFixed(4));
}

export function calculateMAD(values: number[], median: number): number {
  if (!values.length) return 0;
  const absoluteDeviations = values.map((v) => Math.abs(v - median));
  return calculateMedian(absoluteDeviations);
}

export function calculatePercentile(values: number[], p: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (lower === upper) return sorted[lower];
  return Number((sorted[lower] * (1 - weight) + sorted[upper] * weight).toFixed(4));
}

// Deterministic Pseudo-Random Generator for consistent dataset
let seed = 26170;
function pseudoRandom(): number {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

// Generate the Comprehensive Dataset (10,482 components across 36 lots)
export function generateDataset(): {
  components: ComponentRecord[];
  lots: Record<string, LotSummary>;
  globalStats: GlobalDashboardStats;
  models: ModelMetricData[];
} {
  const LOT_PREFIXES = [
    'LOT-2026-A17',
    'LOT-2026-B04',
    'LOT-2026-C09',
    'LOT-2026-D12',
    'LOT-2026-E05',
    'LOT-2026-F18',
    'LOT-2026-G22',
    'LOT-2026-H31',
    'LOT-2026-J08',
    'LOT-2026-K14',
    'LOT-2026-L27',
    'LOT-2026-M03',
  ];
  // 36 lots total
  const allLotIds: string[] = [];
  for (let i = 1; i <= 36; i++) {
    const letter = String.fromCharCode(65 + ((i - 1) % 18));
    const batch = (10 + (i % 20)).toString().padStart(2, '0');
    allLotIds.push(`LOT-2026-${letter}${batch}`);
  }

  const components: ComponentRecord[] = [];
  const TOTAL_TARGET = 10482;

  // We explicitly create the landmark components requested:
  // 1. C-1045 (Flagship Latent Defect: 10.2 -> 17.4 -> 29.8 -> 44.6 µA, spec < 50µA, drift +337%, risk 91)
  const landmarkC1045: ComponentRecord = {
    id: 'C-1045',
    lotId: 'LOT-2026-A17',
    componentType: 'High-Reliability Logic IC (RH-54HC245 Octal Bus Transceiver)',
    packageType: 'CERPACK-20 (MIL-PRF-38535 Class V)',
    parameters: {
      leakageCurrent: {
        h0: 10.2,
        h24: 17.4,
        h96: 29.8,
        h168: 44.6,
        unit: 'µA',
        specMin: 0,
        specMax: 50.0,
      },
      iddq: {
        h0: 0.38,
        h24: 0.52,
        h96: 0.74,
        h168: 0.98,
        unit: 'mA',
        specMin: 0,
        specMax: 1.2,
      },
      propDelay: {
        h0: 5.1,
        h24: 5.8,
        h96: 7.2,
        h168: 8.9,
        unit: 'ns',
        specMin: 2.0,
        specMax: 15.0,
      },
      temperature: {
        h0: 125.1,
        h24: 125.3,
        h96: 124.9,
        h168: 125.0,
        unit: '°C',
      },
    },
    driftAnalysis: {
      initialValue: 10.2,
      finalValue: 44.6,
      totalDriftPercent: 337.3,
      driftRate: 0.205,
      lotMedianDriftPercent: 12.1,
      relativeDrift: 27.9,
      driftCategory: 'ACCELERATING_DRIFT',
      driftScore: 91,
      accelerationRate: 0.134,
    },
    anomalyMetrics: {
      anomalyScore: 94,
      isolationForestScore: 0.94,
      robustZScore: 5.82,
      madScore: 6.14,
      percentileRank: 98.7,
      failureRisk: 78,
      riskScore: 91,
    },
    status: 'HIGH-RISK',
    traditionalScreening: 'PASS',
    aiScreening: 'HIGH-RISK',
    isLatentDefect: true,
    flagReasons: [
      'Leakage current increased by +337.3% across burn-in duration (168h).',
      'Temporal drift is 27.9× higher than the lot population baseline (+12.1%).',
      'Final 168h reading is in the 98.7th percentile of the wafer lot distribution.',
      'Non-linear accelerating slope between 96h and 168h signifies gate-oxide degradation.',
      'Ensemble ML anomaly detector (Isolation Forest + Autoencoder) classified component as anomalous.',
    ],
    aiAssessment:
      'HIGH PROBABILITY OF ABNORMAL BEHAVIOR / LATENT DIELECTRIC BREAKDOWN RISK',
    recommendedAction:
      'Quarantine component from flight payload. Perform Destructive Physical Analysis (DPA) and Cross-Sectional SEM on Lot A17.',
    testedDate: '2026-08-28 14:30 UTC',
    testFacility: 'ISRO Satellite Centre (URSC) Component Qualification Lab',
    waferLocation: 'Wafer #04 - Edge Ring Sector 3',
  };
  components.push(landmarkC1045);

  // 2. C-0832 (LOT-2026-A17: 89 anomaly score, 85 drift score, 71% failure risk, HIGH-RISK)
  const landmarkC0832: ComponentRecord = {
    id: 'C-0832',
    lotId: 'LOT-2026-A17',
    componentType: 'High-Reliability Logic IC (RH-54HC245 Octal Bus Transceiver)',
    packageType: 'CERPACK-20 (MIL-PRF-38535 Class V)',
    parameters: {
      leakageCurrent: {
        h0: 9.8,
        h24: 15.2,
        h96: 26.4,
        h168: 41.2,
        unit: 'µA',
        specMin: 0,
        specMax: 50.0,
      },
      iddq: {
        h0: 0.36,
        h24: 0.49,
        h96: 0.69,
        h168: 0.91,
        unit: 'mA',
        specMin: 0,
        specMax: 1.2,
      },
      propDelay: {
        h0: 4.9,
        h24: 5.5,
        h96: 6.8,
        h168: 8.2,
        unit: 'ns',
        specMin: 2.0,
        specMax: 15.0,
      },
      temperature: {
        h0: 125.0,
        h24: 125.1,
        h96: 125.2,
        h168: 124.9,
        unit: '°C',
      },
    },
    driftAnalysis: {
      initialValue: 9.8,
      finalValue: 41.2,
      totalDriftPercent: 320.4,
      driftRate: 0.187,
      lotMedianDriftPercent: 12.1,
      relativeDrift: 26.5,
      driftCategory: 'ACCELERATING_DRIFT',
      driftScore: 85,
      accelerationRate: 0.118,
    },
    anomalyMetrics: {
      anomalyScore: 89,
      isolationForestScore: 0.89,
      robustZScore: 5.12,
      madScore: 5.48,
      percentileRank: 97.4,
      failureRisk: 71,
      riskScore: 87,
    },
    status: 'HIGH-RISK',
    traditionalScreening: 'PASS',
    aiScreening: 'HIGH-RISK',
    isLatentDefect: true,
    flagReasons: [
      'Leakage current increased by +320.4% during 168h ESS screening.',
      'Significant parameter shift exceeding 4.5× lot standard deviation.',
      'Positive second derivative in Iddq quiescent current indicating threshold instability.',
    ],
    aiAssessment: 'HIGH RISK OF EARLY ON-ORBIT OPERATIONAL FAILURE',
    recommendedAction: 'Quarantine and isolate from space-grade flight harness assembly.',
    testedDate: '2026-08-28 14:32 UTC',
    testFacility: 'ISRO Satellite Centre (URSC) Component Qualification Lab',
    waferLocation: 'Wafer #04 - Edge Ring Sector 4',
  };
  components.push(landmarkC0832);

  // 3. C-1922 (LOT-2026-B04: 81 anomaly score, 79 drift score, 64% failure risk, SUSPICIOUS)
  const landmarkC1922: ComponentRecord = {
    id: 'C-1922',
    lotId: 'LOT-2026-B04',
    componentType: 'Precision Operational Amplifier (RH-OP27AZ Space Grade)',
    packageType: 'TO-99 Can / Flatpack',
    parameters: {
      leakageCurrent: {
        h0: 10.4,
        h24: 13.9,
        h96: 19.8,
        h168: 27.5,
        unit: 'µA',
        specMin: 0,
        specMax: 50.0,
      },
      iddq: {
        h0: 0.35,
        h24: 0.42,
        h96: 0.54,
        h168: 0.68,
        unit: 'mA',
        specMin: 0,
        specMax: 1.2,
      },
      propDelay: {
        h0: 4.8,
        h24: 5.1,
        h96: 5.9,
        h168: 6.7,
        unit: 'ns',
        specMin: 2.0,
        specMax: 15.0,
      },
      temperature: {
        h0: 125.0,
        h24: 124.8,
        h96: 125.1,
        h168: 125.2,
        unit: '°C',
      },
    },
    driftAnalysis: {
      initialValue: 10.4,
      finalValue: 27.5,
      totalDriftPercent: 164.4,
      driftRate: 0.102,
      lotMedianDriftPercent: 11.8,
      relativeDrift: 13.9,
      driftCategory: 'ABNORMAL_DRIFT',
      driftScore: 79,
      accelerationRate: 0.058,
    },
    anomalyMetrics: {
      anomalyScore: 81,
      isolationForestScore: 0.81,
      robustZScore: 3.42,
      madScore: 3.81,
      percentileRank: 94.2,
      failureRisk: 64,
      riskScore: 74,
    },
    status: 'SUSPICIOUS',
    traditionalScreening: 'PASS',
    aiScreening: 'SUSPICIOUS',
    isLatentDefect: true,
    flagReasons: [
      'Leakage current drift (+164.4%) is 13.9× higher than lot median.',
      'Propagation delay showed progressive increase beyond 3-sigma tolerance.',
    ],
    aiAssessment: 'SUSPICIOUS DRIFT DETECTED. ADDITIONAL CHARACTERIZATION REQUIRED.',
    recommendedAction: 'Subject to additional 96h extended burn-in characterization.',
    testedDate: '2026-08-27 10:15 UTC',
    testFacility: 'VSSC Electronic Quality Assurance & Reliability Division',
    waferLocation: 'Wafer #02 - Inner Ring Sector 1',
  };
  components.push(landmarkC1922);

  // 4. Normal reference components: C-102, C-248, C-891
  const landmarkC102: ComponentRecord = {
    id: 'C-102',
    lotId: 'LOT-2026-A17',
    componentType: 'High-Reliability Logic IC (RH-54HC245 Octal Bus Transceiver)',
    packageType: 'CERPACK-20 (MIL-PRF-38535 Class V)',
    parameters: {
      leakageCurrent: {
        h0: 10.0,
        h24: 10.3,
        h96: 10.5,
        h168: 10.8,
        unit: 'µA',
        specMin: 0,
        specMax: 50.0,
      },
      iddq: {
        h0: 0.35,
        h24: 0.35,
        h96: 0.36,
        h168: 0.36,
        unit: 'mA',
        specMin: 0,
        specMax: 1.2,
      },
      propDelay: {
        h0: 4.8,
        h24: 4.8,
        h96: 4.9,
        h168: 4.9,
        unit: 'ns',
        specMin: 2.0,
        specMax: 15.0,
      },
      temperature: {
        h0: 125.0,
        h24: 125.0,
        h96: 125.0,
        h168: 125.0,
        unit: '°C',
      },
    },
    driftAnalysis: {
      initialValue: 10.0,
      finalValue: 10.8,
      totalDriftPercent: 8.0,
      driftRate: 0.0048,
      lotMedianDriftPercent: 12.1,
      relativeDrift: 0.66,
      driftCategory: 'STABLE',
      driftScore: 4,
      accelerationRate: 0.001,
    },
    anomalyMetrics: {
      anomalyScore: 5,
      isolationForestScore: 0.05,
      robustZScore: 0.18,
      madScore: 0.21,
      percentileRank: 42.1,
      failureRisk: 2,
      riskScore: 4,
    },
    status: 'NORMAL',
    traditionalScreening: 'PASS',
    aiScreening: 'NORMAL',
    isLatentDefect: false,
    flagReasons: [],
    aiAssessment: 'OPTIMAL STABILITY. COMPLIANT WITH AEROSPACE CLASS V FLIGHT REQ.',
    recommendedAction: 'Qualified for Flight Model (FM) Payload Integration.',
    testedDate: '2026-08-28 14:10 UTC',
    testFacility: 'ISRO Satellite Centre (URSC) Component Qualification Lab',
    waferLocation: 'Wafer #04 - Center Core',
  };
  components.push(landmarkC102);

  const landmarkC248: ComponentRecord = {
    id: 'C-248',
    lotId: 'LOT-2026-A17',
    componentType: 'High-Reliability Logic IC (RH-54HC245 Octal Bus Transceiver)',
    packageType: 'CERPACK-20 (MIL-PRF-38535 Class V)',
    parameters: {
      leakageCurrent: {
        h0: 10.4,
        h24: 11.2,
        h96: 12.4,
        h168: 13.6,
        unit: 'µA',
        specMin: 0,
        specMax: 50.0,
      },
      iddq: {
        h0: 0.35,
        h24: 0.37,
        h96: 0.39,
        h168: 0.41,
        unit: 'mA',
        specMin: 0,
        specMax: 1.2,
      },
      propDelay: {
        h0: 4.8,
        h24: 4.9,
        h96: 5.1,
        h168: 5.2,
        unit: 'ns',
        specMin: 2.0,
        specMax: 15.0,
      },
      temperature: {
        h0: 125.0,
        h24: 125.0,
        h96: 125.0,
        h168: 125.0,
        unit: '°C',
      },
    },
    driftAnalysis: {
      initialValue: 10.4,
      finalValue: 13.6,
      totalDriftPercent: 30.8,
      driftRate: 0.019,
      lotMedianDriftPercent: 12.1,
      relativeDrift: 2.54,
      driftCategory: 'LOW_DRIFT',
      driftScore: 32,
      accelerationRate: 0.008,
    },
    anomalyMetrics: {
      anomalyScore: 35,
      isolationForestScore: 0.34,
      robustZScore: 1.48,
      madScore: 1.62,
      percentileRank: 78.4,
      failureRisk: 14,
      riskScore: 32,
    },
    status: 'WATCH',
    traditionalScreening: 'PASS',
    aiScreening: 'WATCH',
    isLatentDefect: false,
    flagReasons: [
      'Minor leakage current drift (+30.8%) slightly above lot median.',
      'Slight threshold voltage shift within acceptable margin.',
    ],
    aiAssessment: 'MINOR DRIFT DETECTED. SUITABLE FOR GROUND / NON-CRITICAL SYSTEMS.',
    recommendedAction: 'Acceptable for Engineering Model (EM) or Ground Checkout Unit.',
    testedDate: '2026-08-28 14:15 UTC',
    testFacility: 'ISRO Satellite Centre (URSC) Component Qualification Lab',
    waferLocation: 'Wafer #04 - Mid Ring',
  };
  components.push(landmarkC248);

  const landmarkC891: ComponentRecord = {
    id: 'C-891',
    lotId: 'LOT-2026-A17',
    componentType: 'High-Reliability Logic IC (RH-54HC245 Octal Bus Transceiver)',
    packageType: 'CERPACK-20 (MIL-PRF-38535 Class V)',
    parameters: {
      leakageCurrent: {
        h0: 10.1,
        h24: 12.8,
        h96: 17.5,
        h168: 24.2,
        unit: 'µA',
        specMin: 0,
        specMax: 50.0,
      },
      iddq: {
        h0: 0.35,
        h24: 0.41,
        h96: 0.51,
        h168: 0.62,
        unit: 'mA',
        specMin: 0,
        specMax: 1.2,
      },
      propDelay: {
        h0: 4.8,
        h24: 5.1,
        h96: 5.7,
        h168: 6.4,
        unit: 'ns',
        specMin: 2.0,
        specMax: 15.0,
      },
      temperature: {
        h0: 125.0,
        h24: 125.0,
        h96: 125.0,
        h168: 125.0,
        unit: '°C',
      },
    },
    driftAnalysis: {
      initialValue: 10.1,
      finalValue: 24.2,
      totalDriftPercent: 139.6,
      driftRate: 0.084,
      lotMedianDriftPercent: 12.1,
      relativeDrift: 11.5,
      driftCategory: 'ABNORMAL_DRIFT',
      driftScore: 68,
      accelerationRate: 0.045,
    },
    anomalyMetrics: {
      anomalyScore: 72,
      isolationForestScore: 0.71,
      robustZScore: 2.95,
      madScore: 3.12,
      percentileRank: 91.8,
      failureRisk: 48,
      riskScore: 67,
    },
    status: 'SUSPICIOUS',
    traditionalScreening: 'PASS',
    aiScreening: 'SUSPICIOUS',
    isLatentDefect: true,
    flagReasons: [
      'Elevated leakage current drift (+139.6%) crossing 90th percentile threshold.',
      'Simultaneous multi-parameter degradation across Iddq and propagation delay.',
    ],
    aiAssessment: 'SUSPICIOUS LATENT PHENOMENON. ACCELERATED AGING PROFILE.',
    recommendedAction: 'Secondary screening with thermal cycling (-55°C to +125°C).',
    testedDate: '2026-08-28 14:22 UTC',
    testFacility: 'ISRO Satellite Centre (URSC) Component Qualification Lab',
    waferLocation: 'Wafer #04 - Outer Ring Sector 2',
  };
  components.push(landmarkC891);

  // Generate the rest of the 10,482 components with exact distribution targets:
  // Normal: ~9,612 (~91.7%)
  // Watch: ~542 (~5.2%)
  // Suspicious: ~247 (~2.3%)
  // High-Risk: ~81 (~0.8%)
  const counts = {
    NORMAL: 9612 - 1, // minus landmarkC102
    WATCH: 542 - 1, // minus landmarkC248
    SUSPICIOUS: 247 - 2, // minus landmarkC1922, landmarkC891
    'HIGH-RISK': 81 - 2, // minus landmarkC1045, landmarkC0832
  };

  const statusesToGen: ComponentStatus[] = [];
  for (let i = 0; i < counts['HIGH-RISK']; i++) statusesToGen.push('HIGH-RISK');
  for (let i = 0; i < counts.SUSPICIOUS; i++) statusesToGen.push('SUSPICIOUS');
  for (let i = 0; i < counts.WATCH; i++) statusesToGen.push('WATCH');
  for (let i = 0; i < counts.NORMAL; i++) statusesToGen.push('NORMAL');

  // Shuffle deterministic
  for (let i = statusesToGen.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom() * (i + 1));
    [statusesToGen[i], statusesToGen[j]] = [statusesToGen[j], statusesToGen[i]];
  }

  const componentTypes = [
    'RH-54HC245 Octal Bus Transceiver',
    'RH-OP27AZ Precision Operational Amplifier',
    'UT54ACS164245 Space-Grade Bus Interface',
    'RH-LM117 Radiation-Hardened Voltage Regulator',
    'RH-54AC74 Dual D-Type Flip-Flop',
    'SpaceWire Physical Layer Transceiver ASIC',
    'RH-AD574A 12-Bit Fast Sampling ADC',
    'Rad-Hard FPGA Configuration PROM',
  ];

  const packages = [
    'CERPACK-20 (MIL-PRF-38535 Class V)',
    'CQFP-64 Hermetic Flatpack',
    'TO-99 Hermetic Can',
    'LCC-28 Ceramic Leadless Carrier',
    'FP-48 Gold-Plated Ceramic',
  ];

  let compCounter = 1;

  for (let i = 0; i < statusesToGen.length; i++) {
    while (
      compCounter === 1045 ||
      compCounter === 832 ||
      compCounter === 1922 ||
      compCounter === 102 ||
      compCounter === 248 ||
      compCounter === 891
    ) {
      compCounter++;
    }

    const id = `C-${compCounter.toString().padStart(4, '0')}`;
    compCounter++;

    const status = statusesToGen[i];
    const lotIndex = Math.floor(pseudoRandom() * allLotIds.length);
    const lotId = allLotIds[lotIndex];
    const compType = componentTypes[Math.floor(pseudoRandom() * componentTypes.length)];
    const pkg = packages[Math.floor(pseudoRandom() * packages.length)];

    let h0_leak = 9.2 + pseudoRandom() * 2.8;
    let h24_leak: number;
    let h96_leak: number;
    let h168_leak: number;
    let driftCat: DriftCategory = 'STABLE';
    let driftScore = 0;
    let anomalyScore = 0;
    let failureRisk = 0;
    let riskScore = 0;
    let isolationForestScore = 0;
    let robustZ = 0;
    let madScore = 0;
    let percentile = 50;
    let isLatent = false;
    let traditional: TraditionalStatus = 'PASS';
    const flagReasons: string[] = [];

    if (status === 'NORMAL') {
      // 10.0 -> 10.3 -> 10.5 -> 10.8 µA style (+5% to +14%)
      const driftFact = 1.05 + pseudoRandom() * 0.09;
      h24_leak = h0_leak * (1 + (driftFact - 1) * 0.25) + (pseudoRandom() - 0.5) * 0.1;
      h96_leak = h0_leak * (1 + (driftFact - 1) * 0.65) + (pseudoRandom() - 0.5) * 0.1;
      h168_leak = h0_leak * driftFact;
      driftCat = 'STABLE';
      driftScore = Math.floor(2 + pseudoRandom() * 18);
      anomalyScore = Math.floor(2 + pseudoRandom() * 22);
      failureRisk = Math.floor(1 + pseudoRandom() * 6);
      riskScore = Math.floor(2 + pseudoRandom() * 25);
      isolationForestScore = Number((0.02 + pseudoRandom() * 0.2).toFixed(3));
      robustZ = Number((0.1 + pseudoRandom() * 1.2).toFixed(2));
      madScore = Number((0.1 + pseudoRandom() * 1.3).toFixed(2));
      percentile = Number((10 + pseudoRandom() * 70).toFixed(1));
      traditional = 'PASS';
      isLatent = false;
    } else if (status === 'WATCH') {
      // +20% to +48% drift
      const driftFact = 1.2 + pseudoRandom() * 0.28;
      h24_leak = h0_leak * (1 + (driftFact - 1) * 0.28);
      h96_leak = h0_leak * (1 + (driftFact - 1) * 0.7);
      h168_leak = h0_leak * driftFact;
      driftCat = 'LOW_DRIFT';
      driftScore = Math.floor(30 + pseudoRandom() * 25);
      anomalyScore = Math.floor(32 + pseudoRandom() * 24);
      failureRisk = Math.floor(10 + pseudoRandom() * 20);
      riskScore = Math.floor(30 + pseudoRandom() * 26);
      isolationForestScore = Number((0.28 + pseudoRandom() * 0.25).toFixed(3));
      robustZ = Number((1.5 + pseudoRandom() * 0.9).toFixed(2));
      madScore = Number((1.6 + pseudoRandom() * 0.9).toFixed(2));
      percentile = Number((75 + pseudoRandom() * 14).toFixed(1));
      traditional = 'PASS';
      isLatent = false;
      flagReasons.push('Minor parameter drift rate slightly above lot population.');
    } else if (status === 'SUSPICIOUS') {
      // +60% to +170% drift, final reading 18 to 32 µA (<50 spec)
      const driftFact = 1.6 + pseudoRandom() * 1.1;
      h24_leak = h0_leak * (1 + (driftFact - 1) * 0.25);
      h96_leak = h0_leak * (1 + (driftFact - 1) * 0.62);
      h168_leak = Math.min(48.5, h0_leak * driftFact);
      driftCat = 'ABNORMAL_DRIFT';
      driftScore = Math.floor(62 + pseudoRandom() * 16);
      anomalyScore = Math.floor(65 + pseudoRandom() * 15);
      failureRisk = Math.floor(40 + pseudoRandom() * 28);
      riskScore = Math.floor(62 + pseudoRandom() * 16);
      isolationForestScore = Number((0.62 + pseudoRandom() * 0.17).toFixed(3));
      robustZ = Number((2.8 + pseudoRandom() * 1.4).toFixed(2));
      madScore = Number((3.0 + pseudoRandom() * 1.4).toFixed(2));
      percentile = Number((90 + pseudoRandom() * 6).toFixed(1));
      traditional = 'PASS';
      isLatent = true;
      flagReasons.push('Abnormal parameter drift rate (>3× lot standard deviation).');
      flagReasons.push('Elevated risk of long-term latency defect.');
    } else {
      // HIGH-RISK: +200% to +380% drift, final reading 35 to 48.8 µA (< 50 µA spec -> PASS in traditional, HIGH-RISK in AI!)
      const driftFact = 2.8 + pseudoRandom() * 1.2;
      h24_leak = h0_leak * (1 + (driftFact - 1) * 0.22);
      h96_leak = h0_leak * (1 + (driftFact - 1) * 0.58);
      h168_leak = Math.min(48.9, h0_leak * driftFact);
      driftCat = 'ACCELERATING_DRIFT';
      driftScore = Math.floor(82 + pseudoRandom() * 16);
      anomalyScore = Math.floor(85 + pseudoRandom() * 14);
      failureRisk = Math.floor(68 + pseudoRandom() * 28);
      riskScore = Math.floor(82 + pseudoRandom() * 17);
      isolationForestScore = Number((0.82 + pseudoRandom() * 0.16).toFixed(3));
      robustZ = Number((4.5 + pseudoRandom() * 2.2).toFixed(2));
      madScore = Number((4.8 + pseudoRandom() * 2.3).toFixed(2));
      percentile = Number((97.0 + pseudoRandom() * 2.9).toFixed(1));
      traditional = 'PASS'; // Remains within static spec <50µA!
      isLatent = true;
      flagReasons.push('Severe non-linear parameter drift over 168h ESS screening.');
      flagReasons.push('Anomalous temporal signature consistent with gate-oxide / junction breakdown.');
      flagReasons.push('Ensemble ML classified as critical outlier in multi-parameter feature space.');
    }

    // round points
    h0_leak = Number(h0_leak.toFixed(2));
    h24_leak = Number(h24_leak.toFixed(2));
    h96_leak = Number(h96_leak.toFixed(2));
    h168_leak = Number(h168_leak.toFixed(2));

    const totalDriftPct = Number((((h168_leak - h0_leak) / h0_leak) * 100).toFixed(1));
    const driftRate = Number(((h168_leak - h0_leak) / 168).toFixed(4));
    const accelRate = Number((((h168_leak - h96_leak) / 72) - ((h24_leak - h0_leak) / 24)).toFixed(4));

    // IDDQ (mA)
    const iddq0 = Number((0.32 + pseudoRandom() * 0.08).toFixed(3));
    const iddqFactor = 1 + (totalDriftPct / 100) * 0.4;
    const iddq168 = Number(Math.min(1.15, iddq0 * iddqFactor).toFixed(3));
    const iddq24 = Number((iddq0 + (iddq168 - iddq0) * 0.25).toFixed(3));
    const iddq96 = Number((iddq0 + (iddq168 - iddq0) * 0.65).toFixed(3));

    // Prop Delay (ns)
    const pd0 = Number((4.6 + pseudoRandom() * 0.6).toFixed(2));
    const pdFactor = 1 + (totalDriftPct / 100) * 0.2;
    const pd168 = Number(Math.min(14.2, pd0 * pdFactor).toFixed(2));
    const pd24 = Number((pd0 + (pd168 - pd0) * 0.25).toFixed(2));
    const pd96 = Number((pd0 + (pd168 - pd0) * 0.65).toFixed(2));

    const rec: ComponentRecord = {
      id,
      lotId,
      componentType: compType,
      packageType: pkg,
      parameters: {
        leakageCurrent: {
          h0: h0_leak,
          h24: h24_leak,
          h96: h96_leak,
          h168: h168_leak,
          unit: 'µA',
          specMin: 0,
          specMax: 50.0,
        },
        iddq: {
          h0: iddq0,
          h24: iddq24,
          h96: iddq96,
          h168: iddq168,
          unit: 'mA',
          specMin: 0,
          specMax: 1.2,
        },
        propDelay: {
          h0: pd0,
          h24: pd24,
          h96: pd96,
          h168: pd168,
          unit: 'ns',
          specMin: 2.0,
          specMax: 15.0,
        },
        temperature: {
          h0: Number((125 + (pseudoRandom() - 0.5) * 0.4).toFixed(1)),
          h24: Number((125 + (pseudoRandom() - 0.5) * 0.4).toFixed(1)),
          h96: Number((125 + (pseudoRandom() - 0.5) * 0.4).toFixed(1)),
          h168: Number((125 + (pseudoRandom() - 0.5) * 0.4).toFixed(1)),
          unit: '°C',
        },
      },
      driftAnalysis: {
        initialValue: h0_leak,
        finalValue: h168_leak,
        totalDriftPercent: totalDriftPct,
        driftRate,
        lotMedianDriftPercent: 12.1,
        relativeDrift: Number((totalDriftPct / 12.1).toFixed(1)),
        driftCategory: driftCat,
        driftScore,
        accelerationRate: accelRate,
      },
      anomalyMetrics: {
        anomalyScore,
        isolationForestScore,
        robustZScore: robustZ,
        madScore,
        percentileRank: percentile,
        failureRisk,
        riskScore,
      },
      status,
      traditionalScreening: traditional,
      aiScreening: status,
      isLatentDefect: isLatent,
      flagReasons,
      aiAssessment:
        status === 'HIGH-RISK'
          ? 'HIGH PROBABILITY OF ABNORMAL BEHAVIOR / LATENT DEFECT'
          : status === 'SUSPICIOUS'
          ? 'MODERATE ANOMALOUS DRIFT PATTERN DETECTED'
          : status === 'WATCH'
          ? 'BORDERLINE PARAMETER INSTABILITY'
          : 'BEHAVIOR CONSISTENT WITH NOMINAL LOT POPULATION',
      recommendedAction:
        status === 'HIGH-RISK'
          ? 'Quarantine and perform Destructive Physical Analysis (DPA).'
          : status === 'SUSPICIOUS'
          ? 'Perform secondary screening with 96h thermal cycling.'
          : status === 'WATCH'
          ? 'Continue monitoring and log telemetry.'
          : 'Qualified for Spacecraft Subsystem Flight Integration.',
      testedDate: '2026-08-28 12:00 UTC',
      testFacility: 'ISRO Satellite Centre (URSC) Component Qualification Lab',
      waferLocation: `Wafer #${(1 + Math.floor(pseudoRandom() * 8)).toString().padStart(2, '0')}`,
    };

    components.push(rec);
  }

  // Calculate per-lot summaries
  const lots: Record<string, LotSummary> = {};
  allLotIds.forEach((lId) => {
    const lotComps = components.filter((c) => c.lotId === lId);
    const total = lotComps.length || 1;
    const n = lotComps.filter((c) => c.status === 'NORMAL').length;
    const w = lotComps.filter((c) => c.status === 'WATCH').length;
    const s = lotComps.filter((c) => c.status === 'SUSPICIOUS').length;
    const hr = lotComps.filter((c) => c.status === 'HIGH-RISK').length;

    const h0s = lotComps.map((c) => c.parameters.leakageCurrent.h0);
    const h24s = lotComps.map((c) => c.parameters.leakageCurrent.h24);
    const h96s = lotComps.map((c) => c.parameters.leakageCurrent.h96);
    const h168s = lotComps.map((c) => c.parameters.leakageCurrent.h168);

    const m0 = calculateMean(h0s);
    const m24 = calculateMean(h24s);
    const m96 = calculateMean(h96s);
    const m168 = calculateMean(h168s);

    const med0 = calculateMedian(h0s);
    const med24 = calculateMedian(h24s);
    const med96 = calculateMedian(h96s);
    const med168 = calculateMedian(h168s);

    lots[lId] = {
      lotId: lId,
      lotName: `Aerospace Qualification Lot ${lId.replace('LOT-2026-', '')}`,
      partNumber: 'RH-54HC245-SPACE-V',
      totalComponents: total,
      normalCount: n,
      watchCount: w,
      suspiciousCount: s,
      highRiskCount: hr,
      healthyPercentage: Number(((n / total) * 100).toFixed(1)),
      watchPercentage: Number(((w / total) * 100).toFixed(1)),
      suspiciousPercentage: Number(((s / total) * 100).toFixed(1)),
      highRiskPercentage: Number(((hr / total) * 100).toFixed(1)),
      waferBatch: `WF-2026-${lId.slice(-3)}`,
      manufactureDate: '2026-06-15',
      screeningStartDate: '2026-08-20',
      screeningEndDate: '2026-08-28',
      facility: 'ISRO Satellite Centre (URSC) Component Qualification Facility',
      baseline: {
        leakage: {
          mean: { h0: m0, h24: m24, h96: m96, h168: m168 },
          median: { h0: med0, h24: med24, h96: med96, h168: med168 },
          stdDev: {
            h0: calculateStdDev(h0s, m0),
            h24: calculateStdDev(h24s, m24),
            h96: calculateStdDev(h96s, m96),
            h168: calculateStdDev(h168s, m168),
          },
          mad: {
            h0: calculateMAD(h0s, med0),
            h24: calculateMAD(h24s, med24),
            h96: calculateMAD(h96s, med96),
            h168: calculateMAD(h168s, med168),
          },
          p90: {
            h0: calculatePercentile(h0s, 90),
            h24: calculatePercentile(h24s, 90),
            h96: calculatePercentile(h96s, 90),
            h168: calculatePercentile(h168s, 90),
          },
        },
        iddq: {
          mean: { h0: 0.35, h24: 0.36, h96: 0.37, h168: 0.38 },
          median: { h0: 0.35, h24: 0.36, h96: 0.37, h168: 0.38 },
          stdDev: { h0: 0.02, h24: 0.02, h96: 0.03, h168: 0.04 },
        },
        propDelay: {
          mean: { h0: 4.85, h24: 4.92, h96: 5.01, h168: 5.08 },
          median: { h0: 4.84, h24: 4.91, h96: 5.0, h168: 5.06 },
          stdDev: { h0: 0.22, h24: 0.24, h96: 0.28, h168: 0.32 },
        },
      },
    };
  });

  // Global aggregate stats
  const globalStats: GlobalDashboardStats = {
    totalComponents: components.length,
    normalCount: 9612,
    watchCount: 542,
    suspiciousCount: 247,
    highRiskCount: 81,
    lotsAnalyzed: 36,
    healthyPercentage: 91.7,
    watchPercentage: 5.2,
    suspiciousPercentage: 2.3,
    highRiskPercentage: 0.8,
    latentDefectsCount: 81 + 247,
    criticalAlertComponent: landmarkC1045,
  };

  // AI Models Performance Benchmark Data
  const models: ModelMetricData[] = [
    {
      modelId: 'isolation-forest',
      name: 'Isolation Forest (Dynamic Ensemble)',
      type: 'Tree-based Multi-Dimensional Outlier Partitioning',
      precision: 94.2,
      recall: 91.5,
      f1: 92.8,
      falsePositiveRate: 2.8,
      falseNegativeRate: 8.5,
      rocAuc: 0.974,
      isProduction: true,
      description:
        'Fast randomized decision trees partitioning time-series drift rate, curvature, and relative lot distance.',
      trainingTimeMs: 420,
      inferenceSpeedSamplesSec: 48500,
      confusionMatrix: {
        trueNegative: 9540,
        falsePositive: 72,
        falseNegative: 28,
        truePositive: 300,
      },
    },
    {
      modelId: 'autoencoder',
      name: 'Deep Temporal Autoencoder (LSTM/1D-CNN)',
      type: 'Neural Reconstruction Error Anomaly Detector',
      precision: 96.1,
      recall: 93.4,
      f1: 94.7,
      falsePositiveRate: 1.9,
      falseNegativeRate: 6.6,
      rocAuc: 0.988,
      isProduction: false,
      description:
        'Reconstructs multi-parameter 0h-168h trajectory sequences. High reconstruction error flags non-linear degradation.',
      trainingTimeMs: 3450,
      inferenceSpeedSamplesSec: 14200,
      confusionMatrix: {
        trueNegative: 9585,
        falsePositive: 48,
        falseNegative: 22,
        truePositive: 306,
      },
    },
    {
      modelId: 'robust-stats',
      name: 'Robust Statistical Model (MAD / Robust Z)',
      type: 'Modified Z-Score with Median Absolute Deviation',
      precision: 89.4,
      recall: 87.1,
      f1: 88.2,
      falsePositiveRate: 4.8,
      falseNegativeRate: 12.9,
      rocAuc: 0.932,
      isProduction: false,
      description:
        'Resistant to population outliers using median and MAD to compute dynamic lot sigma envelopes.',
      trainingTimeMs: 45,
      inferenceSpeedSamplesSec: 120000,
      confusionMatrix: {
        trueNegative: 9470,
        falsePositive: 142,
        falseNegative: 42,
        truePositive: 286,
      },
    },
    {
      modelId: 'lof',
      name: 'Local Outlier Factor (LOF)',
      type: 'Density-based Spatial Clustering of Parameter Trajectories',
      precision: 91.2,
      recall: 89.0,
      f1: 90.1,
      falsePositiveRate: 3.6,
      falseNegativeRate: 11.0,
      rocAuc: 0.951,
      isProduction: false,
      description:
        'Identifies localized isolation in multi-dimensional space (leakage vs iddq vs delay).',
      trainingTimeMs: 890,
      inferenceSpeedSamplesSec: 28000,
      confusionMatrix: {
        trueNegative: 9510,
        falsePositive: 102,
        falseNegative: 36,
        truePositive: 292,
      },
    },
  ];

  return { components, lots, globalStats, models };
}

// Singleton Cache
let datasetCache: ReturnType<typeof generateDataset> | null = null;
export function getDataset() {
  if (!datasetCache) {
    datasetCache = generateDataset();
  }
  return datasetCache;
}

export function generateAllSyntheticData() {
  const { components, lots, globalStats } = getDataset();
  const criticalComponent =
    components.find((c) => c.id === 'C-1045') || components[0];
  return {
    stats: globalStats,
    lots,
    components,
    criticalComponent,
  };
}

