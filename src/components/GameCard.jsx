import { Play, Heart, Star, Sparkles, Trash2 } from 'lucide-react';

export default function GameCard({ game, onSelect, isFavorite, onToggleFavorite, onDeleteGame }) {
  return (
    <div className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-sky-950/20">
      <div>
        {/* Top bar on card: unboxed metadata & action buttons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{game.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{game.badge || 'IFrame'}</span>
            {game.featured && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(game.id);
              }}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-800/40 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>

            {onDeleteGame && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGame(game.id);
                }}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-800/40 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition cursor-pointer"
                title="Remove game"
                aria-label="Remove game"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-400 transition-colors line-clamp-1">
          {game.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {game.description}
        </p>
      </div>

      {/* Card Footer: Rating, Plays & Launch Button */}
      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-slate-200 tabular-nums">{game.rating || 5.0}</span>
          {game.plays && <span className="text-slate-600">({game.plays})</span>}
        </div>

        <button
          type="button"
          onClick={() => onSelect(game)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
        >
          <Play className="w-3 h-3 fill-slate-950" />
          <span>Play</span>
        </button>
      </div>
    </div>
  );
}
