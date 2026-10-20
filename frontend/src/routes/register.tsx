import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, CheckCircle2, ArrowRight, User, Mail, Lock } from 'lucide-react';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      setErrorMessage('');
      setSuccessMessage('');

      if (value.password !== value.confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }

      setIsSubmitting(true);
      const res = await register({
        username: value.username.trim(),
        email: value.email.trim(),
        password: value.password,
        confirmPassword: value.confirmPassword,
      });
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage(
          res.message || "We've sent you a verification email. Click the link inside to activate your account."
        );
      } else {
        setErrorMessage(res.error || 'Registration failed');
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
            Create Kitsuno Account
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Join free to build custom decks, save progress, and master Japanese.
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
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Verification Email Sent!</span>
              </div>
              <p className="leading-relaxed">{successMessage}</p>
            </div>
            <Link
              to="/login"
              className="w-full sakura-btn-primary py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-3.5"
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
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="5-14 alphanumeric chars"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                    />
                  </div>
                </div>
              )}
            />

            {/* Email Field */}
            <form.Field
              name="email"
              children={(field) => (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="you@example.com"
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
                      placeholder="At least 8 chars"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                    />
                  </div>
                </div>
              )}
            />

            {/* Confirm Password Field */}
            <form.Field
              name="confirmPassword"
              children={(field) => (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Repeat your password"
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
              <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[var(--border-sakura)] text-center text-xs text-[var(--text-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="text-rose-600 dark:text-rose-400 font-bold hover:underline">
            Sign In &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
