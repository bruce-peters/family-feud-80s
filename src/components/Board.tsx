import { useGame } from '../store';
import { AnswerSlot } from './AnswerSlot';
import { DotMatrixNumber } from './DotMatrixNumber';

type Props = { onSlotClick?: (i: number) => void; showHints?: boolean };

const SLOTS = 8;

export function Board({ onSlotClick, showHints }: Props) {
  const round = useGame((s) => s.rounds[s.roundIndex]);
  const revealed = useGame((s) => s.revealed);
  const pot = useGame((s) => s.pot);
  const strikes = useGame((s) => s.strikes);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-4 flex items-center justify-center gap-4">
        <DotMatrixNumber value={pot} digits={3} className="!text-6xl md:!text-8xl" />
      </div>

      <div className="bg-feud-bezel p-4 md:p-6 rounded-2xl border-4 border-black shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
        <div className="bg-feud-blue-dk p-3 md:p-5 rounded-xl border-4 border-feud-yellow">
          <div className="text-center font-feud text-2xl md:text-4xl text-feud-cream uppercase mb-4 tracking-wide">
            {round.question}
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {Array.from({ length: SLOTS }).map((_, i) => (
              <AnswerSlot
                key={i}
                index={i}
                answer={round.answers[i]}
                revealed={!!revealed[i]}
                onClick={onSlotClick ? () => onSlotClick(i) : undefined}
                showHint={showHints}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-14 h-14 md:w-20 md:h-20 border-4 border-black rounded-md flex items-center justify-center ${i < strikes ? 'bg-white' : 'bg-feud-blue/40'}`}>
                {i < strikes && (
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <g stroke="#d62828" strokeWidth="14" strokeLinecap="round" fill="none">
                      <line x1="18" y1="18" x2="82" y2="82" />
                      <line x1="82" y1="18" x2="18" y2="82" />
                    </g>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
