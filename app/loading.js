/**
 * Loading Component
 * Displayed while pages are loading
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8 animate-float">
          <div className="w-24 h-24 mx-auto bg-white rounded-3xl flex items-center justify-center text-5xl shadow-2xl">
            ⚖️
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl font-bold text-white mb-4 font-display">
          Defiéndete MX
        </h2>
        
        {/* Loading Spinner */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        <p className="text-white/80 mt-4 text-sm">
          Cargando información legal...
        </p>
      </div>
    </div>
  );
}
