import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tos')({
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
        Terms of Service
      </h1>
      <p className="text-xs text-[var(--text-muted)]">
        Last updated: October 2026
      </p>

      <div className="sakura-card rounded-3xl p-8 space-y-4 text-xs leading-relaxed text-[var(--text-main)]">
        <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400">1. Acceptance of Terms</h2>
        <p>
          By creating an account or accessing Kitsuno, you agree to comply with and be bound by these terms.
        </p>

        <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400">2. Permitted Use</h2>
        <p>
          Kitsuno is provided for personal, non-commercial Japanese language learning and study purposes. Automated scraping or abusive traffic to the REST API is strictly prohibited.
        </p>

        <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400">3. Anki Export Content</h2>
        <p>
          Exported Anki decks are generated for your personal use in the Anki ecosystem.
        </p>
      </div>
    </div>
  );
}
