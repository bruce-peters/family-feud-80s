import { useState } from 'react';
import { useGameSync } from '../lib/channel';
import { useGame } from '../store';
import { Board } from '../components/Board';
import { StrikeOverlay } from '../components/StrikeOverlay';
import { matchAnswer } from '../lib/match';

export function Host() {
  useGameSync('host');
  const {
    rounds, roundIndex, revealed, strikes, pot, teams, activeTeam, showStrike,
    reveal, strike, award, setActiveTeam, setTeamName, nextRound, prevRound, resetRound, resetGame,
  } = useGame();

  const round = rounds[roundIndex];
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(true);

  function submitGuess() {
    if (!guess.trim()) return;
    const i = matchAnswer(guess, round.answers.map((a) => a.text));
    if (i >= 0 && !revealed[i]) {
      reveal(i);
      setFeedback(`✓ matched #${i + 1}: ${round.answers[i].text}`);
    } else if (i >= 0 && revealed[i]) {
      setFeedback(`already revealed (#${i + 1})`);
    } else {
      setFeedback('no match — press STRIKE if wrong');
    }
    setGuess('');
  }

  return (
    <div className="min-h-screen flex bg-feud-blue-dk text-white">
      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-feud text-4xl text-feud-yellow tracking-widest">HOST — 80s FAMILY FEUD</h1>
          <label className="flex items-center gap-2 font-sans text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showHints}
              onChange={(e) => setShowHints(e.target.checked)}
              className="w-4 h-4 accent-feud-yellow"
            />
            Show answer hints
          </label>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Board onSlotClick={(i) => reveal(i)} showHints={showHints} />
        </div>
        <p className="text-feud-cream/70 text-sm">Click a slot above to reveal it.</p>
      </div>

      <aside className="w-[380px] bg-black/40 border-l-4 border-feud-yellow p-4 flex flex-col gap-3 font-sans text-base">
        <Section title="Guess match">
          <div className="flex gap-2">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
              placeholder="Type a guess…"
              className="flex-1 px-3 py-2 rounded bg-white text-black"
            />
            <Btn onClick={submitGuess}>Check</Btn>
          </div>
          {feedback && <div className="text-feud-yellow text-sm mt-1">{feedback}</div>}
        </Section>

        <Section title={`Strikes: ${strikes} / 3`}>
          <div className="flex gap-2">
            <Btn variant="red" onClick={strike}>STRIKE ✕</Btn>
            <Btn onClick={resetRound}>Reset round</Btn>
          </div>
        </Section>

        <Section title={`Pot: ${pot}`}>
          <div className="flex gap-2">
            <Btn variant="yellow" onClick={() => award(0)}>Award → {teams[0].name}</Btn>
            <Btn variant="yellow" onClick={() => award(1)}>Award → {teams[1].name}</Btn>
          </div>
        </Section>

        <Section title="Active team">
          <div className="flex gap-2">
            <Btn variant={activeTeam === 0 ? 'yellow' : 'plain'} onClick={() => setActiveTeam(activeTeam === 0 ? null : 0)}>{teams[0].name}</Btn>
            <Btn variant={activeTeam === 1 ? 'yellow' : 'plain'} onClick={() => setActiveTeam(activeTeam === 1 ? null : 1)}>{teams[1].name}</Btn>
          </div>
        </Section>

        <Section title="Teams">
          {[0, 1].map((t) => (
            <div key={t} className="flex items-center gap-2 mb-1">
              <input
                className="flex-1 px-2 py-1 rounded bg-white text-black"
                value={teams[t as 0 | 1].name}
                onChange={(e) => setTeamName(t as 0 | 1, e.target.value)}
              />
              <span className="font-dot text-2xl text-feud-yellow w-12 text-right">{teams[t as 0 | 1].score}</span>
            </div>
          ))}
        </Section>

        <Section title={`Round ${roundIndex + 1} / ${rounds.length}`}>
          <div className="flex gap-2">
            <Btn onClick={prevRound}>◀ Prev</Btn>
            <Btn onClick={nextRound}>Next ▶</Btn>
            <Btn variant="red" onClick={() => { if (confirm('Reset entire game?')) resetGame(); }}>Reset Game</Btn>
          </div>
        </Section>

        <Section title="Open audience view">
          <a className="text-feud-yellow underline" href="/board" target="_blank" rel="noreferrer">/board (new window)</a>
        </Section>
      </aside>

      <StrikeOverlay show={showStrike} count={strikes} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/20 rounded p-3 bg-black/30">
      <div className="font-feud text-feud-yellow text-xl tracking-wider mb-2">{title}</div>
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = 'plain' }: { children: React.ReactNode; onClick: () => void; variant?: 'plain' | 'red' | 'yellow' }) {
  const styles = {
    plain: 'bg-white/10 hover:bg-white/20 text-white',
    red: 'bg-feud-red hover:brightness-110 text-white',
    yellow: 'bg-feud-yellow hover:brightness-110 text-black',
  }[variant];
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded font-feud tracking-wider text-lg ${styles}`}>
      {children}
    </button>
  );
}
