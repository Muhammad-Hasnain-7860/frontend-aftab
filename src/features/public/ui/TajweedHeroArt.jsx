const TajweedHeroArt = () => (
  <svg
    viewBox="0 0 640 500"
    role="img"
    aria-label="An open Quran resting on a wooden stand"
    className="h-full w-full"
  >
    <defs>
      <linearGradient id="landscape" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#ece9dc" />
        <stop offset="1" stopColor="#d7ddce" />
      </linearGradient>
      <linearGradient id="pages" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#fffdf5" />
        <stop offset="1" stopColor="#e9dfc7" />
      </linearGradient>
      <linearGradient id="wood" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#a77c4a" />
        <stop offset="1" stopColor="#5e472f" />
      </linearGradient>
      <filter id="book-shadow" x="-30%" y="-30%" width="160%" height="180%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="9" />
        <feOffset dy="10" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.22" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <rect width="640" height="500" fill="url(#landscape)" />
    <circle cx="488" cy="106" r="44" fill="#d2b56c" opacity="0.42" />
    <path
      d="M0 277 105 205l64 49 103-99 104 105 73-58 94 82 97-38v126H0Z"
      fill="#c6cebd"
    />
    <path
      d="m0 315 112-66 89 47 97-75 95 78 83-42 164 82v66H0Z"
      fill="#9eaa98"
      opacity="0.72"
    />
    <path d="M0 357q160-45 320 3t320-2v142H0Z" fill="#173c32" />
    <path d="M0 389q156-28 320 6t320 1v104H0Z" fill="#103128" />
    <ellipse cx="320" cy="395" rx="202" ry="25" fill="#0b241e" opacity="0.4" />

    <g fill="url(#wood)" stroke="#4d3a27" strokeLinejoin="round" strokeWidth="4">
      <path d="m196 292 30-10 91 103-26 14Z" />
      <path d="m444 292-30-10-91 103 26 14Z" />
      <path d="m196 292 29-10 98 102-23 13Z" transform="translate(0 28) scale(1 -1) translate(0 -650)" />
      <path d="m444 292-29-10-98 102 23 13Z" transform="translate(0 28) scale(1 -1) translate(0 -650)" />
      <path d="m214 302 212 0-22 17-168 0Z" />
    </g>

    <g filter="url(#book-shadow)" stroke="#bca77e" strokeWidth="2">
      <path d="M186 211q67-32 134 0v92q-67-31-134 0Z" fill="url(#pages)" />
      <path d="M454 211q-67-32-134 0v92q67-31 134 0Z" fill="url(#pages)" />
      <path d="M320 211v93" fill="none" stroke="#887451" strokeWidth="3" />
    </g>
    <g fill="none" stroke="#b9a983" strokeLinecap="round" strokeWidth="2" opacity="0.8">
      <path d="M205 222q48-18 95 2M205 235q48-18 95 2M205 248q48-18 95 2M205 261q48-18 95 2" />
      <path d="M435 222q-48-18-95 2M435 235q-48-18-95 2M435 248q-48-18-95 2M435 261q-48-18-95 2" />
    </g>
    <path d="M320 214v79" stroke="#b89143" strokeWidth="2" />
    <path d="M319 286h3v19h-3z" fill="#b89143" />
  </svg>
);

export default TajweedHeroArt;
