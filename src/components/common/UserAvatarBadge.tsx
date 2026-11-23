import React, { useEffect, useState } from 'react';

interface UserAvatarBadgeProps {
  src?: string;
  name: string;
  sizeClass?: string;
  textClass?: string;
  roundedClass?: string;
  borderClass?: string;
}

export function getUserInitials(name: string): string {
  const cleaned = (name || 'U')
    .replace(/^(Ustadzah|Ustadz|Ust\.|Usth\.|KH\.|Nyai\s+Hj\.|Nyai)\s+/i, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

export const UserAvatarBadge: React.FC<UserAvatarBadgeProps> = ({
  src,
  name,
  sizeClass = 'w-8 h-8',
  textClass = 'text-xs',
  roundedClass = 'rounded-full',
  borderClass = 'border border-emerald-600/60',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const trimmed = (src || '').trim();
  const showImage = Boolean(trimmed) && !imgFailed;

  if (showImage) {
    return (
      <img
        src={trimmed}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={`${sizeClass} ${roundedClass} ${borderClass} object-cover shrink-0 bg-emerald-50`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${roundedClass} ${borderClass} bg-gradient-to-br from-emerald-700 to-emerald-900 text-white font-extrabold ${textClass} flex items-center justify-center shrink-0 select-none`}
      aria-label={name}
    >
      {getUserInitials(name)}
    </div>
  );
};
