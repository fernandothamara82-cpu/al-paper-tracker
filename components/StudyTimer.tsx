
import React, { useState, useEffect, useCallback } from 'react';

type TimerMode = 'study' | 'break';

const StudyTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customMins, setCustomMins] = useState('25');

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    const mins = newMode === 'study' ? 25 : 5;
    setTimeLeft(mins * 60);
    setTotalSeconds(mins * 60);
    setIsActive(false);
    setCustomMins(mins.toString());
  }, []);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const nextMode = mode === 'study' ? 'break' : 'study';
      alert(`${mode === 'study' ? 'Focus session' : 'Break'} complete! Ready to switch?`);
      switchMode(nextMode);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, switchMode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalSeconds);
  };

  const setDuration = (mins: number) => {
    setIsActive(false);
    setIsCustomizing(false);
    const total = Math.max(1, mins) * 60;
    setTimeLeft(total);
    setTotalSeconds(total);
    setCustomMins(mins.toString());
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMins);
    if (!isNaN(val) && val > 0) {
      setDuration(val);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <i className={`fa-solid ${mode === 'study' ? 'fa-brain text-indigo-500' : 'fa-mug-hot text-emerald-500'}`}></i>
          {mode === 'study' ? 'Focus Session' : 'Break Time'}
        </h3>
        <div className="flex gap-1">
          <button 
            onClick={() => switchMode('study')}
            className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${mode === 'study' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            FOCUS
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${mode === 'break' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            BREAK
          </button>
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="text-5xl font-black text-slate-800 font-mono mb-6 tracking-tighter">
          {formatTime(timeLeft)}
        </div>

        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
          <div 
            className={`h-full transition-all duration-1000 ${mode === 'study' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              isActive 
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
              : mode === 'study' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'
            }`}
          >
            <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
            {isActive ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={resetTimer}
            className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
            title="Reset Timer"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <div className="mt-6 w-full">
          {isCustomizing ? (
            <form onSubmit={handleApplyCustom} className="flex gap-2">
              <input
                type="number"
                value={customMins}
                onChange={(e) => setCustomMins(e.target.value)}
                autoFocus
                className="flex-1 px-3 py-1.5 border-2 border-indigo-200 rounded-lg text-sm text-slate-700 font-bold focus:border-indigo-500 outline-none bg-indigo-50/30"
                placeholder="Mins"
              />
              <button 
                type="submit"
                className="bg-indigo-600 text-white px-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <i className="fa-solid fa-check"></i>
              </button>
              <button 
                type="button"
                onClick={() => setIsCustomizing(false)}
                className="bg-slate-100 text-slate-500 px-3 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 60].map(m => (
                <button
                  key={m}
                  onClick={() => setDuration(m)}
                  className="text-[10px] font-bold py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors bg-white shadow-sm"
                >
                  {m}m
                </button>
              ))}
              <button
                onClick={() => setIsCustomizing(true)}
                className="text-[10px] font-bold py-1.5 border border-dashed border-slate-300 rounded-lg text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
              >
                <i className="fa-solid fa-pen-to-square mr-1"></i>
                Set
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
