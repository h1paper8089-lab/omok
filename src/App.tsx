/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import GomokuBoard from './components/GomokuBoard';
import GameStats from './components/GameStats';
import GameOverlay from './components/GameOverlay';
import Sidebar from './components/Sidebar';
import { Player, Move } from './types';
import { BOARD_SIZE } from './constants';
import { checkWin, findBestMove } from './lib/gameLogic';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [board, setBoard] = useState<Player[][]>(() => 
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(Player.EMPTY))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.BLACK);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [history, setHistory] = useState<Move[]>([]);

  const handleRestart = () => {
    setBoard(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(Player.EMPTY)));
    setCurrentPlayer(Player.BLACK);
    setGameOver(false);
    setWinner(null);
    setIsAIThinking(false);
    setHistory([]);
  };

  const placeStone = useCallback((x: number, y: number) => {
    if (gameOver || board[y][x] !== Player.EMPTY) return;

    const newBoard = board.map(row => [...row]);
    newBoard[y][x] = currentPlayer;
    setBoard(newBoard);
    
    const newHistory = [...history, { x, y }];
    setHistory(newHistory);

    if (checkWin(newBoard, x, y, currentPlayer)) {
      setGameOver(true);
      setWinner(currentPlayer);
      if (currentPlayer === Player.BLACK) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5A5A40', '#EBC49F', '#000']
        });
      }
      return;
    }

    setCurrentPlayer(prev => (prev === Player.BLACK ? Player.WHITE : Player.BLACK));
  }, [board, currentPlayer, gameOver, history]);

  useEffect(() => {
    if (!gameOver && currentPlayer === Player.WHITE) {
      setIsAIThinking(true);
      const timer = setTimeout(() => {
        const move = findBestMove(board);
        placeStone(move.x, move.y);
        setIsAIThinking(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver, board, placeStone]);

  const lastMove = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="h-screen bg-natural-bg text-natural-text flex overflow-hidden font-sans selection:bg-natural-accent/20">
      {/* Left Sidebar */}
      <Sidebar onRestart={handleRestart} currentPlayer={currentPlayer} />

      {/* Main Content: Game Board */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-8 bg-[#fdfaf5]">
        <div className="relative">
          <GomokuBoard 
            board={board} 
            onMove={placeStone} 
            currentPlayer={currentPlayer}
            disabled={gameOver || isAIThinking || currentPlayer === Player.WHITE}
            lastMove={lastMove}
          />
          <GameOverlay 
            isVisible={gameOver} 
            winner={winner} 
            onRestart={handleRestart} 
          />
        </div>

        {/* Floating Indicator */}
        <AnimatePresence>
          {isAIThinking && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-12 bg-white/80 backdrop-blur-md px-10 py-4 rounded-full border border-natural-border shadow-sm"
            >
              <p className="text-sm font-serif italic text-natural-accent animate-pulse">
                AI가 전략적인 다음 수를 구상 중입니다...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!gameOver && !isAIThinking && currentPlayer === Player.BLACK && (
          <div className="absolute bottom-12 opacity-40">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-natural-muted">
              당신의 차례입니다
            </p>
          </div>
        )}
      </main>

      {/* Right Sidebar: Record & Move Log */}
      <GameStats 
        moveHistory={history}
        isThinking={isAIThinking}
      />
    </div>
  );
}

