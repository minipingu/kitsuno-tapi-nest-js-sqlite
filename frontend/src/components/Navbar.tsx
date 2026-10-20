import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  FileCode,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/vocabulary', label: 'Vocabulary', jp: '語彙', icon: '/images/navbar/vocabulary_icon.png' },
    { to: '/hiragana', label: 'Hiragana', jp: 'あ', icon: '/images/navbar/hiragana_icon.png' },
    { to: '/katakana', label: 'Katakana', jp: 'ア', icon: '/images/navbar/katakana_icon.png' },
    { to: '/kanji', label: 'Kanji', jp: '漢', icon: '/images/navbar/kanji_icon.png' },
    { to: '/flashcards', label: 'Flashcards', jp: '札', icon: '/images/navbar/flashcard_icon.png' },
    { to: '/particles', label: 'Particles', jp: '助', icon: '/images/navbar/particle_icon.png' },
  ];

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.navigate({ to: '/login' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-card)]/90 border-b border-[var(--border-sakura)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
                  <span className="text-xl">🌸</span>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-600 to-pink-500 dark:from-rose-400 dark:to-pink-300 bg-clip-text text-transparent">
                      Kitsuno
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-medium">
                      狐
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-none">
                    日本語学習
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeProps={{
                    className:
                      'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold',
                  }}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right Actions: Theme Toggle + User Menu */}
            <div className="flex items-center space-x-3">
              {/* Sakura Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode (Asa-Sakura)' : 'Switch to Dark Mode (Yozakura)'}
                className="p-2 rounded-xl border border-[var(--border-sakura)] bg-[var(--bg-subtle)] text-gray-700 dark:text-gray-200 hover:scale-105 transition-all shadow-sm"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                ) : (
                  <Moon className="w-4 h-4 text-rose-600" />
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-[var(--border-sakura)] hover:border-rose-400 bg-[var(--bg-card)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 flex items-center justify-center font-bold text-xs">
                    {isAuthenticated ? user?.username?.[0]?.toUpperCase() || 'U' : <UserIcon className="w-4 h-4" />}
                  </div>
                  {isAuthenticated && (
                    <span className="hidden sm:inline text-xs font-medium text-gray-800 dark:text-gray-200 pr-1">
                      {user?.username}
                    </span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl shadow-xl bg-[var(--bg-card)] border border-[var(--border-sakura)] py-2 z-50 animate-in fade-in zoom-in-95">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-[var(--border-sakura)]">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 truncate">
                            {user?.username}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <UserIcon className="w-4 h-4 text-rose-500" />
                          <span>My Profile & Settings</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <LogIn className="w-4 h-4 text-rose-500" />
                          <span>Log In</span>
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <UserPlus className="w-4 h-4 text-rose-500" />
                          <span>Create Account</span>
                        </Link>
                      </>
                    )}
                    <div className="border-t border-[var(--border-sakura)] mt-1 pt-1">
                      <a
                        href="http://localhost:3001/v1/api-docs"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2.5 px-4 py-2 text-[11px] text-gray-500 hover:text-rose-500"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Swagger OpenAPI</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border-sakura)] bg-[var(--bg-card)] px-4 py-3 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <span>{item.jp}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-card)]/95 backdrop-blur-md border-t border-[var(--border-sakura)] flex items-center justify-around py-2 shadow-lg">
        {navLinks.slice(0, 5).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{
              className: 'text-rose-600 dark:text-rose-400 font-bold',
            }}
            className="flex flex-col items-center text-[10px] text-gray-500 dark:text-gray-400 hover:text-rose-600 py-1 px-2"
          >
            <span className="text-base font-japanese">{item.jp}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
