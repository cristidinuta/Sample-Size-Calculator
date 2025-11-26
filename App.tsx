import React, { useState, useMemo } from 'react';
import { InputPanel } from './components/InputPanel';
import { Chart } from './components/Chart';
import { AIAnalysis } from './components/AIAnalysis';
import { CalculationParams } from './types';
import { calculateSampleSize, generateCurveData } from './services/statsService';

const App: React.FC = () => {
  const [params, setParams] = useState<CalculationParams>({
    effectSize: 0.5,
    stdDev: 1.0,
    alpha: 0.05,
    power: 0.8,
    isTwoSided: true,
    allocationRatio: 1.0,
  });

  const result = useMemo(() => calculateSampleSize(params), [params]);
  const curveData = useMemo(() => generateCurveData(params), [params]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sample Size <span className="text-primary">Calculator</span>
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Interactive sample size calculator for experimental design
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input */}
        <div className="lg:col-span-4">
          <InputPanel values={params} onChange={setParams} />
          
          {/* Educational Note */}
          <div className="mt-6 p-5 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-sm">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Why Power Matters
              </h4>
              <p className="mb-2">
                  <strong>Power (1-β)</strong> is the probability of correctly rejecting the null hypothesis when a true difference exists.
              </p>
              <p>
                  Low power (e.g., 50%) means your experiment is a coin flip even if your treatment works. Aim for 80% or higher.
              </p>
          </div>
        </div>

        {/* Right Column: Results & Viz */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="h-16 w-16 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    </div>
                    <p className="text-sm text-slate-500 font-medium uppercase">Total Sample Size</p>
                    <p className="text-4xl font-bold text-slate-900 mt-1">{result.totalN.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">Participants required</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-500 font-medium uppercase">Per Group</p>
                    <div className="flex justify-between items-end mt-2">
                        <div>
                            <span className="text-xs text-slate-400">Group 1</span>
                            <div className="text-2xl font-bold text-slate-800">{result.n1.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-slate-400">Group 2</span>
                            <div className="text-2xl font-bold text-slate-800">{result.n2.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-500 font-medium uppercase">Critical Values (Z)</p>
                    <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Z<sub>α{params.isTwoSided ? '/2' : ''}</sub></span>
                            <span className="font-mono font-semibold">{result.criticalValueAlpha}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Z<sub>β</sub></span>
                            <span className="font-mono font-semibold">{result.criticalValueBeta}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visualization */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Sensitivity Analysis</h3>
                <p className="text-sm text-slate-500 mb-4">How sample size changes if your effect size estimate is incorrect.</p>
                <Chart data={curveData} currentEffectSize={params.effectSize} currentTotalN={result.totalN} />
            </div>

            {/* AI Section */}
            <AIAnalysis params={params} result={result} />

        </div>
      </main>
    </div>
  );
};

export default App;