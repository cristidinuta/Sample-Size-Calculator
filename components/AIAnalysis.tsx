import React, { useState } from 'react';
import { CalculationParams, CalculationResult } from '../types';
import { getStatsInsight } from '../services/geminiService';

interface AIAnalysisProps {
    params: CalculationParams;
    result: CalculationResult;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ params, result }) => {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAskAI = async () => {
        setLoading(true);
        const text = await getStatsInsight(params, result);
        setInsight(text);
        setLoading(false);
    };

    return (
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-indigo-900">AI Statistician</h3>
                        <p className="text-xs text-indigo-700">Powered by Gemini 2.5 Flash</p>
                    </div>
                </div>
                {!insight && !loading && (
                    <button 
                        onClick={handleAskAI}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                        <span>Analyze Results</span>
                    </button>
                )}
            </div>

            {loading && (
                <div className="mt-4 space-y-2 animate-pulse">
                    <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                    <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
                </div>
            )}

            {insight && (
                <div className="mt-4 text-sm text-slate-800 prose prose-indigo max-w-none bg-white p-4 rounded-lg border border-indigo-100/50 shadow-sm">
                   <div dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                   <button 
                    onClick={() => setInsight(null)}
                    className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                   >
                       Close analysis
                   </button>
                </div>
            )}
        </div>
    );
};
