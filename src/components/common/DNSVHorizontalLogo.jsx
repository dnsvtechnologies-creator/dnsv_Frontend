import React from 'react';
import DNSVRoundedLogo from './DNSVRoundedLogo.jsx';

export default function DNSVHorizontalLogo({ showTagline = true, size = 'default' }) {
  const isLarge = size === 'large';

  return (
    <div className="flex items-center gap-3.5 select-none group">
      <DNSVRoundedLogo className={isLarge ? 'w-12 h-12 shadow-lg shadow-[#2563EB]/20' : 'w-10 h-10'} />
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className="font-extrabold text-[#F7F7F2] tracking-tight text-xl">DNSV</span>
          <span className="font-semibold text-[#2563EB] tracking-widest text-xs uppercase">Technologies</span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-[#F7F7F2]/60 font-medium tracking-normal mt-1">
            Digital Nexus for Software & Ventures
          </span>
        )}
      </div>
    </div>
  );
}
