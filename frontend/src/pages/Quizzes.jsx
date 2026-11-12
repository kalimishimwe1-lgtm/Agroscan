import { useState } from 'react';
import { quiz } from '../data/content';

export default function Quizzes() {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === quiz.answer;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Quick Check</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">Vocabulary Quiz</h1>

        <div className="mt-8">
          <p className="text-lg text-slate-600">{quiz.question}</p>
          <div className="mt-6 grid gap-3">
            {quiz.options.map((option) => {
              const isSelected = selected === option;
              const isAnswer = submitted && option === quiz.answer;
              const isWrong = submitted && isSelected && option !== quiz.answer;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    if (!submitted) setSelected(option);
                  }}
                  className={[
                    'rounded-2xl border px-4 py-3 text-left text-base font-medium transition',
                    isAnswer ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : '',
                    isWrong ? 'border-rose-400 bg-rose-50 text-rose-700' : '',
                    !submitted && isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50',
                  ].join(' ')}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              disabled={!selected}
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Check answer
            </button>

            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setSubmitted(false);
              }}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700"
            >
              Reset
            </button>
          </div>

          {submitted && (
            <div className={`mt-6 rounded-2xl border px-4 py-3 ${isCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
              {isCorrect ? 'Correct! Great job — “Muraho” means hello.' : `Not quite. The correct answer is “${quiz.answer}”.`}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

