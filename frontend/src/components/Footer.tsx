import { Link } from '@tanstack/react-router';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border-sakura)] bg-[var(--bg-card)]/80 py-8 text-xs text-gray-500 dark:text-gray-400 mb-14 md:mb-0 transition-colors">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-rose-500 text-lg">🌸</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">Kitsuno 狐の</span>
          <span>&copy; {new Date().getFullYear()} Japanese Mastery Platform</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/about" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
            About
          </Link>
          <Link to="/privacypolicy" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/tos" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
            Terms of Service
          </Link>
          <a
            href="http://localhost:3001/v1/api-docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            OpenAPI Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
