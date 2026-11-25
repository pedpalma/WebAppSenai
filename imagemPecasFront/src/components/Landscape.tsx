// Ilustração vetorial (aurora sobre montanha nevada refletida no lago) usada na tela inicial.
export const Landscape: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#081a45" />
        <stop offset="0.45" stopColor="#1f4f9c" />
        <stop offset="0.7" stopColor="#7fb2e3" />
      </linearGradient>
      <linearGradient id="aurora1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5eead4" stopOpacity="0" />
        <stop offset="0.5" stopColor="#6ee7b7" stopOpacity="0.85" />
        <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.55" stopColor="#cfdcf0" />
        <stop offset="1" stopColor="#7d93b8" />
      </linearGradient>
      <linearGradient id="rock" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2b3a57" />
        <stop offset="1" stopColor="#0e1a33" />
      </linearGradient>
      <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7ba7da" />
        <stop offset="1" stopColor="#1b3f86" />
      </linearGradient>
      <filter id="blur-lg"><feGaussianBlur stdDeviation="28" /></filter>
      <filter id="blur-sm"><feGaussianBlur stdDeviation="4" /></filter>
      <g id="mountains">
        <path d="M0 560 L120 470 L210 500 L330 380 L430 300 L520 250 L600 300 L660 285 L760 380 L860 430 L980 400 L1080 450 L1200 430 L1200 560 Z" fill="url(#snow)" />
        <path d="M430 300 L470 380 L440 450 L500 420 L520 500 L560 430 L600 480 L610 380 L600 300 L520 250 Z" fill="url(#rock)" opacity="0.75" />
        <path d="M330 380 L360 450 L330 520 L400 470 L390 540 L300 560 L210 500 Z" fill="url(#rock)" opacity="0.6" />
        <path d="M660 285 L700 360 L690 430 L760 380 Z" fill="url(#rock)" opacity="0.55" />
        <path d="M860 430 L900 480 L870 540 L960 500 L980 400 Z" fill="url(#rock)" opacity="0.5" />
        <path d="M0 560 L1200 560 L1200 545 L0 548 Z" fill="#0f1f3f" opacity="0.6" />
      </g>
    </defs>

    <rect width="1200" height="560" fill="url(#sky)" />
    {/* estrelas */}
    {[[80, 60], [210, 120], [330, 40], [520, 90], [700, 50], [880, 110], [1010, 70], [1130, 140], [150, 220], [960, 210]].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#fff" opacity="0.8" />
    ))}
    {/* aurora */}
    <g filter="url(#blur-lg)">
      <path d="M420 -40 C460 120 380 220 470 360 L560 360 C500 220 590 110 540 -40 Z" fill="url(#aurora1)" />
      <path d="M620 -60 C700 100 640 220 720 340 L800 330 C730 200 800 80 740 -60 Z" fill="url(#aurora1)" opacity="0.8" />
      <path d="M840 0 C920 120 860 230 960 320 L1040 300 C950 210 1000 100 950 0 Z" fill="url(#aurora1)" opacity="0.6" />
      <ellipse cx="700" cy="200" rx="260" ry="90" fill="#34d399" opacity="0.25" />
    </g>

    <use href="#mountains" />

    {/* lago com reflexo */}
    <rect y="560" width="1200" height="240" fill="url(#lake)" />
    <g opacity="0.45" filter="url(#blur-sm)" transform="translate(0 1120) scale(1 -1)">
      <use href="#mountains" />
    </g>
    <rect y="560" width="1200" height="240" fill="#1d3f88" opacity="0.25" />
  </svg>
);
