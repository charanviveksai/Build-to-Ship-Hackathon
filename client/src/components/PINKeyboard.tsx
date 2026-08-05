import React, { useState } from 'react';
import { Delete, Lock } from 'lucide-react';

interface PINKeyboardProps {
  pinLength?: number;
  onComplete: (pin: string) => void;
  error?: string | null;
}

export const PINKeyboard: React.FC<PINKeyboardProps> = ({ pinLength = 4, onComplete, error }) => {
  const [pin, setPin] = useState<string>('');

  const handleDigit = (digit: string) => {
    if (pin.length < pinLength) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === pinLength) {
        onComplete(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => setPin('');

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs mx-auto">
      {/* PIN Dots Indicator */}
      <div className="flex items-center justify-center gap-4 py-2">
        {Array.from({ length: pinLength }).map((_, idx) => {
          const filled = idx < pin.length;
          return (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                filled
                  ? 'bg-cyan-400 border-cyan-300 shadow-lg shadow-cyan-400/50 scale-110'
                  : 'bg-slate-900 border-slate-700'
              }`}
            />
          );
        })}
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-500/30 animate-shake">
          {error}
        </p>
      )}

      {/* Number Grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleDigit(num)}
            className="h-14 rounded-2xl bg-slate-900/90 border border-slate-800 text-xl font-bold font-mono text-slate-100 hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:text-cyan-300 active:scale-95 transition-all shadow-md flex items-center justify-center"
          >
            {num}
          </button>
        ))}

        <button
          type="button"
          onClick={handleClear}
          className="h-14 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="h-14 rounded-2xl bg-slate-900/90 border border-slate-800 text-xl font-bold font-mono text-slate-100 hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:text-cyan-300 active:scale-95 transition-all shadow-md flex items-center justify-center"
        >
          0
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="h-14 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
