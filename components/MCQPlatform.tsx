import React, { useMemo, useState } from 'react';
import { MCQQuestion, MCQSubject } from '../types';
import { generateInteractiveMcqs } from '../services/mcqService';

const SUBJECT_LABELS: Record<MCQSubject, string> = {
  physics: 'භෞතික විද්‍යාව',
  chemistry: 'රසායන විද්‍යාව'
};

const MCQPlatform: React.FC = () => {
  const [subject, setSubject] = useState<MCQSubject>('physics');
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [sourceText, setSourceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!submitted || questions.length === 0) return 0;
    return questions.reduce((acc, question) => {
      return acc + (answers[question.id] === question.correctOptionIndex ? 1 : 0);
    }, 0);
  }, [submitted, questions, answers]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSubmitted(false);
    setAnswers({});

    try {
      const generated = await generateInteractiveMcqs({
        subject,
        questionCount,
        difficulty,
        sourceText,
      });
      setQuestions(generated);
    } catch (err) {
      console.error(err);
      setError('MCQ ජනනය කිරීම අසාර්ථක විය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sinhala MCQ Studio</h2>
            <p className="text-sm text-slate-500 mt-1">සිංහල A/L භෞතික විද්‍යාව සහ රසායන විද්‍යාව පසුගිය ප්‍රශ්න පත්‍රවලින් අන්තර්ක්‍රියාකාරී MCQ සාදන්න.</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold py-2.5 px-5 rounded-xl transition"
          >
            {loading ? 'Generating...' : 'Generate MCQs'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <label className="block text-sm font-medium text-slate-700">
            Subject
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as MCQSubject)}
              className="mt-1.5 w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="physics">{SUBJECT_LABELS.physics}</option>
              <option value="chemistry">{SUBJECT_LABELS.chemistry}</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Difficulty
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="mt-1.5 w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Number of Questions
            <input
              type="number"
              min={5}
              max={30}
              value={questionCount}
              onChange={(e) => setQuestionCount(Math.max(5, Math.min(30, Number(e.target.value) || 10)))}
              className="mt-1.5 w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700 mt-4">
          Paste paper/exam content (optional but recommended)
          <textarea
            rows={6}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Paste Sinhala paper text, chapter notes, or model paper questions..."
            className="mt-1.5 w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </section>

      {questions.length > 0 && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <h3 className="font-bold text-slate-800">Interactive Quiz</h3>
            {submitted && (
              <span className="text-sm font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                Score: {score} / {questions.length}
              </span>
            )}
          </div>

          {questions.map((question, qIndex) => (
            <article key={question.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="font-semibold text-slate-800">
                {qIndex + 1}. {question.question}
              </p>
              <div className="grid gap-2 mt-3">
                {question.options.map((option, oIndex) => {
                  const selected = answers[question.id] === oIndex;
                  const correct = question.correctOptionIndex === oIndex;
                  const shouldHighlight = submitted && (correct || selected);

                  return (
                    <button
                      key={`${question.id}-${oIndex}`}
                      onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: oIndex }))}
                      disabled={submitted}
                      className={`text-left px-3 py-2 rounded-lg border transition ${
                        shouldHighlight
                          ? correct
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : 'border-red-400 bg-red-50 text-red-800'
                          : selected
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + oIndex)}. {option}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-3 text-sm text-slate-600">
                  <span className="font-semibold">Explanation:</span> {question.explanation}
                </p>
              )}
            </article>
          ))}

          <div className="flex gap-3">
            <button
              onClick={() => setSubmitted(true)}
              disabled={submitted}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-semibold py-2.5 px-5 rounded-xl"
            >
              Submit Quiz
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-5 rounded-xl"
            >
              Reset Answers
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default MCQPlatform;
