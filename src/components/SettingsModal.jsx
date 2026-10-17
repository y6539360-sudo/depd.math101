import { useState } from 'react';
import { X, Shield, Lock, RotateCcw, Check } from 'lucide-react';

const CLOAK_PRESETS = [
  {
    name: 'Normal (Arcade 101)',
    title: 'Arcade 101 · Unblocked Hub',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2338bdf8" stroke-width="2"><polygon points="6 2 18 2 18 6 6 6"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>'
  },
  {
    name: 'Google Classroom',
    title: 'Classes · Google Classroom',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    name: 'Google Docs',
    title: 'Untitled Document - Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    name: 'Canvas LMS',
    title: 'Dashboard · Canvas LMS',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  },
  {
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    icon: 'https://www.desmos.com/favicon.ico'
  }
];

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  onLock, 
  onResetCustomGames, 
  currentCloak, 
  onSelectCloak 
}) {
  const [selected, setSelected] = useState(currentCloak || CLOAK_PRESETS[0].name);

  if (!isOpen) return null;

  const handleApplyCloak = (preset) => {
    setSelected(preset.name);
    onSelectCloak(preset);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-slate-100">Portal Cloaking & Security</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Tab Cloaking Presets */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Disguise Browser Tab (Title & Favicon)
            </label>
            <div className="space-y-1.5">
              {CLOAK_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleApplyCloak(preset)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                    selected === preset.name
                      ? 'bg-sky-500/10 border-sky-500/40 text-sky-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={preset.icon}
                      alt=""
                      className="w-4 h-4 object-contain rounded-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <span>{preset.name}</span>
                  </div>
                  {selected === preset.name && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Panic Key Info */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Instant Stealth Disguise Key:</span>
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono font-bold">
              Esc
            </kbd>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onLock();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold cursor-pointer transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Portal Now (Require Passcode)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all custom added games?')) {
                  onResetCustomGames();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Custom Games</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
