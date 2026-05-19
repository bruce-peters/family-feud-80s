import { useGameSync } from '../lib/channel';
import { useGame } from '../store';
import { Board } from '../components/Board';
import { TeamPanel } from '../components/TeamPanel';
import { StrikeOverlay } from '../components/StrikeOverlay';

export function BoardView() {
  useGameSync('board');
  const teams = useGame((s) => s.teams);
  const activeTeam = useGame((s) => s.activeTeam);
  const showStrike = useGame((s) => s.showStrike);
  const roundIndex = useGame((s) => s.roundIndex);
  const totalRounds = useGame((s) => s.rounds.length);

  return (
    <div className="min-h-screen flex flex-col bg-feud-blue-dk overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-6 gap-6">
        <TeamPanel team={teams[0]} active={activeTeam === 0} side="left" />
        <Board />
        <TeamPanel team={teams[1]} active={activeTeam === 1} side="right" />
      </div>
      <div className="text-center text-feud-yellow font-feud text-2xl pb-3 tracking-widest">
        ROUND {roundIndex + 1} / {totalRounds}
      </div>
      <StrikeOverlay show={showStrike} />
    </div>
  );
}
