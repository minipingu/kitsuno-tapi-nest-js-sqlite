import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacypolicy')({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
        Privacy Policy
      </h1>
      <p className="text-xs text-[var(--text-muted)]">
        Last updated: October 2026
      </p>

      <div className="sakura-card rounded-3xl p-8 space-y-4 text-xs leading-relaxed text-[var(--text-main)]">
        <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400">1. Information We Collect</h2>
        <p>
          We collect account information (username and email address) only for account authentication, password recovery, and email verification.
        </p>

        <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400">2. Flashcards &amp; Study Data</h2>
        <p>
          Your flashcards and study notes are stored securely on our servers and in your local browser cache (via TanStack DB). We do not share, sell, or monetize your personalized study decks.
        </p>

        <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400">3. Cookies &amp; Sessions</h2>
        <p>
          We use secure HTTP-only session cookies solely to maintain your authenticated login session between your browser and our NestJS backend API.
        </p>
      </div>
    </div>
  );
}
