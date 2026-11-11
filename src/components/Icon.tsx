/**
 * Stroke icons, 24x24, drawn for this project (design/preview/*.html icon set).
 * Always decorative: the text next to the icon carries the meaning, so every
 * icon is aria-hidden. Colour follows `currentColor`.
 */
const PATHS = {
  clock: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6" />
    </>
  ),
  sparkle: (
    <path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
  ),
  home: <path d="M3 11.5L12 4l9 7.5M5.5 10v10h13V10M10 20v-6h4v6" />,
  child: (
    <>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21c0-4.5 3-7 7-7s7 2.5 7 7" />
    </>
  ),
  door: (
    <>
      <path d="M6 21V4h12v17M3 21h18" />
      <circle cx="14.5" cy="12.5" r="0.8" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L21 21" />
    </>
  ),
  shuffle: (
    <path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c1.8 0 3-1.2 4-2.8M21 7h-3.5c-1.8 0-3 1.2-4 2.8M18 4l3 3-3 3M18 14l3 3-3 3" />
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  out: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.01" />
    </>
  ),
  bell: (
    <>
      <circle cx="12" cy="13" r="7" />
      <path d="M7.5 13h9M12 16v.01M12 6V3" />
    </>
  ),
  pin: <path d="M9 3h6l-1 6 3 3H7l3-3zM12 12v9" />,
  alert: <path d="M12 3.5l9.5 16.5h-19zM12 10v4.5M12 17.2v.01" />,
  swap: <path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4" />,
  bag: <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2" />,
  print: <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" />,
  calendar: <path d="M4 6h16v15H4zM4 10h16M9 3v5M15 3v5" />,
  mail: <path d="M3 6h18v13H3zM3 7l9 7 9-7" />,
} as const

export type IconName = keyof typeof PATHS

type Props = {
  name: IconName
  className?: string
}

export function Icon({ name, className }: Props) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
