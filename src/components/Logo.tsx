type LogoProps = {
  size?: number
  withWordmark?: boolean
}

export default function Logo({ size = 22, withWordmark = true }: LogoProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1" />
        <path
          d="M12 4.5 15 12l-3 7.5L9 12l3-7.5Z"
          fill="currentColor"
          fillOpacity="0.92"
        />
        <circle cx="12" cy="12" r="1" fill="var(--bg)" />
      </svg>
      {withWordmark && (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: size * 0.82,
            letterSpacing: '0.08em',
            fontWeight: 500,
          }}
        >
          RUMBO
        </span>
      )}
    </span>
  )
}
