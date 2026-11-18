import React, { useState } from 'react';

/**
 * DNSVRoundedLogo
 * Displays the original rounded emblem supplied by the brand
 */
export default function DNSVRoundedLogo({ className = 'w-10 h-10', alt = 'DNSV Technologies Rounded Logo' }) {
  const [imgError, setImgError] = useState(false);
  const logoSrc = '/assets/logos/dnsv-rounded.png';

  if (imgError) {
    // Resilient styled fallback using strict 4-color palette
    return (
      <div className={`rounded-full bg-[#17213A] border border-[#2563EB] flex items-center justify-center text-[#F7F7F2] font-black text-sm tracking-wider select-none ${className}`}>
        DNSV
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      width={40}
      height={40}
      decoding="async"
      className={`rounded-full object-cover select-none shrink-0 ${className}`}
      onError={() => setImgError(true)}
      loading="eager"
    />
  );
}
