import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface VerifySearchParams {
  token?: string;
}

export const Route = createFileRoute('/verify')({
  validateSearch: (search: Record<string, unknown>): VerifySearchParams => {
    return {
      token: (search.token as string) || undefined,
    };
  },
  component: VerifyPage,
});

function VerifyPage() {
  const { token } = Route.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'verify', token],
    queryFn: async () => {
      if (!token) return { success: false, message: 'Verification token is missing' };
      const res = await api.get(`/api/auth/verify?token=${encodeURIComponent(token)}`);
      return res.data;
    },
    enabled: Boolean(token),
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="sakura-card max-w-md w-full rounded-3xl p-8 text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-3xl">
          🌸
        </div>

        <h1 className="text-2xl font-black text-[var(--text-main)]">
          Account Verification
        </h1>

        {isLoading ? (
          <p className="text-xs text-[var(--text-muted)] animate-pulse">
            Verifying your account token with backend...
          </p>
        ) : data?.success ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{data.message || 'Congratulations, your account has been verified!'}</span>
            </div>
            <Link
              to="/login"
              className="sakura-btn-primary w-full py-3 rounded-2xl font-bold text-xs inline-flex items-center justify-center space-x-2"
            >
              <span>Log In to Kitsuno</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{data?.message || 'Verification token is invalid or expired.'}</span>
            </div>
            <Link
              to="/resend-verification"
              className="sakura-btn-primary w-full py-3 rounded-2xl font-bold text-xs inline-flex items-center justify-center space-x-2"
            >
              <span>Resend Verification Link</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
