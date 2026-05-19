import { useEffect, useRef } from 'react';
import type { Answer } from '../types';

type Props = {
  index: number;
  answer: Answer | undefined;
  revealed: boolean;
  onClick?: () => void;
  showHint?: boolean;
};

export function AnswerSlot({ index, answer, revealed, onClick, showHint }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const wasRevealed = useRef(revealed);
  useEffect(() => {
    if (!wasRevealed.current && revealed && ref.current) {
      ref.current.classList.remove('flip-anim');
      void ref.current.offsetWidth;
      ref.current.classList.add('flip-anim');
    }
    wasRevealed.current = revealed;
  }, [revealed]);

  const empty = !answer;

  return (
    <div className="flex flex-col gap-1">
      {showHint && (
        <div className="h-6 px-2 flex items-center justify-between text-feud-cream/90 font-sans text-sm">
          {empty ? (
            <span className="opacity-40">—</span>
          ) : (
            <>
              <span className={`truncate ${revealed ? 'line-through opacity-50' : ''}`}>
                #{index + 1} {answer!.text}
              </span>
              <span className="ml-2 font-dot text-feud-yellow text-base">{answer!.points}</span>
            </>
          )}
        </div>
      )}
    <div
      ref={ref}
      onClick={onClick}
      className={`relative h-16 md:h-20 border-4 border-black rounded-md overflow-hidden select-none ${onClick && !revealed && !empty ? 'cursor-pointer hover:brightness-110' : ''}`}
      style={{ perspective: '600px' }}
    >
      {empty ? (
        <div className="w-full h-full bg-feud-blue-dk" />
      ) : !revealed ? (
        <div className="w-full h-full x-cover flex items-center justify-start pl-3">
          <span className="font-dot text-3xl md:text-5xl text-black/80 drop-shadow">{index + 1}</span>
        </div>
      ) : (
        <div className="w-full h-full bg-black flex items-center justify-between px-3">
          <span className="font-feud text-2xl md:text-4xl tracking-wide text-white uppercase truncate">
            {answer!.text}
          </span>
          <span className="ml-3 bg-feud-yellow text-black font-dot text-3xl md:text-5xl px-3 rounded-sm border-2 border-black min-w-[3ch] text-center">
            {answer!.points}
          </span>
        </div>
      )}
    </div>
    </div>
  );
}
