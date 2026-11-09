import React from 'react';

interface GoldSilkRibbonProps {
  className?: string;
  variant?: 'top-wave' | 'cascade-right' | 'corner-swirl';
  opacity?: number;
}

export const GoldSilkRibbon: React.FC<GoldSilkRibbonProps> = ({
  className = '',
  variant = 'top-wave',
  opacity = 0.95,
}) => {
  if (variant === 'top-wave') {
    return (
      <div
        className={`pointer-events-none select-none overflow-hidden ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-xl"
          preserveAspectRatio="none"
        >
          <defs>
            {/* 3D Gold Silk Main Face */}
            <linearGradient id="silkFace" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#8C5E14" />
              <stop offset="15%" stopColor="#DFB850" />
              <stop offset="30%" stopColor="#FFF4D0" />
              <stop offset="45%" stopColor="#C9A34A" />
              <stop offset="60%" stopColor="#7E520D" />
              <stop offset="78%" stopColor="#F5D77F" />
              <stop offset="90%" stopColor="#FFEAA7" />
              <stop offset="100%" stopColor="#9C6B1C" />
            </linearGradient>

            {/* 3D Gold Silk Underfold Shadow */}
            <linearGradient id="silkUnderfold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3E2405" />
              <stop offset="25%" stopColor="#7E520D" />
              <stop offset="50%" stopColor="#C9A34A" />
              <stop offset="75%" stopColor="#5E3807" />
              <stop offset="100%" stopColor="#2E1803" />
            </linearGradient>

            {/* Rim Highlight */}
            <linearGradient id="silkRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFF2BD" stopOpacity="0.8" />
            </linearGradient>

            {/* Ambient Silk Shadow */}
            <filter id="silkShadow" x="-10%" y="-20%" width="120%" height="160%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#1A1002" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Underfold Depth Layer */}
          <path
            d="M -20 110 Q 320 180, 720 100 T 1460 70 L 1460 140 Q 1060 180, 720 140 T -20 160 Z"
            fill="url(#silkUnderfold)"
            opacity="0.8"
          />

          {/* Main 3D Flowing Liquid Silk Wave */}
          <g filter="url(#silkShadow)">
            <path
              d="M -20 60 Q 360 160, 740 70 T 1460 50 L 1460 110 Q 1080 140, 740 120 T -20 120 Z"
              fill="url(#silkFace)"
            />

            {/* Specular Silk Edge Highlight */}
            <path
              d="M -20 60 Q 360 160, 740 70 T 1460 50"
              stroke="url(#silkRim)"
              strokeWidth="2.5"
              fill="none"
            />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'cascade-right') {
    return (
      <div
        className={`pointer-events-none select-none ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 320 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="silkCascade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9C6B1C" />
              <stop offset="20%" stopColor="#FFEAA7" />
              <stop offset="40%" stopColor="#C9A34A" />
              <stop offset="60%" stopColor="#5E3807" />
              <stop offset="80%" stopColor="#FFF4D0" />
              <stop offset="100%" stopColor="#8C5E14" />
            </linearGradient>

            <linearGradient id="silkUnderCascade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E1803" />
              <stop offset="50%" stopColor="#6B4109" />
              <stop offset="100%" stopColor="#1E0E01" />
            </linearGradient>

            <filter id="cascadeShadow" x="-20%" y="-10%" width="140%" height="120%">
              <feDropShadow dx="-4" dy="10" stdDeviation="10" floodColor="#261703" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Shadow Underlayer */}
          <path
            d="M 180 0 C 120 180, 260 320, 160 500 C 110 600, 200 680, 280 700 L 320 700 L 320 0 Z"
            fill="url(#silkUnderCascade)"
            opacity="0.6"
          />

          {/* Primary 3D Silk Drape Wave */}
          <g filter="url(#cascadeShadow)">
            <path
              d="M 220 0 C 150 160, 300 300, 200 480 C 140 590, 240 670, 320 680 L 320 0 Z"
              fill="url(#silkCascade)"
            />
            {/* Luminous Rim */}
            <path
              d="M 220 0 C 150 160, 300 300, 200 480 C 140 590, 240 670, 320 680"
              stroke="#FFF8D6"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
            />
          </g>
        </svg>
      </div>
    );
  }

  // Corner Swirl Variant
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 260 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient id="swirlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE8A3" />
            <stop offset="35%" stopColor="#C9A34A" />
            <stop offset="65%" stopColor="#7E520D" />
            <stop offset="85%" stopColor="#DFB850" />
            <stop offset="100%" stopColor="#FFF8D6" />
          </linearGradient>
        </defs>
        <path
          d="M 0 180 Q 90 200, 150 140 T 260 20 L 260 100 Q 180 180, 110 180 T 0 220 Z"
          fill="url(#swirlGrad)"
        />
        <path
          d="M 0 180 Q 90 200, 150 140 T 260 20"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          fill="none"
          opacity="0.85"
        />
      </svg>
    </div>
  );
};

