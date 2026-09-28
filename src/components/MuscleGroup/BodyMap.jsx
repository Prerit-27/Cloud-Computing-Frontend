import { useId } from 'react';
import { BODY_OUTLINE, FRONT_MUSCLES, BACK_MUSCLES } from '../../utils/muscleData';

/**
 * Interactive anatomical body map.
 *
 * Renders a hand-drawn SVG figure where every muscle group is its own
 * hoverable / clickable region. Symmetric muscles are drawn once and mirrored
 * around the centre line so both sides always stay in sync.
 *
 * Props
 *  view      'front' | 'back'
 *  active    id of the hovered muscle
 *  selected  id of the clicked muscle
 *  onHover   (id | null) => void
 *  onSelect  (id) => void
 *  showLabels  render the small floating labels next to each region
 */
export default function BodyMap({
  view = 'front',
  active = null,
  selected = null,
  onHover = () => {},
  onSelect = () => {},
  showLabels = true,
  className = '',
}) {
  const uid = useId().replace(/:/g, '');
  const muscles = view === 'front' ? FRONT_MUSCLES : BACK_MUSCLES;

  return (
    <svg
      viewBox="0 0 240 560"
      className={`w-full h-full select-none ${className}`}
      role="img"
      aria-label={`${view} view muscle map`}
    >
      <defs>
        <linearGradient id={`${uid}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C1F24" />
          <stop offset="100%" stopColor="#121418" />
        </linearGradient>

        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Each muscle path is defined once, then used twice (normal + mirrored). */}
        {muscles.map((m) => (
          <path key={m.id} id={`${uid}-${m.id}`} d={m.d} />
        ))}
      </defs>

      {/* ---- Body silhouette (left half + mirrored right half) ---- */}
      <g fill={`url(#${uid}-skin)`}>
        <path d={BODY_OUTLINE} />
        <path d={BODY_OUTLINE} transform="translate(240,0) scale(-1,1)" />
      </g>

      {/* Torso centre line only — stops below the neck so the head stays clean */}
      <line
        x1="120"
        y1="100"
        x2="120"
        y2="262"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />

      {/* ---- Muscle regions ---- */}
      {muscles.map((m) => {
        const isActive = active === m.id;
        const isSelected = selected === m.id;
        const lit = isActive || isSelected;

        return (
          <g
            key={m.id}
            onMouseEnter={() => onHover(m.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(m.id)}
            onFocus={() => onHover(m.id)}
            onBlur={() => onHover(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(m.id);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={m.label}
            aria-pressed={isSelected}
            className="cursor-pointer outline-none"
            style={{
              fill: lit ? m.color : 'rgba(255,255,255,0.07)',
              stroke: lit ? m.color : 'rgba(255,255,255,0.14)',
              strokeWidth: lit ? 1.4 : 1,
              fillOpacity: isSelected ? 0.85 : isActive ? 0.6 : 1,
              filter: lit ? `url(#${uid}-glow)` : 'none',
              transition: 'fill 250ms ease, stroke 250ms ease, fill-opacity 250ms ease',
            }}
          >
            <use href={`#${uid}-${m.id}`} />
            {m.mirror && (
              <use href={`#${uid}-${m.id}`} transform="translate(240,0) scale(-1,1)" />
            )}
          </g>
        );
      })}

      {/* ---- Floating labels ---- */}
      {showLabels &&
        muscles.map((m) => {
          const lit = active === m.id || selected === m.id;
          if (!lit) return null;
          const { x, y } = m.labelAt;
          const flip = x < 120;
          const lineEnd = flip ? 16 : 224;

          return (
            <g key={`lbl-${m.id}`} pointerEvents="none">
              <line
                x1={x}
                y1={y}
                x2={lineEnd}
                y2={y}
                stroke={m.color}
                strokeWidth="0.8"
                strokeDasharray="2 3"
                opacity="0.7"
              />
              <circle cx={x} cy={y} r="2.2" fill={m.color} />
              <text
                x={lineEnd}
                y={y - 5}
                fill={m.color}
                fontSize="11"
                fontWeight="600"
                textAnchor={flip ? 'start' : 'end'}
                style={{ letterSpacing: '0.02em' }}
              >
                {m.label}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
