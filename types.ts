export interface CalculationParams {
  effectSize: number;
  stdDev: number;
  alpha: number;
  power: number;
  isTwoSided: boolean;
  allocationRatio: number; // n2 / n1
}

export interface CalculationResult {
  n1: number;
  n2: number;
  totalN: number;
  criticalValueAlpha: number;
  criticalValueBeta: number;
}

export interface DataPoint {
  effectSize: number;
  sampleSize: number;
}
