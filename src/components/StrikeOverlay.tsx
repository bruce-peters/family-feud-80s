export function StrikeOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 bg-black/30">
      <div className="flex gap-4 md:gap-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="strike-stamp"
            style={{ animationDelay: `${i * 140}ms` }}
          >
            <div className="w-[22vmin] h-[22vmin] bg-feud-red border-[6px] md:border-[10px] border-black rounded-md flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
              <svg viewBox="0 0 100 100" className="w-[78%] h-[78%]">
                <g stroke="#0a0a0a" strokeWidth="18" strokeLinecap="square" fill="none">
                  <line x1="14" y1="14" x2="86" y2="86" />
                  <line x1="86" y1="14" x2="14" y2="86" />
                </g>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
