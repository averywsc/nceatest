/** Original mascot: "Pip", a friendly kōwhai flower. Also used (small) as the logo mark. */
export function Mascot({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      role="img"
      aria-label="Pip, the site mascot: a smiling yellow kōwhai flower with two green leaves and rosy cheeks, holding a pencil."
      className={className}
    >
      <path d="M100 150 C100 170 100 190 96 210" stroke="#1B6B4F" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M98 190 C70 190 52 176 46 156 C72 154 92 166 98 190Z" fill="#1B6B4F" />
      <path d="M99 178 C126 176 146 162 152 142 C126 140 105 152 99 178Z" fill="#2E8B67" />
      <path d="M100 18 C150 18 176 62 168 104 C162 136 132 156 100 156 C68 156 38 136 32 104 C24 62 50 18 100 18Z" fill="#F5B700" stroke="#0B2B3A" strokeWidth="5" />
      <circle cx="74" cy="84" r="9" fill="#0B2B3A" />
      <circle cx="126" cy="84" r="9" fill="#0B2B3A" />
      <circle cx="77" cy="81" r="3" fill="#fff" />
      <circle cx="129" cy="81" r="3" fill="#fff" />
      <ellipse cx="58" cy="108" rx="10" ry="6" fill="#E8793A" opacity="0.6" />
      <ellipse cx="142" cy="108" rx="10" ry="6" fill="#E8793A" opacity="0.6" />
      <path d="M80 112 C90 128 110 128 120 112" stroke="#0B2B3A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g transform="rotate(28 160 150)">
        <rect x="152" y="112" width="14" height="62" rx="3" fill="#B3261E" stroke="#0B2B3A" strokeWidth="3" />
        <path d="M152 112 L159 98 L166 112Z" fill="#F4E2C0" stroke="#0B2B3A" strokeWidth="3" />
      </g>
    </svg>
  );
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <circle cx="20" cy="20" r="18" fill="#F5B700" stroke="#0B2B3A" strokeWidth="3" />
      <circle cx="14" cy="17" r="2.5" fill="#0B2B3A" />
      <circle cx="26" cy="17" r="2.5" fill="#0B2B3A" />
      <path d="M13 24 C16 30 24 30 27 24" stroke="#0B2B3A" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
