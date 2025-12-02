import React, { useState, useRef } from 'react';
import { useCurrentTheme } from '../../hooks/useCurrentTheme';

interface HotspotQuestionProps {
  imageUrl: string;
  targetX: number; // Percentage 0-100
  targetY: number; // Percentage 0-100
  onAnswer: (result: string) => void;
  disabled?: boolean;
  onHotspotClick?: (x: number, y: number) => void;
}

const HotspotQuestion: React.FC<HotspotQuestionProps> = ({
  imageUrl,
  targetX,
  targetY,
  onAnswer,
  disabled = false,
  onHotspotClick,
}) => {
  const { theme } = useCurrentTheme();
  const imageRef = useRef<HTMLImageElement>(null);
  const [marker, setMarker] = useState<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    // Allow click if not disabled OR if onHotspotClick is provided (editor mode)
    if (disabled && !onHotspotClick) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (onHotspotClick) {
      onHotspotClick(x, y);
      return;
    }

    setMarker({ x, y });

    // Calculate distance
    const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));
    const tolerance = 5; // 5% tolerance radius

    const isCorrect = distance <= tolerance;
    const answerResult = isCorrect ? 'correct' : 'incorrect';
    
    setResult(answerResult);
    onAnswer(answerResult);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div 
        className={`relative inline-block rounded-xl overflow-hidden shadow-2xl border border-white/10 ${disabled && !onHotspotClick ? 'cursor-default' : 'cursor-crosshair'}`}
        onClick={handleClick}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Find the hotspot"
          className="max-w-full h-auto max-h-[60vh] select-none pointer-events-none"
        />
        
        {/* User Marker */}
        {marker && (
          <div
            className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 shadow-lg transform transition-all duration-300 ${
              result === 'correct' 
                ? 'bg-green-500 border-white animate-bounce' 
                : result === 'incorrect'
                  ? 'bg-red-500 border-white'
                  : 'bg-cyan-500 border-white'
            }`}
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          />
        )}

        {/* Target Marker (Reveal on answer/disable) */}
        {disabled && (
          <div
            className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-white bg-green-500/50 animate-pulse flex items-center justify-center"
            style={{ left: `${targetX}%`, top: `${targetY}%` }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </div>
      
      {result && (
        <div className={`mt-4 text-lg font-bold uppercase tracking-widest ${result === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
          {result === 'correct' ? 'Target Found!' : 'Missed Target'}
        </div>
      )}
    </div>
  );
};

export default HotspotQuestion;
