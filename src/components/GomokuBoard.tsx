import React, { useEffect, useRef, useState } from 'react';
import { BOARD_SIZE, COLORS } from '../constants';
import { Player, Move } from '../types';

interface BoardProps {
  board: Player[][];
  onMove: (x: number, y: number) => void;
  currentPlayer: Player;
  disabled: boolean;
  lastMove: Move | null;
}

const GomokuBoard: React.FC<BoardProps> = ({ board, onMove, currentPlayer, disabled, lastMove }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverPos, setHoverPos] = useState<Move | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const cellSize = size / (BOARD_SIZE + 1);
    const stoneRadius = (cellSize / 2) * 0.85;

    // Main Canvas background
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = COLORS.BOARD;
    ctx.fillRect(0, 0, size, size);

    // Subtle grain pattern
    ctx.strokeStyle = '#000';
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < size; i += 2) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Visible grid
    ctx.strokeStyle = COLORS.LINE;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    for (let i = 0; i < BOARD_SIZE; i++) {
      // Horizontal
      ctx.moveTo(cellSize, cellSize * (i + 1));
      ctx.lineTo(cellSize * BOARD_SIZE, cellSize * (i + 1));
      // Vertical
      ctx.moveTo(cellSize * (i + 1), cellSize);
      ctx.lineTo(cellSize * (i + 1), cellSize * BOARD_SIZE);
    }
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Star points
    const starPoints = [3, 7, 11];
    ctx.fillStyle = COLORS.LINE;
    starPoints.forEach(row => {
      starPoints.forEach(col => {
        ctx.beginPath();
        ctx.arc((col + 1) * cellSize, (row + 1) * cellSize, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    });

    // Hover marker
    if (hoverPos && !disabled && board[hoverPos.y][hoverPos.x] === Player.EMPTY) {
      ctx.fillStyle = COLORS.HOVER;
      ctx.beginPath();
      ctx.arc((hoverPos.x + 1) * cellSize, (hoverPos.y + 1) * cellSize, stoneRadius, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Stones
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (board[y][x] !== Player.EMPTY) {
          const cx = (x + 1) * cellSize;
          const cy = (y + 1) * cellSize;

          ctx.beginPath();
          ctx.arc(cx, cy, stoneRadius, 0, 2 * Math.PI);

          const isBlack = board[y][x] === Player.BLACK;
          const gradient = ctx.createRadialGradient(cx - stoneRadius * 0.3, cy - stoneRadius * 0.3, stoneRadius * 0.1, cx, cy, stoneRadius);
          
          if (isBlack) {
            gradient.addColorStop(0, '#555');
            gradient.addColorStop(1, '#000');
          } else {
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#ccc');
          }

          ctx.fillStyle = gradient;
          ctx.fill();

          // Last move indicator
          if (lastMove && lastMove.x === x && lastMove.y === y) {
            ctx.strokeStyle = '#ff3d00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, stoneRadius * 0.3, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }
      }
    }
  };

  useEffect(() => {
    draw();
  }, [board, hoverPos, lastMove]);

  const getBoardCoords = (e: React.MouseEvent | React.TouchEvent): Move | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    let clientX, clientY;
    
    if ('touches' in e.nativeEvent && e.nativeEvent.touches.length > 0) {
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cellSize = canvas.width / (BOARD_SIZE + 1);

    const boardX = Math.round((x * scaleX) / cellSize) - 1;
    const boardY = Math.round((y * scaleY) / cellSize) - 1;

    if (boardX >= 0 && boardX < BOARD_SIZE && boardY >= 0 && boardY < BOARD_SIZE) {
      return { x: boardX, y: boardY };
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getBoardCoords(e);
    setHoverPos(coords);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    const coords = getBoardCoords(e);
    if (coords && board[coords.y][coords.x] === Player.EMPTY) {
      onMove(coords.x, coords.y);
    }
  };

  return (
    <div className="relative group touch-none p-4 bg-[#D4A373]/20 rounded-lg border-4 border-[#A67C52]/40 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full max-w-[560px] aspect-square shadow-xl border-2 border-[#C89D74] cursor-crosshair transition-transform active:scale-[0.99]"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverPos(null)}
        onClick={handleClick}
      />
    </div>
  );
};

export default GomokuBoard;
