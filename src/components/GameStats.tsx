import React from 'react';
import { Player, Move } from '../types';

interface StatsProps {
  moveHistory: Move[];
  isThinking: boolean;
}

const GameStats: React.FC<StatsProps> = ({ moveHistory, isThinking }) => {
  // Mocking record for design purposes as per the HTML template
  const stats = { wins: 12, losses: 8 };

  return (
    <aside className="w-72 border-l border-natural-border p-8 flex flex-col h-full bg-natural-bg">
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-natural-muted font-bold mb-5">전적</p>
        <div className="flex justify-between border-b border-natural-border pb-6">
          <div className="text-center flex-1">
            <span className="block text-3xl font-serif text-natural-text">{stats.wins}</span>
            <span className="text-[10px] text-natural-muted font-bold uppercase tracking-tighter">승리</span>
          </div>
          <div className="w-[1px] bg-natural-border"></div>
          <div className="text-center flex-1">
            <span className="block text-3xl font-serif text-natural-text">{stats.losses}</span>
            <span className="text-[10px] text-natural-muted font-bold uppercase tracking-tighter">패배</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-natural-muted font-bold">대국 기록</p>
          {isThinking && (
            <span className="text-[10px] italic text-natural-accent animate-pulse font-serif">AI 생각 중...</span>
          )}
        </div>
        
        <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          {moveHistory.slice(-10).reverse().map((move, idx) => {
            const player = (moveHistory.length - idx) % 2 === 1 ? Player.BLACK : Player.WHITE;
            const coord = `${String.fromCharCode(65 + move.x)}${BOARD_SIZE - move.y}`;
            
            return (
              <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                <span className={`w-3.5 h-3.5 rounded-full shadow-sm ${
                  player === Player.BLACK ? 'bg-black' : 'bg-white border border-natural-border'
                }`}></span>
                <span className="text-sm font-mono text-natural-text font-medium">{coord}</span>
                <span className="ml-auto text-[10px] font-mono text-natural-muted">
                   {moveHistory.length - idx}수
                </span>
              </div>
            );
          })}
          {moveHistory.length === 0 && (
            <p className="text-xs italic text-natural-muted opacity-60">기보가 비어 있습니다.</p>
          )}
        </div>
      </div>

      <div className="mt-auto p-6 bg-natural-accent/5 rounded-[24px] border border-natural-accent/10">
        <p className="text-xs leading-relaxed italic text-natural-accent font-serif tracking-tight">
          "인내는 모든 성공적인 한 수의 기초입니다."
        </p>
      </div>
    </aside>
  );
};

const BOARD_SIZE = 15; // Local copy for coord calc

export default GameStats;
