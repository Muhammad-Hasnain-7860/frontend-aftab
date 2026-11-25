
import { useState } from "react";
import { Link } from "react-router";

export default function Auth() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);

    window.location.href = `https://aftab-backend.ethiodeploy.app/api/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-800"
        >
          <span aria-hidden="true">←</span> Back to website
        </Link>

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your account and continue.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <svg viewBox="0 0 48 48" className="h-5 w-5">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.2-3.1-.5-4.5H24v9h12.4c-.6 2.9-2.2 5.3-4.5 6.9l7.4 5.7c4.3-4 6.8-9.9 6.8-17.1z" />
            <path fill="#FBBC05" d="M10.4 28.6A14.5 14.5 0 019.5 24c0-1.6.3-3.2.9-4.6l-7.8-6.1A24 24 0 000 24c0 3.9.9 7.6 2.6 10.7l7.8-6.1z" />
            <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.3-5.4l-7.4-5.7c-2 1.3-4.6 2.1-7.9 2.1-6.3 0-11.7-4.1-13.6-9.7l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
          </svg>

          {loading ? "Redirecting..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          Secure authentication for all users
        </p>
      </div>
    </div>
  );
}
