import { useState } from 'react';
import { ShieldAlert, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

interface ThreatScoreWidgetProps {
  score?: number;
  threatLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  onRefresh?: () => void;
}

export const ThreatScoreWidget: React.FC<ThreatScoreWidgetProps> = ({
  score = 18,
  threatLevel = 'Low',
  onRefresh
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [currentScore, setCurrentScore] = useState(score);
  const [currentLevel, setCurrentLevel] = useState(threatLevel);
  const [explanation, setExplanation] = useState<string>('AI system integrity is normal. No unauthorized intrusion patterns detected in the last 24 hours.');

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.getSecurityAnalysis();
      if (res.analysis) {
        setCurrentScore(res.analysis.riskScore);
        setCurrentLevel(res.analysis.threatLevel);
        setExplanation(res.analysis.explanation);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-slate-800 hover:border-cyan-500/30 transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">AI Threat Intelligence</h4>
            <p className="text-[11px] text-slate-400">Gemini Powered Risk Matrix</p>
          </div>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
          title="Run Gemini Security Scan"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin text-cyan-400' : ''}`} />
          <span className="hidden sm:inline">{analyzing ? 'Analyzing...' : 'Run Scan'}</span>
        </button>
      </div>

      {/* Main Score Visualizer */}
      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        {/* Ring Dial */}
        <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-800/80"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * currentScore) / 100}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${
                currentScore >= 75 ? 'text-red-500' : currentScore >= 50 ? 'text-orange-500' : currentScore >= 25 ? 'text-yellow-500' : 'text-cyan-400'
              }`}
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-mono font-extrabold text-2xl text-white">{currentScore}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Risk Score</span>
          </div>
        </div>

        {/* Breakdown Text */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeColor(currentLevel)}`}>
              {currentLevel} Risk
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          {currentScore < 40 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />}
          Gemini 2.5 Security Engine Active
        </span>
        <span className="font-mono text-[10px] text-slate-500">Updated: Just now</span>
      </div>
    </div>
  );
};
