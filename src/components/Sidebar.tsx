import React from 'react';
import { Player } from '../types';

interface SidebarProps {
  onRestart: () => void;
  currentPlayer: Player;
}

const Sidebar: React.FC<SidebarProps> = ({ onRestart, currentPlayer }) => {
  return (
    <aside className="w-72 border-r border-natural-border p-8 flex flex-col justify-between h-full">
      <div>
        <h1 className="font-serif italic text-4xl mb-1 tracking-tight text-natural-text">Zen</h1>
        <h2 className="font-serif text-2xl opacity-60 mb-10 text-natural-text">오목</h2>
        
        <div className="space-y-8">
          <div className="space-y-1.5 text-natural-text">
            <p className="text-[10px] uppercase tracking-[0.2em] text-natural-muted font-bold">경기 방식</p>
            <p className="text-xl font-serif">사람 vs. AI</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-natural-muted font-bold">난이도</p>
            <div className="flex gap-2">
              <span className="px-3.5 py-1.5 bg-natural-border/50 text-natural-text rounded-full text-[10px] font-bold uppercase">초보</span>
              <span className="px-3.5 py-1.5 bg-natural-accent text-white rounded-full text-[10px] font-bold uppercase shadow-sm">고수</span>
            </div>
          </div>

          <div className="mt-12 p-8 bg-white rounded-[40px] border border-natural-border flex flex-col items-center shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-natural-muted font-bold mb-5">현재 차례</p>
            <div className={`w-14 h-14 rounded-full shadow-lg border-2 transition-all duration-500 ${
              currentPlayer === Player.BLACK 
                ? 'bg-black border-black ring-4 ring-black/5 scale-110' 
                : 'bg-white border-natural-border ring-4 ring-natural-border/10 scale-100'
            }`} />
            <p className="mt-4 font-serif italic text-lg text-natural-text">
              {currentPlayer === Player.BLACK ? '흑돌 차례' : '백돌 차례'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onRestart}
          className="w-full py-4 bg-natural-accent text-white rounded-full font-medium hover:opacity-90 active:scale-95 transition-all shadow-md tracking-wide"
        >
          경기를 다시 시작
        </button>
        <button className="w-full py-4 border border-natural-accent text-natural-accent rounded-full font-medium hover:bg-natural-accent hover:text-white transition-all tracking-wide">
          환경 설정
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
