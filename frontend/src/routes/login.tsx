import { useState } from 'react';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, ArrowRight, Lock, User as UserIcon } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setErrorMessage('');
      if (!value.username.trim() || !value.password) {
        setErrorMessage('Username and password are required');
        return;
      }

      setIsSubmitting(true);
      const res = await login(value.username.trim(), value.password);
      setIsSubmitting(false);

      if (res.success) {
        router.navigate({ to: '/vocabulary' });
      } else {
        setErrorMessage(res.error || 'Invalid credentials');
      }
    },
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="sakura-card max-w-md w-full rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-xl shadow-md shadow-rose-500/20">
            🌸
          </div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">
            Welcome Back to Kitsuno
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Sign in to access your custom flashcard decks and progress.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Username Field */}
          <form.Field
            name="username"
            children={(field) => (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                  />
                </div>
              </div>
            )}
          />

          {/* Password Field */}
          <form.Field
            name="password"
            children={(field) => (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                  />
                </div>
              </div>
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sakura-btn-primary py-3 rounded-2xl font-bold text-xs shadow-md shadow-rose-500/25 flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[var(--border-sakura)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
          <Link to="/register" className="hover:text-rose-600 dark:hover:text-rose-400 font-semibold">
            Create an account &rarr;
          </Link>
          <Link to="/resend-verification" className="hover:text-rose-600 dark:hover:text-rose-400">
            Resend verification email
          </Link>
        </div>
      </div>
    </div>
  );
}
