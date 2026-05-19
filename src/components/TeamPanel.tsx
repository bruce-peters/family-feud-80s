import type { Team } from '../types';
import { DotMatrixNumber } from './DotMatrixNumber';

type Props = { team: Team; active: boolean; side: 'left' | 'right' };

export function TeamPanel({ team, active, side }: Props) {
  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-lg border-4 ${active ? 'border-feud-yellow' : 'border-black'} bg-feud-blue ${side === 'left' ? '' : ''}`}>
      <div className="font-feud text-3xl md:text-5xl tracking-wider text-feud-yellow uppercase">
        {team.name}
      </div>
      <DotMatrixNumber value={team.score} digits={3} />
    </div>
  );
}
