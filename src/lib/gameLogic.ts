import { BOARD_SIZE, SCORE_TABLE } from '../constants';
import { Player, Move } from '../types';

export function checkWin(board: Player[][], x: number, y: number, player: Player): boolean {
  const directions = [
    { dx: 1, dy: 0 },  // Horizontal
    { dx: 0, dy: 1 },  // Vertical
    { dx: 1, dy: 1 },  // Diagonal \
    { dx: 1, dy: -1 }  // Diagonal /
  ];

  for (const { dx, dy } of directions) {
    let count = 1;

    // One direction
    for (let i = 1; i < 5; i++) {
      const nx = x + i * dx;
      const ny = y + i * dy;
      if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] === player) {
        count++;
      } else {
        break;
      }
    }

    // Opposite direction
    for (let i = 1; i < 5; i++) {
      const nx = x - i * dx;
      const ny = y - i * dy;
      if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] === player) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 5) return true;
  }
  return false;
}

export function findBestMove(board: Player[][]): Move {
  let bestScore = -Infinity;
  let bestMove: Move | null = null;

  const emptyCells: Move[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] === Player.EMPTY) {
        emptyCells.push({ x, y });
      }
    }
  }

  if (emptyCells.length === BOARD_SIZE * BOARD_SIZE) {
    return { x: 7, y: 7 }; // Start at center
  }

  for (const cell of emptyCells) {
    const { x, y } = cell;

    const attackScore = calculateScoreForCell(board, x, y, Player.WHITE, Player.BLACK);
    const defenseScore = calculateScoreForCell(board, x, y, Player.BLACK, Player.WHITE);

    const currentScore = attackScore + defenseScore;

    if (currentScore > bestScore) {
      bestScore = currentScore;
      bestMove = { x, y };
    }
  }

  return bestMove || emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function calculateScoreForCell(board: Player[][], x: number, y: number, player: Player, opponent: Player): number {
  let totalScore = 0;
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

  for (const [dx, dy] of directions) {
    let line = '';
    for (let i = -4; i <= 4; i++) {
      const nx = x + i * dx;
      const ny = y + i * dy;

      if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) {
        line += 'X';
      } else if (i === 0) {
        line += 'P';
      } else if (board[ny][nx] === player) {
        line += 'P';
      } else if (board[ny][nx] === opponent) {
        line += 'O';
      } else {
        line += '_';
      }
    }
    totalScore += evaluateLine(line, player === Player.WHITE);
  }
  return totalScore;
}

function evaluateLine(line: string, isAI: boolean): number {
  const s = SCORE_TABLE;
  let score = 0;

  if (line.includes('PPPPP')) score += isAI ? s.FIVE : s.OPP_FIVE;
  if (line.includes('_PPPP_')) score += isAI ? s.OPEN_FOUR : s.OPP_OPEN_FOUR;
  if (/(OPPPP_)|(_PPPPO)/.test(line)) score += isAI ? s.CLOSED_FOUR : s.OPP_CLOSED_FOUR;
  if (line.includes('P_PPP') || line.includes('PP_PP')) score += isAI ? s.CLOSED_FOUR / 2 : s.OPP_CLOSED_FOUR / 2;
  if (line.includes('_PPP_')) score += isAI ? s.OPEN_THREE : s.OPP_OPEN_THREE;
  if (/(OPPP_)|(_PPPO)/.test(line)) score += isAI ? s.CLOSED_THREE : s.OPP_CLOSED_THREE;
  if (line.includes('P_PP_') || line.includes('_PP_P')) score += isAI ? s.CLOSED_THREE / 2 : s.OPP_CLOSED_THREE / 2;
  if (line.includes('__PP__') || line.includes('_P_P_')) score += isAI ? s.OPEN_TWO : s.OPP_OPEN_TWO;
  if (/(OPP__)|(__PPO)/.test(line)) score += isAI ? s.CLOSED_TWO : s.OPP_CLOSED_TWO;

  return score;
}
