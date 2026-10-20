import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Volume2, ChevronDown } from 'lucide-react';

export const Route = createFileRoute('/particles')({
  component: ParticlesPage,
});

interface ParticleItem {
  id: number;
  particle: string;
  meaning: string;
  description: string;
  formation?: string;
  exampleSentenceJp?: string;
  exampleSentenceEn?: string;
}

function ParticlesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const { data: particles = [], isLoading } = useQuery({
    queryKey: ['particles'],
    queryFn: async () => {
      const res = await api.get('/api/particles');
      return (res.data || []) as ParticleItem[];
    },
  });

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[var(--border-sakura)] space-y-2">
        <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
          <span>🌸 Essential JLPT N5 Grammar</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
          Japanese Particles Guide <span className="text-xl font-normal text-rose-500 font-japanese">助詞</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Master the grammar building blocks of Japanese sentences with formation rules and audio examples.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--text-muted)] animate-pulse">
          Loading particle catalog...
        </div>
      ) : (
        <div className="space-y-4">
          {particles.map((p, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={p.id}
                className="sakura-card rounded-3xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-2xl font-black font-japanese shadow-md shadow-rose-500/20">
                      {p.particle.split(' ')?.[0] || p.particle}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-main)]">
                        {p.particle}
                      </h3>
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {p.meaning}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-rose-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-2 border-t border-[var(--border-sakura)] space-y-4 text-xs">
                    <div>
                      <span className="font-bold text-gray-500 uppercase text-[10px] block mb-1">
                        Grammar Function & Usage
                      </span>
                      <p className="text-[var(--text-main)] leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    {p.formation && (
                      <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-sakura)]">
                        <span className="font-bold text-rose-600 dark:text-rose-400 uppercase text-[10px] block mb-0.5">
                          Formation Rule
                        </span>
                        <code className="text-xs font-semibold text-[var(--text-main)]">
                          {p.formation}
                        </code>
                      </div>
                    )}

                    {(p.exampleSentenceJp || p.exampleSentenceEn) && (
                      <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-[var(--border-sakura)] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-600 dark:text-rose-400 uppercase text-[10px]">
                            Example Sentence
                          </span>
                          {p.exampleSentenceJp && (
                            <button
                              type="button"
                              onClick={() => speakText(p.exampleSentenceJp!)}
                              className="p-1 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                              title="Listen"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {p.exampleSentenceJp && (
                          <p className="text-sm font-bold text-[var(--text-main)] font-japanese">
                            {p.exampleSentenceJp}
                          </p>
                        )}
                        {p.exampleSentenceEn && (
                          <p className="text-xs text-[var(--text-muted)]">
                            {p.exampleSentenceEn}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
