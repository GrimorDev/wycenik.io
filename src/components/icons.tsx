interface IconProps {
  className?: string;
}

const BASE_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M9 12.5l1.8 1.8L15.5 9.5" />
    </svg>
  );
}

export function CircleIcon({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function GearIcon({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H10a1.65 1.65 0 0 0 1-1.51V4a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V10a1.65 1.65 0 0 0 1.51 1H20a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function CreditCardIcon({ className }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.25" />
      <path d="M2.5 9.5h19" />
      <path d="M6.5 14h4" />
    </svg>
  );
}

export function StatusDotIcon({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true">
      <circle
        cx="6"
        cy="6"
        r={filled ? 5 : 4.25}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
      />
    </svg>
  );
}
