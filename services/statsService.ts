import { CalculationParams, CalculationResult, DataPoint } from '../types';

// Standard Normal Distribution Quantile Function (Probit) approximation
// We need this to convert Alpha/Power to Z-scores.
// Using Abramowitz and Stegun approximation or a simple lookup for standard values
function getZScore(p: number): number {
  // Approximation for inverse error function can be complex.
  // For this app, strict precision for standard alpha/beta is key, others can be approx.
  // Using a robust approximation for standard normal inverse CDF
  const a1 = -3.969683028665376e+01;
  const a2 = 2.209460984245205e+02;
  const a3 = -2.759285104469687e+02;
  const a4 = 1.383577518672690e+02;
  const a5 = -3.066479806614716e+01;
  const a6 = 2.506628277459239e+00;

  const b1 = -5.447609879822406e+01;
  const b2 = 1.615858368580409e+02;
  const b3 = -1.556989798598866e+02;
  const b4 = 6.680131188771972e+01;
  const b5 = -1.328068155288572e+01;

  const c1 = -7.784894002430293e-03;
  const c2 = -3.223964580411365e-01;
  const c3 = -2.400758277161838e+00;
  const c4 = -2.549732539343734e+00;
  const c5 = 4.374664141464968e+00;
  const c6 = 2.938163982698783e+00;

  const d1 = 7.784695709041462e-03;
  const d2 = 3.224671290700398e-01;
  const d3 = 2.445134137142996e+00;
  const d4 = 3.754408661907416e+00;

  const p_low = 0.02425;
  const p_high = 1 - p_low;

  let q: number, r: number;

  if (p < p_low) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
          ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }

  if (p > p_high) {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
          ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }

  q = p - 0.5;
  r = q * q;
  return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
}


export const calculateSampleSize = (params: CalculationParams): CalculationResult => {
  const { effectSize, stdDev, alpha, power, isTwoSided, allocationRatio } = params;

  if (effectSize === 0 || stdDev <= 0) {
    return { n1: 0, n2: 0, totalN: 0, criticalValueAlpha: 0, criticalValueBeta: 0 };
  }

  // 1. Critical Value for Significance (Z_alpha)
  // For 2-sided, we look at alpha/2. For 1-sided, just alpha.
  // We want the Z value that leaves alpha in the tail(s).
  // Inverse CDF of (1 - alpha/2) for 2-sided.
  const targetAlpha = isTwoSided ? alpha / 2 : alpha;
  const zAlpha = Math.abs(getZScore(1 - targetAlpha));

  // 2. Critical Value for Power (Z_beta)
  // Power = 1 - beta. Beta = 1 - Power.
  // We want Z that leaves Beta in the tail.
  const zBeta = Math.abs(getZScore(power));

  // 3. Calculation
  // Formula: n1 = (zAlpha + zBeta)^2 * sigma^2 * (1 + 1/k) / delta^2
  // Where k = allocationRatio = n2/n1
  const numerator = Math.pow(zAlpha + zBeta, 2) * Math.pow(stdDev, 2);
  const ratioFactor = 1 + (1 / allocationRatio);
  const denominator = Math.pow(effectSize, 2);

  const n1Exact = (numerator * ratioFactor) / denominator;
  const n2Exact = n1Exact * allocationRatio;

  return {
    n1: Math.ceil(n1Exact),
    n2: Math.ceil(n2Exact),
    totalN: Math.ceil(n1Exact) + Math.ceil(n2Exact),
    criticalValueAlpha: parseFloat(zAlpha.toFixed(3)),
    criticalValueBeta: parseFloat(zBeta.toFixed(3)),
  };
};

export const generateCurveData = (params: CalculationParams): DataPoint[] => {
    const { effectSize } = params;
    const data: DataPoint[] = [];
    
    if (effectSize === 0) return data;

    // Generate points from 0.5x to 2.0x of current effect size
    const steps = 20;
    const range = effectSize * 1.5; 
    const start = Math.max(0.01, effectSize - (range/2)); // Avoid 0 or negative if possible, though negative effect size just mirrors
    const end = effectSize + range;
    
    // If effect size is small (e.g. 0.1), we want a tight range.
    // Let's create a dynamic range around the pivot.
    
    const minES = Math.abs(effectSize) * 0.2;
    const maxES = Math.abs(effectSize) * 2.5;
    const stepSize = (maxES - minES) / steps;

    for (let i = 0; i <= steps; i++) {
        const es = minES + (i * stepSize);
        const res = calculateSampleSize({ ...params, effectSize: es });
        data.push({
            effectSize: parseFloat(es.toFixed(3)),
            sampleSize: res.totalN
        });
    }
    
    return data;
};
