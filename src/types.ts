export enum Player {
  EMPTY = 0,
  BLACK = 1,
  WHITE = 2,
}

export interface Move {
  x: number;
  y: number;
}

export interface GameState {
  board: Player[][];
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  history: Move[];
}
