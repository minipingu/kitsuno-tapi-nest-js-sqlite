import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/resend-verification')({
  component: ResendVerificationPage,
});

function ResendVerificationPage() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const resendMutation = useMutation({
    mutationFn: async (targetEmail: string) => {
      const res = await api.post('/api/auth/resend-verification', { email: targetEmail });
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessMessage(
        data?.message || 'If the email is linked to an unverified account, a new link has been sent.'
      );
    },
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.message || 'Failed to resend verification link');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setErrorMessage('');
    setSuccessMessage('');
    resendMutation.mutate(email.trim());
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="sakura-card max-w-md w-full rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-xl shadow-md shadow-rose-500/20">
            🌸
          </div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">
            Resend Verification Link
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Enter the email address registered with your account to receive a new activation link.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
            <Link
              to="/login"
              className="sakura-btn-primary w-full py-3 rounded-2xl font-bold text-xs inline-flex items-center justify-center space-x-2"
            >
              <span>Back to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={resendMutation.isPending || !email.trim()}
              className="w-full sakura-btn-primary py-3 rounded-2xl font-bold text-xs shadow-md shadow-rose-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{resendMutation.isPending ? 'Sending...' : 'Send Verification Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[var(--border-sakura)] text-center text-xs text-[var(--text-muted)]">
          <Link to="/login" className="text-rose-600 dark:text-rose-400 font-bold hover:underline">
            &larr; Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
