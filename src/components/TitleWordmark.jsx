export function TitleWordmark() {
  return (
    <svg
      className="title-wordmark-svg"
      viewBox="0 0 920 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="titleWordmarkTitle titleWordmarkDesc"
    >
      <title id="titleWordmarkTitle">Capital Intelligence Console</title>
      <desc id="titleWordmarkDesc">Professional title wordmark with a finance-inspired emblem and gradient typography.</desc>
      <defs>
        <linearGradient id="titleRingGradient" x1="10" y1="14" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--wordmark-ring-start)" />
          <stop offset="1" stopColor="var(--wordmark-ring-end)" />
        </linearGradient>
        <linearGradient id="titleWordGradient" x1="130" y1="18" x2="780" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--wordmark-text-start)" />
          <stop offset="1" stopColor="var(--wordmark-text-end)" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="48" stroke="url(#titleRingGradient)" strokeWidth="6" />
      <path d="M36 70L51 56L64 66L86 41" stroke="var(--wordmark-stroke)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="36" cy="70" r="4" fill="var(--wordmark-node-a)" />
      <circle cx="51" cy="56" r="4" fill="var(--wordmark-node-b)" />
      <circle cx="64" cy="66" r="4" fill="var(--wordmark-node-c)" />
      <circle cx="86" cy="41" r="4" fill="var(--wordmark-node-d)" />
      <text x="130" y="56" fill="url(#titleWordGradient)" fontFamily="Segoe UI, Arial, sans-serif" fontSize="36" fontWeight="700" letterSpacing="0.5">
        Capital Intelligence
      </text>
      <text x="130" y="88" fill="var(--wordmark-subtext)" fontFamily="Segoe UI, Arial, sans-serif" fontSize="22" fontWeight="600" letterSpacing="3.6">
        CONSOLE
      </text>
    </svg>
  )
}
