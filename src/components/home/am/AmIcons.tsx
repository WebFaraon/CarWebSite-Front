interface IconProps {
  size?: number
  className?: string
  fill?: string
  strokeWidth?: number
}

function Base({
  size = 18,
  className,
  fill = 'none',
  strokeWidth = 1.5,
  d,
}: IconProps & { d: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

export const SearchIcon = (p: IconProps) => (
  <Base {...p} d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35" />
)

export const CloseIcon = (p: IconProps) => (
  <Base {...p} d="M6 6l12 12M18 6L6 18" />
)

export const SunIcon = (p: IconProps) => (
  <Base
    {...p}
    d="M12 4V2M12 22v-2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
  />
)

export const MoonIcon = (p: IconProps) => (
  <Base {...p} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
)

export const HeartIcon = (p: IconProps) => (
  <Base
    {...p}
    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  />
)

export const MenuIcon = (p: IconProps) => (
  <Base {...p} d="M3 6h18M3 12h18M3 18h18" />
)

export const SlidersIcon = (p: IconProps) => (
  <Base
    {...p}
    d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0 M14 4v4M8 10v4M16 16v4"
  />
)

export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p} d="M5 12h14M13 5l7 7-7 7" />
)

export const SOCIAL_PATHS = {
  facebook:
    'M22 12a10 10 0 1 0-11.6 9.87v-6.99H7.9V12h2.5V9.8c0-2.47 1.47-3.84 3.72-3.84 1.08 0 2.21.2 2.21.2v2.43h-1.25c-1.23 0-1.61.77-1.61 1.55V12h2.75l-.44 2.88h-2.31v6.99A10 10 0 0 0 22 12z',
  instagram:
    'M16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3zm-4.5 13a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm5.25-8.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z',
  x: 'M18 3h3l-7.5 8.57L22 21h-6.56l-5.13-6.7L4.5 21H1.5l8.06-9.2L1.5 3h6.72l4.6 6.1L18 3z',
  linkedin:
    'M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 21V9.5h4V21H3zm7-11.5h3.85v1.65h.05c.54-1 1.86-2.05 3.83-2.05C21.4 9.1 22 11 22 14.07V21h-4v-6.13c0-1.46-.03-3.35-2.04-3.35-2.05 0-2.36 1.6-2.36 3.25V21H10V9.5z',
} as const

export type SocialKey = keyof typeof SOCIAL_PATHS
