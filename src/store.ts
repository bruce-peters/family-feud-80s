import { create } from 'zustand';
import type { GameState, Round } from './types';
import triviaData from './data/trivia.json';
import { play } from './lib/sounds';

const rounds = triviaData as Round[];

function initialRevealed(r: Round): boolean[] {
  return new Array(r.answers.length).fill(false);
}

type Actions = {
  reveal: (i: number) => void;
  strike: () => void;
  clearStrike: () => void;
  award: (team: 0 | 1) => void;
  setActiveTeam: (t: 0 | 1 | null) => void;
  setTeamName: (t: 0 | 1, name: string) => void;
  nextRound: () => void;
  prevRound: () => void;
  resetRound: () => void;
  resetGame: () => void;
  hydrate: (s: GameState) => void;
};

const initial: GameState = {
  rounds,
  roundIndex: 0,
  revealed: initialRevealed(rounds[0]),
  strikes: 0,
  pot: 0,
  teams: [{ name: 'TEAM 1', score: 0 }, { name: 'TEAM 2', score: 0 }],
  activeTeam: null,
  showStrike: false,
};

export const useGame = create<GameState & Actions>((set, get) => ({
  ...initial,
  reveal: (i) => {
    const s = get();
    if (s.revealed[i]) return;
    const ans = s.rounds[s.roundIndex].answers[i];
    const revealed = s.revealed.slice();
    revealed[i] = true;
    play('ding');
    set({ revealed, pot: s.pot + ans.points });
  },
  strike: () => {
    const s = get();
    play('buzzer');
    set({ strikes: Math.min(3, s.strikes + 1), showStrike: true });
    setTimeout(() => {
      if (get().showStrike) set({ showStrike: false });
    }, 1700);
  },
  clearStrike: () => set({ showStrike: false }),
  award: (team) => {
    const s = get();
    const teams = s.teams.slice() as [GameState['teams'][0], GameState['teams'][1]];
    teams[team] = { ...teams[team], score: teams[team].score + s.pot };
    set({ teams, pot: 0, strikes: 0, activeTeam: null });
  },
  setActiveTeam: (t) => set({ activeTeam: t }),
  setTeamName: (t, name) => {
    const teams = get().teams.slice() as [GameState['teams'][0], GameState['teams'][1]];
    teams[t] = { ...teams[t], name };
    set({ teams });
  },
  nextRound: () => {
    const s = get();
    const ni = Math.min(s.rounds.length - 1, s.roundIndex + 1);
    set({
      roundIndex: ni,
      revealed: initialRevealed(s.rounds[ni]),
      strikes: 0,
      pot: 0,
      activeTeam: null,
      showStrike: false,
    });
  },
  prevRound: () => {
    const s = get();
    const ni = Math.max(0, s.roundIndex - 1);
    set({
      roundIndex: ni,
      revealed: initialRevealed(s.rounds[ni]),
      strikes: 0,
      pot: 0,
      activeTeam: null,
      showStrike: false,
    });
  },
  resetRound: () => {
    const s = get();
    set({
      revealed: initialRevealed(s.rounds[s.roundIndex]),
      strikes: 0,
      pot: 0,
      activeTeam: null,
      showStrike: false,
    });
  },
  resetGame: () => set({ ...initial, revealed: initialRevealed(rounds[0]) }),
  hydrate: (s) => set(s),
}));

export function snapshot(): GameState {
  const { rounds, roundIndex, revealed, strikes, pot, teams, activeTeam, showStrike } = useGame.getState();
  return { rounds, roundIndex, revealed, strikes, pot, teams, activeTeam, showStrike };
}
