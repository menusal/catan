import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a0f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    const newPieces = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 4,
      drift: (Math.random() - 0.5) * 40
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100]">
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0vh) rotate(0deg) translateX(0px);
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(720deg) translateX(var(--drift));
            opacity: 0.3;
          }
        }
        .confetti-piece {
          position: absolute;
          animation: fall linear infinite;
        }
      `}</style>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            '--drift': `${p.drift}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          } as any}
        />
      ))}
    </div>
  );
};

export default Confetti;
