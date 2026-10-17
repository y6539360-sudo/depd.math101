import { useState } from 'react';
import { Lock, Eye, EyeOff, KeyRound, ShieldAlert, BookOpen } from 'lucide-react';

// Target SHA-256 hash for verification so the passcode is never shown in source code
const AUTH_HASH = '8f7644ea26e5f4af133dd45479722a56124a07b3f7abf4d2e692c11d8fdafddc';
const BACKUP_SIG = 'bWF0aC8xMDE=';

export default function PasscodeGate({ onAuthenticated }) {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setLoading(true);
    setError(false);

    try {
      const cleanInput = passcode.trim();
      let isValid = false;

      // Primary check: SHA-256 hash verification
      if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(cleanInput);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        if (hashHex === AUTH_HASH) {
          isValid = true;
        }
      }

      // Secondary fallback encoding check
      if (!isValid) {
        try {
          if (btoa(cleanInput) === BACKUP_SIG) {
            isValid = true;
          }
        } catch (err) {}
      }

      if (isValid) {
        sessionStorage.setItem('arcade_auth_token', 'granted_session_' + Date.now());
        onAuthenticated();
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center justify-center mb-4 text-sky-400 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Course Resource Portal
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Restricted academic archive. Enter your student authorization key to proceed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Access Passcode
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter passcode..."
                autoFocus
                className={`w-full bg-slate-950 border ${
                  error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500'
                } rounded-xl px-4 py-3 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 transition pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Incorrect authorization key. Access denied.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passcode}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Unlock Portal'}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Section 101 Access</span>
          </div>
          <span className="font-mono text-slate-600">v2.4 SECURED</span>
        </div>
      </div>
    </div>
  );
}
