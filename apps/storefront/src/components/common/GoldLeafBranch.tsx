import React from 'react';

interface GoldLeafBranchProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number; // width in pixels
  opacity?: number;
}

export const GoldLeafBranch: React.FC<GoldLeafBranchProps> = ({
  className = '',
  position = 'top-left',
  size = 140,
  opacity = 0.9,
}) => {
  // Determine transform based on position
  let transform = '';
  if (position === 'top-right') {
    transform = 'scaleX(-1)';
  } else if (position === 'bottom-left') {
    transform = 'scaleY(-1)';
  } else if (position === 'bottom-right') {
    transform = 'scale(-1, -1)';
  }

  const height = Math.round(size * 0.9);

  return (
    <div
      className={`pointer-events-none select-none z-10 ${className}`}
      style={{
        width: size,
        height: height,
        transform: transform || undefined,
        opacity,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Metallic Gold Primary Gradient */}
          <linearGradient id="goldStem" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2BD" />
            <stop offset="35%" stopColor="#DFB850" />
            <stop offset="70%" stopColor="#C9A34A" />
            <stop offset="100%" stopColor="#8A661C" />
          </linearGradient>

          {/* Leaf Face Highlight */}
          <linearGradient id="leafGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8D6" />
            <stop offset="40%" stopColor="#E5C158" />
            <stop offset="80%" stopColor="#C9A34A" />
            <stop offset="100%" stopColor="#9C7624" />
          </linearGradient>

          {/* Leaf Face Shadow */}
          <linearGradient id="leafGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2BD5A" />
            <stop offset="50%" stopColor="#B88A2E" />
            <stop offset="100%" stopColor="#6E4D0C" />
          </linearGradient>

          {/* Gold Sheen Filter */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#422900" floodOpacity="0.25" />
          </filter>
        </defs>

        <g filter="url(#goldGlow)">
          {/* Main Curved Stem */}
          <path
            d="M 10 10 C 50 40, 110 80, 185 160"
            stroke="url(#goldStem)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Secondary Delicate Branch */}
          <path
            d="M 60 48 C 90 35, 130 35, 160 50"
            stroke="url(#goldStem)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* --- Botanical Leaves Along Stems (Dual-Tone for 3D metallic volume) --- */}

          {/* Leaf 1 (Top Origin) */}
          <g transform="translate(18, 16) rotate(-25)">
            <path d="M 0 0 C 10 -15, 25 -18, 38 -15 C 26 -5, 15 2, 0 0 Z" fill="url(#leafGradLight)" />
            <path d="M 0 0 C 15 2, 26 -5, 38 -15 C 28 -2, 18 8, 0 0 Z" fill="url(#leafGradDark)" />
            <line x1="0" y1="0" x2="38" y2="-15" stroke="#FFE9A3" strokeWidth="0.8" opacity="0.8" />
          </g>

          {/* Leaf 2 (Upper Left) */}
          <g transform="translate(35, 30) rotate(-65)">
            <path d="M 0 0 C 12 -18, 30 -22, 45 -18 C 32 -6, 18 3, 0 0 Z" fill="url(#leafGradLight)" />
            <path d="M 0 0 C 18 3, 32 -6, 45 -18 C 34 -2, 20 10, 0 0 Z" fill="url(#leafGradDark)" />
            <line x1="0" y1="0" x2="45" y2="-18" stroke="#FFE9A3" strokeWidth="0.8" opacity="0.8" />
          </g>

          {/* Leaf 3 (Upper Right) */}
          <g transform="translate(48, 40) rotate(15)">
            <path d="M 0 0 C 12 -16, 28 -18, 42 -14 C 28 -5, 16 3, 0 0 Z" fill="url(#leafGradLight)" />
            <path d="M 0 0 C 16 3, 28 -5, 42 -14 C 30 -1, 18 8, 0 0 Z" fill="url(#leafGradDark)" />
            <line x1="0" y1="0" x2="42" y2="-14" stroke="#FFE9A3" strokeWidth="0.8" opacity="0.8" />
          </g>

          {/* Leaf 4 (Side Branch Tip) */}
          <g transform="translate(160, 50) rotate(20)">
            <path d="M 0 0 C 10 -14, 24 -16, 36 -12 C 24 -4, 14 3, 0 0 Z" fill="url(#leafGradLight)" />
            <path d="M 0 0 C 14 3, 24 -4, 36 -12 C 26 -1, 16 7, 0 0 Z" fill="url(#leafGradDark)" />
            <line x1="0" y1="0" x2="36" y2="-12" stroke="#FFE9A3" strokeWidth="0.7" opacity="0.8" />
          </g>

          {/* Leaf 5 (Side Branch Middle) */}
          <g transform="translate(110, 38) rotate(-10)">
            <path d="M 0 0 C 11 -15, 26 -18, 40 -14 C 26 -5, 15 2, 0 0 Z" fill="url(#leafGradLight)" />
            <path d="M 0 0 C 15 2, 26 -5, 40 -14 C 28 0, 16 8, 0 0 Z" fill="url(#leafGradDark)" />
            <line x1="0" y1="0" x2="40" y2="-14" stroke="#FFE9A3" strokeWidth="0.8" opacity="0.8" />
          </g>

          {/* Leaf 6 (Mid Main Stem Left) */}
          <g transform="translate(85, 68) rotate(-55)">
            <path d="M 0 0 C 14 -20, 34 -24, 52 -20 C 36 -7, 20 4, 0 0 Z" fill="url(#leafGradLight)" />
            <path d="M 0 0 C 20 4, 36 -7, 52 -20 C 40 -2, 24 10, 0 0 Z" fill="url(#leafGradDark)" />
            <line x1="0" y1="0" x2="52" y2="-20" stroke="#FFE9A3" strokeWidth="0.9" opacity="0.8" />
          </g>

          {/* Leaf 7 (Mid Main Stem Right) */}
          <g transform="translate(105, 80) rotate(25)">
            <path d="M 0 0 C 14 -18, 32 -20, 48 -16 C 32 -5, 18 3, 0 0 Z" fill="url(#leafGradLight)" />
            <path d="M 0 0 C 18 3, 32 -5, 48 -16 C 36 -1, 20 8, 0 0 Z" fill="url(#leafGradDark)" />
            <line x1="0" y1="0" x2="48" y2="-16" stroke="#FFE9A3" strokeWidth="0.8" opacity="0.8" />
          </g>

          {/* Leaf 8 (Lower Stem Left) */}
          <g transform="translate(132, 108) rotate(-40)">
            <path d="M 0 0 C 13 -18, 32 -22, 48 -18 C 34 -6, 18 3, 0 0 Z" fill="url(#leafGradLight)" />
            <path d="M 0 0 C 18 3, 34 -6, 48 -18 C 36 -1, 22 9, 0 0 Z" fill="url(#leafGradDark)" />
            <line x1="0" y1="0" x2="48" y2="-18" stroke="#FFE9A3" strokeWidth="0.8" opacity="0.8" />
          </g>

          {/* Leaf 9 (Lower Stem Right) */}
          <g transform="translate(150, 124) rotate(35)">
            <path d="M 0 0 C 12 -16, 28 -18, 42 -14 C 28 -4, 16 3, 0 0 Z" fill="url(#leafGradLight)" />
            <path d="M 0 0 C 16 3, 28 -4, 42 -14 C 30 0, 18 7, 0 0 Z" fill="url(#leafGradDark)" />
            <line x1="0" y1="0" x2="42" y2="-14" stroke="#FFE9A3" strokeWidth="0.8" opacity="0.8" />
          </g>

          {/* Leaf 10 (Main Stem Terminal Tip) */}
          <g transform="translate(185, 160) rotate(50)">
            <path d="M 0 0 C 12 -15, 26 -17, 38 -13 C 25 -4, 14 3, 0 0 Z" fill="url(#leafGradLight)" />
            <path d="M 0 0 C 14 3, 25 -4, 38 -13 C 28 0, 16 7, 0 0 Z" fill="url(#leafGradDark)" />
            <line x1="0" y1="0" x2="38" y2="-13" stroke="#FFE9A3" strokeWidth="0.7" opacity="0.8" />
          </g>
        </g>
      </svg>
    </div>
  );
};

