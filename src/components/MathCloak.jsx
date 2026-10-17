import { useState, useRef, useEffect } from 'react';
import { Calculator, ArrowLeft, RefreshCw, BookOpen, Sigma, Compass } from 'lucide-react';

export default function MathCloak({ onExitCloak }) {
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [funcFormula, setFuncFormula] = useState('Math.sin(x)');
  const canvasRef = useRef(null);

  // Plot mathematical function onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // X Axis
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    // Y Axis
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Subtle grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Graph function
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const scale = 25;
    const centerX = width / 2;
    const centerY = height / 2;
    let started = false;

    for (let px = 0; px <= width; px += 2) {
      const x = (px - centerX) / scale;
      try {
        // Safe evaluate
        let y = 0;
        if (funcFormula === 'Math.sin(x)') y = Math.sin(x);
        else if (funcFormula === 'Math.cos(x)') y = Math.cos(x);
        else if (funcFormula === 'x*x') y = x * x;
        else if (funcFormula === 'Math.sin(x)*x') y = Math.sin(x) * x;
        else if (funcFormula === '1/(x||0.001)') y = 1 / (x || 0.001);
        else y = Math.sin(x);

        const py = centerY - y * scale;
        if (!isNaN(py) && isFinite(py)) {
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
      } catch (err) {}
    }
    ctx.stroke();
  }, [funcFormula]);

  const handleCalcClick = (val) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Basic safe arithmetic
        const sanitized = calcInput.replace(/[^0-9+\-*/().]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        setCalcResult(String(res));
      } catch (e) {
        setCalcResult('Error');
      }
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Academic Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-sky-400">
            <Sigma className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-200">
              Math 101: Calculus & Linear Systems
            </h1>
            <p className="text-xs text-slate-400">
              Department of Mathematics · Student Scratchpad & Reference
            </p>
          </div>
        </div>

        <button
          onClick={onExitCloak}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Scratchpad [Esc]</span>
        </button>
      </header>

      {/* Main Study Grid */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Graph Plotter */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-slate-200">Interactive Function Plotter</h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={funcFormula}
                onChange={(e) => setFuncFormula(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
              >
                <option value="Math.sin(x)">f(x) = sin(x)</option>
                <option value="Math.cos(x)">f(x) = cos(x)</option>
                <option value="x*x">f(x) = x²</option>
                <option value="Math.sin(x)*x">f(x) = x · sin(x)</option>
                <option value="1/(x||0.001)">f(x) = 1/x</option>
              </select>
            </div>
          </div>

          <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-center p-2 min-h-[340px]">
            <canvas ref={canvasRef} width="640" height="340" className="w-full h-full object-contain" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
              <span className="font-semibold text-slate-300">Domain:</span> x ∈ [-12, 12]
            </div>
            <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
              <span className="font-semibold text-slate-300">Asymptotes:</span> Continuous
            </div>
            <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
              <span className="font-semibold text-slate-300">Period:</span> T = 2π ≈ 6.283
            </div>
          </div>
        </div>

        {/* Right Column: Calculator & Formulas */}
        <div className="space-y-6 flex flex-col">
          {/* Scientific Mini-Calculator */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-slate-200">Scientific Scratch Calculator</h2>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-3 text-right">
              <div className="text-xs text-slate-500 font-mono min-h-[16px]">{calcInput || '0'}</div>
              <div className="text-lg font-bold font-mono text-sky-400 min-h-[26px]">
                {calcResult || '= 0'}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className={`py-2 rounded font-semibold text-xs transition cursor-pointer ${
                    btn === '='
                      ? 'bg-sky-500 text-slate-950 hover:bg-sky-400 col-span-1'
                      : btn === 'C'
                      ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Formulas */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-200">Core Identities Sheet</h2>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="p-2 bg-slate-950/70 border border-slate-800/80 rounded flex justify-between font-mono">
                <span className="text-slate-400">Power Rule:</span>
                <span className="text-sky-300">d/dx [xⁿ] = n · xⁿ⁻¹</span>
              </li>
              <li className="p-2 bg-slate-950/70 border border-slate-800/80 rounded flex justify-between font-mono">
                <span className="text-slate-400">Product Rule:</span>
                <span className="text-sky-300">(u·v)&apos; = u&apos;v + uv&apos;</span>
              </li>
              <li className="p-2 bg-slate-950/70 border border-slate-800/80 rounded flex justify-between font-mono">
                <span className="text-slate-400">Pythagorean:</span>
                <span className="text-sky-300">sin²(θ) + cos²(θ) = 1</span>
              </li>
              <li className="p-2 bg-slate-950/70 border border-slate-800/80 rounded flex justify-between font-mono">
                <span className="text-slate-400">Euler&apos;s Identity:</span>
                <span className="text-sky-300">e^(iπ) + 1 = 0</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
