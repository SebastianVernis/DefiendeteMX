"use client";

export default function ToolCard({ tool }) {
  const { icon, title, description, badge, premium, isNew, action } = tool;

  return (
    <div className="group relative bg-primary hover:bg-secondary border border-secondary rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
      {/* Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isNew && (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 animate-pulse">
            NUEVO
          </span>
        )}
        {premium && (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
            PREMIUM
          </span>
        )}
      </div>

      {/* Icon */}
      <div className="mb-4 flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl group-hover:bg-accent/20 transition-colors duration-300">
        <span className="text-4xl">{icon}</span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-textPrimary mb-2 group-hover:text-accent transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm text-textSecondary mb-4 line-clamp-2">
        {description}
      </p>

      {/* Action Button */}
      <button
        onClick={action}
        className="w-full py-2 px-4 bg-accent/10 hover:bg-accent text-textPrimary hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
      >
        <span>Acceder</span>
        <svg
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-accent/0 group-hover:border-accent/50 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}
