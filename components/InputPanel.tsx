import React, { useState } from 'react';
import { CalculationParams } from '../types';

interface InputPanelProps {
  values: CalculationParams;
  onChange: (newValues: CalculationParams) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ values, onChange }) => {
  const [showCohenCalc, setShowCohenCalc] = useState(false);
  const [cohenMeans, setCohenMeans] = useState({ m1: 0, m2: 0, sd: 1 });

  const handleChange = (field: keyof CalculationParams, value: number | boolean) => {
    onChange({ ...values, [field]: value });
  };

  const calculateCohen = () => {
    const diff = Math.abs(cohenMeans.m1 - cohenMeans.m2);
    // Assuming pooled SD is roughly the entered SD, but here we just calculate the numerator (Raw Effect)
    // Or if we want Standardized Effect Size (Cohen's d), input expects Raw Effect usually if SD is separate.
    // However, standard sample size formulas use (Delta / Sigma). 
    // If the user inputs "Effect Size" as Cohen's d, they should set SD to 1.
    // If they input Raw Difference, they set SD to actual SD.
    // Let's assume the input 'effectSize' is the Raw Difference (Delta).
    
    handleChange('effectSize', parseFloat(diff.toFixed(4)));
    if (cohenMeans.sd > 0) handleChange('stdDev', cohenMeans.sd);
    setShowCohenCalc(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Parameters
      </h2>

      <div className="space-y-6">
        {/* Effect Size */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
            <span>Min. Detectable Effect (Δ)</span>
            <button 
                onClick={() => setShowCohenCalc(!showCohenCalc)}
                className="text-xs text-primary hover:underline"
            >
                Calculate from means
            </button>
          </label>
          
          {showCohenCalc && (
             <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                 <div className="grid grid-cols-2 gap-2 mb-2">
                     <div>
                         <label className="text-xs text-slate-500">Mean 1</label>
                         <input type="number" value={cohenMeans.m1} onChange={e => setCohenMeans({...cohenMeans, m1: parseFloat(e.target.value)})} className="w-full p-1 border rounded" />
                     </div>
                     <div>
                         <label className="text-xs text-slate-500">Mean 2</label>
                         <input type="number" value={cohenMeans.m2} onChange={e => setCohenMeans({...cohenMeans, m2: parseFloat(e.target.value)})} className="w-full p-1 border rounded" />
                     </div>
                 </div>
                 <button onClick={calculateCohen} className="w-full bg-secondary text-white text-xs py-1 rounded hover:bg-slate-600">Apply Difference</button>
             </div>
          )}

          <input
            type="number"
            step="0.01"
            value={values.effectSize}
            onChange={(e) => handleChange('effectSize', parseFloat(e.target.value))}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
          <p className="text-xs text-slate-500 mt-1">The smallest difference you want to detect.</p>
        </div>

        {/* Standard Deviation */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Standard Deviation (σ)</label>
          <input
            type="number"
            step="0.1"
            min="0.0001"
            value={values.stdDev}
            onChange={(e) => handleChange('stdDev', parseFloat(e.target.value))}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <p className="text-xs text-slate-500 mt-1">Variability in your data.</p>
        </div>

        {/* Power */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Statistical Power (1 - β)</label>
          <div className="flex gap-2 mb-2">
            {[0.8, 0.9, 0.95].map(val => (
                <button 
                    key={val}
                    onClick={() => handleChange('power', val)}
                    className={`text-xs px-3 py-1 rounded-full border ${values.power === val ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-primary'}`}
                >
                    {val * 100}%
                </button>
            ))}
          </div>
          <input
            type="range"
            min="0.5"
            max="0.99"
            step="0.01"
            value={values.power}
            onChange={(e) => handleChange('power', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="text-right text-sm font-semibold text-primary">{(values.power * 100).toFixed(0)}%</div>
        </div>

        {/* Significance */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Significance Level (α)</label>
           <select 
             value={values.alpha}
             onChange={(e) => handleChange('alpha', parseFloat(e.target.value))}
             className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-primary outline-none"
           >
               <option value={0.01}>0.01 (1%)</option>
               <option value={0.05}>0.05 (5%) - Standard</option>
               <option value={0.10}>0.10 (10%)</option>
           </select>
        </div>

        {/* Advanced Settings */}
        <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Advanced</h3>
            
            <div className="flex items-center justify-between mb-4">
                <label className="text-sm text-slate-700">Two-sided Test?</label>
                <div 
                    onClick={() => handleChange('isTwoSided', !values.isTwoSided)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${values.isTwoSided ? 'bg-primary' : 'bg-slate-300'}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${values.isTwoSided ? 'translate-x-6' : ''}`}></div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Allocation Ratio (Group 2 / Group 1)</label>
                <input 
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={values.allocationRatio}
                    onChange={(e) => handleChange('allocationRatio', parseFloat(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-md"
                />
            </div>
        </div>
      </div>
    </div>
  );
};
