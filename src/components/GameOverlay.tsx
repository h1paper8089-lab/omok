import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '../types';
import { Trophy, RotateCcw } from 'lucide-react';

interface OverlayProps {
  winner: Player | null;
  onRestart: () => void;
  isVisible: boolean;
}

const GameOverlay: React.FC<OverlayProps> = ({ winner, onRestart, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-natural-bg/80 backdrop-blur-md rounded-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white border border-natural-border p-12 rounded-[40px] shadow-2xl flex flex-col items-center text-center space-y-8"
      >
        <div className="bg-natural-accent/10 p-5 rounded-full">
          <Trophy className="w-14 h-14 text-natural-accent" />
        </div>
        
        <div>
          <h2 className="text-4xl font-serif italic mb-2 text-natural-text">
            {winner === Player.BLACK ? '흑돌 승리' : winner === Player.WHITE ? '백돌 승리' : '무승부'}
          </h2>
          <p className="text-natural-muted font-sans text-xs tracking-[0.2em] uppercase font-semibold">
            {winner === Player.BLACK ? '절묘한 한 수였습니다' : 'AI가 승리했습니다'}
          </p>
        </div>

        <button
          onClick={onRestart}
          className="flex items-center gap-3 px-10 py-4 bg-natural-accent text-white font-medium rounded-full hover:opacity-90 active:scale-95 transition-all shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
          새 경기 시작
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GameOverlay;
