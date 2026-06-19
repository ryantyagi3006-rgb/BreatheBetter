// Animated concentric "breathing" orb. `active` makes it breathe; otherwise calm.
// `tone` switches the color story for status (normal/borderline/low) or neutral.
const TONES = {
  neutral:    { from: '#185FA5', to: '#B5D4F4', glow: 'rgba(24,95,165,0.35)' },
  brand:      { from: '#042C53', to: '#185FA5', glow: 'rgba(4,44,83,0.45)' },
  Normal:     { from: '#059669', to: '#6EE7B7', glow: 'rgba(5,150,105,0.40)' },
  Borderline: { from: '#D97706', to: '#FCD34D', glow: 'rgba(217,119,6,0.40)' },
  Low:        { from: '#DC2626', to: '#FCA5A5', glow: 'rgba(220,38,38,0.40)' },
};

export default function BreathingOrb({ size = 180, active = false, tone = 'neutral', children }) {
  const c = TONES[tone] || TONES.neutral;
  return (
    <div className="relative flex items-center justify-center reduce-motion-safe" style={{ width: size, height: size }}>
      {/* Outer halo rings */}
      <span
        className={`absolute inset-0 rounded-full ${active ? 'animate-breathe' : ''}`}
        style={{ background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)` }}
      />
      <span
        className={`absolute rounded-full border ${active ? 'animate-breathe' : ''}`}
        style={{ inset: size * 0.12, borderColor: c.from, opacity: 0.25, animationDelay: '0.4s' }}
      />
      {/* Core */}
      <div
        className={`relative rounded-full flex items-center justify-center text-white shadow-xl ${active ? 'animate-breathe-slow' : ''}`}
        style={{
          width: size * 0.62,
          height: size * 0.62,
          background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
          boxShadow: `0 10px 40px ${c.glow}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
