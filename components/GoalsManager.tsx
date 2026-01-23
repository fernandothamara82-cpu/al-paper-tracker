
import React, { useState } from 'react';
import { SubjectId, SUBJECT_METADATA, DayEntry, StudyGoal } from '../types';

interface GoalsManagerProps {
  entries: DayEntry[];
  goals: StudyGoal[];
  onAddGoal: (goal: StudyGoal) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalsManager: React.FC<GoalsManagerProps> = ({ entries, goals, onAddGoal, onDeleteGoal }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<StudyGoal, 'id'>>({
    subject: 'maths',
    target: 5,
    period: 'weekly'
  });

  const calculateProgress = (goal: StudyGoal) => {
    const now = new Date();
    const daysToLookBack = goal.period === 'weekly' ? 7 : 30;
    const cutoffDate = new Date(now.setDate(now.getDate() - daysToLookBack)).toISOString().split('T')[0];

    const relevantEntries = entries.filter(e => e.date >= cutoffDate);
    
    return relevantEntries.reduce((total, entry) => {
      const subjData = entry.papers[goal.subject];
      // Sum all sub-categories for the subject
      const sum = Object.values(subjData).reduce((a, b) => a + b, 0);
      return total + sum;
    }, 0);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGoal({
      ...newGoal,
      id: Date.now().toString()
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Study Targets</h2>
          <p className="text-sm text-slate-500">Set goals for papers completed per week or month</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
        >
          <i className={`fa-solid ${showAddForm ? 'fa-xmark' : 'fa-plus'}`}></i>
          {showAddForm ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subject</label>
              <select 
                value={newGoal.subject}
                onChange={(e) => setNewGoal({...newGoal, subject: e.target.value as SubjectId})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
              >
                {Object.values(SUBJECT_METADATA).map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Target Papers</label>
              <input 
                type="number"
                min="1"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 1})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Period</label>
              <select 
                value={newGoal.period}
                onChange={(e) => setNewGoal({...newGoal, period: e.target.value as 'weekly' | 'monthly'})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-4 w-full bg-indigo-600 text-white font-bold py-2 rounded-xl hover:bg-indigo-700 transition-all">
            Add Goal
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <i className="fa-solid fa-bullseye text-4xl text-slate-200 mb-3"></i>
            <p className="text-slate-400 font-medium">No goals set yet. Aim high!</p>
          </div>
        ) : (
          goals.map(goal => {
            const meta = SUBJECT_METADATA[goal.subject];
            const current = calculateProgress(goal);
            const percent = Math.min(100, Math.round((current / goal.target) * 100));
            const isCompleted = current >= goal.target;

            return (
              <div key={goal.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-indigo-200 transition-all">
                <button 
                  onClick={() => onDeleteGoal(goal.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <i className="fa-solid fa-trash-can text-sm"></i>
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-${meta.color}-50 text-${meta.color}-600`}>
                    <i className={`fa-solid ${meta.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{meta.label} Target</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{goal.period}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-slate-800">
                      {current}<span className="text-slate-300 text-lg font-bold mx-1">/</span>{goal.target}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {isCompleted ? 'Goal Met!' : `${percent}%`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : `bg-${meta.color}-500`}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    {isCompleted 
                      ? "Fantastic work! You've reached your target." 
                      : `Do ${goal.target - current} more papers to reach your ${goal.period} goal.`
                    }
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalsManager;
