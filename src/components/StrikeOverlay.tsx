export function StrikeOverlay({ show, count }: { show: boolean; count: number }) {
  if (!show || count <= 0) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 bg-black/30">
      <div className="flex gap-6 md:gap-10">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="strike-stamp"
            style={{ animationDelay: `${i * 140}ms` }}
          >
            <div className="w-[24vmin] h-[24vmin] border-[10px] md:border-[14px] border-feud-red flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
              <svg viewBox="0 0 100 100" className="w-full h-full block" preserveAspectRatio="none">
                <g stroke="#d62828" strokeWidth="22" strokeLinecap="square" fill="none">
                  <line x1="0" y1="0" x2="100" y2="100" />
                  <line x1="100" y1="0" x2="0" y2="100" />
                </g>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
