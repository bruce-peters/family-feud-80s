import { useEffect } from 'react';
import { useGame, snapshot } from '../store';
import type { GameState } from '../types';

const CH = 'family-feud';
type Msg =
  | { type: 'state'; payload: GameState }
  | { type: 'request' };

let bc: BroadcastChannel | null = null;
function getBC(): BroadcastChannel {
  if (!bc) bc = new BroadcastChannel(CH);
  return bc;
}

/**
 * role 'host' broadcasts state on every change; responds to 'request' from new windows.
 * role 'board' listens for state and hydrates store; sends 'request' on mount.
 */
export function useGameSync(role: 'host' | 'board') {
  useEffect(() => {
    const ch = getBC();
    const hydrate = useGame.getState().hydrate;

    const onMsg = (e: MessageEvent<Msg>) => {
      const m = e.data;
      if (role === 'board' && m.type === 'state') hydrate(m.payload);
      if (role === 'host' && m.type === 'request') {
        ch.postMessage({ type: 'state', payload: snapshot() });
      }
    };
    ch.addEventListener('message', onMsg);

    if (role === 'host') {
      const unsub = useGame.subscribe((s) => {
        const payload: GameState = {
          rounds: s.rounds, roundIndex: s.roundIndex, revealed: s.revealed,
          strikes: s.strikes, pot: s.pot, teams: s.teams,
          activeTeam: s.activeTeam, showStrike: s.showStrike,
        };
        ch.postMessage({ type: 'state', payload });
      });
      ch.postMessage({ type: 'state', payload: snapshot() });
      return () => { ch.removeEventListener('message', onMsg); unsub(); };
    } else {
      ch.postMessage({ type: 'request' });
      return () => { ch.removeEventListener('message', onMsg); };
    }
  }, [role]);
}
