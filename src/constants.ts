import { Player } from './types';

export const BOARD_SIZE = 15;

export const SCORE_TABLE = {
  // AI (White) Attack Scores
  FIVE: 100000000,
  OPEN_FOUR: 1000000,
  CLOSED_FOUR: 10000,
  OPEN_THREE: 10000,
  CLOSED_THREE: 1000,
  OPEN_TWO: 100,
  CLOSED_TWO: 10,
  ONE: 1,

  // Opponent (Black) Defense Scores
  OPP_FIVE: 50000000,
  OPP_OPEN_FOUR: 500000,
  OPP_CLOSED_FOUR: 5000,
  OPP_OPEN_THREE: 5000,
  OPP_CLOSED_THREE: 500,
  OPP_OPEN_TWO: 50,
  OPP_CLOSED_TWO: 5,
};

export const COLORS = {
  BOARD: '#EBC49F', // Lighter natural wood
  LINE: '#A67C52',
  BLACK_STONE: '#1a1a1a',
  WHITE_STONE: '#f8f9fa',
  HOVER: 'rgba(90, 90, 64, 0.2)', // Matches --color-natural-accent
  LAST_MOVE: 'rgba(90, 90, 64, 0.6)',
};
