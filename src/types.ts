export type Answer = { text: string; points: number };
export type Round = { question: string; answers: Answer[] };
export type Team = { name: string; score: number };

export type GameState = {
  rounds: Round[];
  roundIndex: number;
  revealed: boolean[];
  strikes: number;
  pot: number;
  teams: [Team, Team];
  activeTeam: 0 | 1 | null;
  showStrike: boolean;
};
