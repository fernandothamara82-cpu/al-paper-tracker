
import React, { useState, useEffect } from 'react';
import { SubjectId, SUBJECT_METADATA, DayEntry, PaperCategories } from '../types';

interface DailyFormProps {
  selectedDate: string;
  initialData?: DayEntry;
  onSave: (entry: DayEntry) => void;
}

const DailyForm: React.FC<DailyFormProps> = ({ selectedDate, initialData, onSave }) => {
  const [papers, setPapers] = useState<PaperCategories>({
    physics: { mcq: 0, essay: 0 },
    chemistry: { mcq: 0, essay: 0 },
    maths: { pure: 0, applied: 0 }
  });

  useEffect(() => {
    if (initialData) {
      setPapers(initialData.papers);
    } else {
      setPapers({
        physics: { mcq: 0, essay: 0 },
        chemistry: { mcq: 0, essay: 0 },
        maths: { pure: 0, applied: 0 }
      });
    }
  }, [initialData, selectedDate]);

  const handleInputChange = (subject: SubjectId, sub: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setPapers(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [sub]: numValue
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: selectedDate,
      papers
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-calendar-day text-indigo-500"></i>
          Log for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(SUBJECT_METADATA) as SubjectId[]).map((subjId) => {
          const meta = SUBJECT_METADATA[subjId];
          return (
            <div key={subjId} className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <i className={`fa-solid ${meta.icon} text-${meta.color}-500`}></i>
                {meta.label}
              </div>
              <div className="grid grid-cols-1 gap-3">
                {meta.subCategories.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between">
                    <label className="text-sm text-slate-500">{sub.label}</label>
                    <input
                      type="number"
                      value={(papers[subjId] as any)[sub.id]}
                      onChange={(e) => handleInputChange(subjId, sub.id, e.target.value)}
                      className="w-16 px-2 py-1 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-center text-slate-900 font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-cloud-arrow-up"></i>
        Save Daily Progress
      </button>
    </form>
  );
};

export default DailyForm;
