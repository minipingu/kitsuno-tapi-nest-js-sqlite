import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Key,
  Lock,
  Copy,
  RotateCw,
  Trophy,
} from 'lucide-react';
import { bookmarksCollection, quizHistoryCollection } from '@/lib/db';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const queryClient = useQueryClient();
  const { isAuthenticated, refreshUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState({ success: '', error: '' });
  const [passwordMsg, setPasswordMsg] = useState({ success: '', error: '' });

  // Query profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      const res = await api.get('/api/profile');
      return res.data;
    },
    enabled: isAuthenticated,
  });

  // Regenerate API Key Mutation
  const apiKeyMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/profile/api-key');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      refreshUser();
    },
  });

  // Update Username Form
  const usernameForm = useForm({
    defaultValues: {
      username: profile?.user?.username || '',
    },
    onSubmit: async ({ value }) => {
      setUsernameMsg({ success: '', error: '' });
      try {
        const res = await api.post('/api/profile/username', {
          username: value.username.trim(),
        });
        if (res.data?.success) {
          setUsernameMsg({ success: 'Username updated successfully!', error: '' });
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          refreshUser();
        }
      } catch (err: any) {
        setUsernameMsg({
          success: '',
          error: err.response?.data?.message || 'Failed to update username',
        });
      }
    },
  });

  // Update Password Form
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      setPasswordMsg({ success: '', error: '' });
      if (value.newPassword !== value.confirmPassword) {
        setPasswordMsg({ success: '', error: 'New passwords do not match' });
        return;
      }
      try {
        const res = await api.post('/api/profile/password', {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          confirmPassword: value.confirmPassword,
        });
        if (res.data?.success) {
          setPasswordMsg({ success: 'Password changed successfully!', error: '' });
          passwordForm.reset();
        }
      } catch (err: any) {
        setPasswordMsg({
          success: '',
          error: err.response?.data?.message || 'Failed to update password',
        });
      }
    },
  });

  const copyApiKey = () => {
    if (profile?.user?.apiKey) {
      navigator.clipboard.writeText(profile.user.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
        <h2 className="text-2xl font-extrabold text-[var(--text-main)]">
          Sign In to Access Your Profile
        </h2>
        <Link to="/login" className="sakura-btn-primary px-6 py-2.5 rounded-2xl font-bold text-xs">
          Log In
        </Link>
      </div>
    );
  }

  const bookmarks = Object.values(bookmarksCollection.state || {});
  const quizHistory = Object.values(quizHistoryCollection.state || {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[var(--border-sakura)] space-y-2">
        <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
          <span>🌸 Account &amp; Developer Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
          User Profile <span className="text-xl font-normal text-rose-500 font-japanese">設定</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Manage your account credentials, developer REST API keys, and study stats.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--text-muted)] animate-pulse">
          Loading profile...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: User Summary Card */}
          <div className="space-y-6">
            <div className="sakura-card rounded-3xl p-6 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-4xl font-black shadow-lg shadow-rose-500/25">
                {profile?.user?.username?.[0]?.toUpperCase() || 'U'}
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[var(--text-main)]">
                  {profile?.user?.username}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{profile?.user?.email}</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Member since {profile?.user?.joinDate || '2026'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-sakura)]">
                <div className="p-2.5 rounded-2xl bg-[var(--bg-subtle)]">
                  <span className="text-[10px] text-gray-400 uppercase block">Flashcards</span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    {profile?.countFlashcards || 0}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[var(--bg-subtle)]">
                  <span className="text-[10px] text-gray-400 uppercase block">Bookmarks</span>
                  <span className="text-lg font-bold text-amber-500">
                    {bookmarks.length}
                  </span>
                </div>
              </div>
            </div>

            {/* TanStack DB Stats */}
            <div className="sakura-card rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-bold text-[var(--text-main)] flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>TanStack DB Practice Sessions</span>
              </h4>
              {quizHistory.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] italic">
                  No quizzes completed yet. Try a Hiragana or Katakana quiz drill!
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {quizHistory.slice(0, 5).map((q: any) => (
                    <div
                      key={q.id}
                      className="p-2.5 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold capitalize text-[var(--text-main)]">
                        {q.type} Drill
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {q.score}/{q.total} ({q.accuracy}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Settings Forms */}
          <div className="md:col-span-2 space-y-6">
            {/* API Key Management */}
            <div className="sakura-card rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center space-x-2">
                    <Key className="w-4 h-4 text-rose-500" />
                    <span>Personal Developer API Key</span>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Use this key in the <code>API-KEY</code> header for REST API requests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => apiKeyMutation.mutate()}
                  disabled={apiKeyMutation.isPending}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-sakura)] text-xs font-semibold hover:border-rose-400 flex items-center space-x-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={profile?.user?.apiKey || 'No API key generated'}
                  className="flex-1 px-3.5 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-subtle)] font-mono text-xs text-gray-700 dark:text-gray-300"
                />
                <button
                  type="button"
                  onClick={copyApiKey}
                  className="px-4 py-2.5 rounded-2xl sakura-btn-primary font-bold text-xs flex items-center space-x-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Update Username */}
            <div className="sakura-card rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center space-x-2">
                <User className="w-4 h-4 text-rose-500" />
                <span>Update Username</span>
              </h3>

              {usernameMsg.success && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-700 text-xs font-semibold">
                  {usernameMsg.success}
                </div>
              )}
              {usernameMsg.error && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 text-xs font-semibold">
                  {usernameMsg.error}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  usernameForm.handleSubmit();
                }}
                className="space-y-3"
              >
                <usernameForm.Field
                  name="username"
                  children={(field) => (
                    <input
                      type="text"
                      placeholder="New username"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs"
                    />
                  )}
                />
                <button
                  type="submit"
                  className="sakura-btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Save Username
                </button>
              </form>
            </div>

            {/* Update Password */}
            <div className="sakura-card rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center space-x-2">
                <Lock className="w-4 h-4 text-rose-500" />
                <span>Change Password</span>
              </h3>

              {passwordMsg.success && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-700 text-xs font-semibold">
                  {passwordMsg.success}
                </div>
              )}
              {passwordMsg.error && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 text-xs font-semibold">
                  {passwordMsg.error}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  passwordForm.handleSubmit();
                }}
                className="space-y-3"
              >
                <passwordForm.Field
                  name="currentPassword"
                  children={(field) => (
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs"
                    />
                  )}
                />
                <passwordForm.Field
                  name="newPassword"
                  children={(field) => (
                    <input
                      type="password"
                      placeholder="New Password (min 8 chars)"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs"
                    />
                  )}
                />
                <passwordForm.Field
                  name="confirmPassword"
                  children={(field) => (
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs"
                    />
                  )}
                />
                <button
                  type="submit"
                  className="sakura-btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
