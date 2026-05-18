export function SearchIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6.5" cy="6.5" r="4.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" />
    </svg>
  )
}

export function MoonIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M14.5 10.5A6.5 6.5 0 0 1 5.5 1.5a6.5 6.5 0 1 0 9 9z" />
    </svg>
  )
}

export function SunIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="3" />
      <line x1="8" y1="1" x2="8" y2="2.5" />
      <line x1="8" y1="13.5" x2="8" y2="15" />
      <line x1="1" y1="8" x2="2.5" y2="8" />
      <line x1="13.5" y1="8" x2="15" y2="8" />
      <line x1="3" y1="3" x2="4" y2="4" />
      <line x1="12" y1="12" x2="13" y2="13" />
      <line x1="3" y1="13" x2="4" y2="12" />
      <line x1="12" y1="4" x2="13" y2="3" />
    </svg>
  )
}

export function HeartIcon({ size = 16, filled = false }) {
  return filled ? (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 0 1 8 3.5a3.5 3.5 0 0 1 6 2c0 4-6 8-6 8z" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 0 1 8 3.5a3.5 3.5 0 0 1 6 2c0 4-6 8-6 8z" />
    </svg>
  )
}

export function NoteIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M7 14V5l7-2v9" />
      <circle cx="5" cy="14" r="2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function SlidersIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="1" y1="3" x2="13" y2="3" />
      <line x1="1" y1="7" x2="13" y2="7" />
      <line x1="1" y1="11" x2="13" y2="11" />
      <circle cx="4" cy="3" r="1.5" fill="var(--bg-card)" strokeWidth="1.5" />
      <circle cx="9" cy="7" r="1.5" fill="var(--bg-card)" strokeWidth="1.5" />
      <circle cx="5" cy="11" r="1.5" fill="var(--bg-card)" strokeWidth="1.5" />
    </svg>
  )
}

export function CardIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="12" height="9" rx="1.5" />
      <rect x="4" y="2" width="10" height="9" rx="1.5" />
    </svg>
  )
}

export function LightbulbIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h4M6.5 14h3" />
      <path d="M8 2a4 4 0 0 1 2.5 7c-.5.4-.5.8-.5 1H6c0-.2 0-.6-.5-1A4 4 0 0 1 8 2z" />
    </svg>
  )
}

export function ShuffleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h2a6 6 0 0 1 5 2.5" />
      <path d="M10.5 4H14l-2-2M14 4l-2 2" />
      <path d="M2 12h2a6 6 0 0 0 5-2.5" />
      <path d="M10.5 12H14l-2-2M14 12l-2 2" />
    </svg>
  )
}

export function ArrowRightIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="7" x2="12" y2="7" />
      <polyline points="8,3 12,7 8,11" />
    </svg>
  )
}

export function CloseIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="2" y1="2" x2="10" y2="10" />
      <line x1="10" y1="2" x2="2" y2="10" />
    </svg>
  )
}
