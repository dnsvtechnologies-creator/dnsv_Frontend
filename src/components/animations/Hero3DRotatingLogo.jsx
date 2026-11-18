import React, { useEffect, useRef } from 'react';

export default function Hero3DRotatingLogo() {
  const logoUrl = '/assets/logos/dnsv-rounded.png';

  const stageRef = useRef(null);
  const coinRef = useRef(null);
  const outerRingRef = useRef(null);
  const innerRingRef = useRef(null);
  const ambientGlowRef = useRef(null);
  const frontSheenRef = useRef(null);
  const backSheenRef = useRef(null);
  const shadowRef = useRef(null);

  const physicsRef = useRef({
    rotX: 0,
    rotY: 0,
    scale: 1,
    normX: 0,
    normY: 0,
    targetNormX: 0,
    targetNormY: 0,
    hoverBaseY: 0,
    isHovering: false,
    isDragging: false,
    dragSpinY: 0,
    dragSpinX: 0,
    velY: 0,
    velX: 0,
    lastPointerX: 0,
    lastPointerY: 0
  });

  useEffect(() => {
    let rafId = null;
    let isVisible = true;
    let isTabActive = !document.hidden;
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let prefersReduced = Boolean(motionQuery?.matches);
    let lastTime = performance.now();

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const startLoop = () => {
      if (rafId === null && isVisible && isTabActive && !prefersReduced) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(animate);
      }
    };

    const animate = (now) => {
      if (!isVisible || !isTabActive || prefersReduced) {
        rafId = null;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const s = physicsRef.current;
      const damp = 1 - Math.exp(-9 * dt);
      const slowDamp = 1 - Math.exp(-4.5 * dt);

      // Smoothly interpolate normalized cursor coordinates
      s.normX += (s.targetNormX - s.normX) * damp;
      s.normY += (s.targetNormY - s.normY) * damp;

      if (s.isDragging) {
        const targetY = s.hoverBaseY + s.dragSpinY + s.normX * 28;
        const targetX = Math.max(-55, Math.min(55, s.dragSpinX - s.normY * 18));
        s.rotY += (targetY - s.rotY) * (1 - Math.exp(-16 * dt));
        s.rotX += (targetX - s.rotX) * (1 - Math.exp(-16 * dt));
        s.scale += (1.06 - s.scale) * damp;
      } else if (s.isHovering) {
        if (Math.abs(s.velY) > 0.05 || Math.abs(s.velX) > 0.05) {
          const friction = Math.pow(0.92, dt * 60);
          s.dragSpinY += s.velY * (dt * 60);
          s.dragSpinX = Math.max(-30, Math.min(30, s.dragSpinX + s.velX * (dt * 60)));
          s.velY *= friction;
          s.velX *= friction;
        } else {
          s.dragSpinX += (0 - s.dragSpinX) * slowDamp;
        }

        const targetY = s.hoverBaseY + s.dragSpinY + s.normX * 68;
        const targetX = Math.max(-45, Math.min(45, s.dragSpinX - s.normY * 34));

        s.rotY += (targetY - s.rotY) * damp;
        s.rotX += (targetX - s.rotX) * damp;
        s.scale += (1.04 - s.scale) * damp;
      } else {
        if (Math.abs(s.velY) > 0.05) {
          const friction = Math.pow(0.94, dt * 60);
          s.rotY += s.velY * (dt * 60);
          s.velY *= friction;
        } else {
          s.velY = 0;
        }

        s.rotY += 30 * dt;
        s.rotX += (0 - s.rotX) * slowDamp;
        s.targetNormX = 0;
        s.targetNormY = 0;
        s.dragSpinY = 0;
        s.dragSpinX = 0;
        s.scale += (1 - s.scale) * slowDamp;
      }

      if (coinRef.current) {
        coinRef.current.style.transform = `scale(${s.scale.toFixed(4)}) rotateX(${s.rotX.toFixed(2)}deg) rotateY(${s.rotY.toFixed(2)}deg)`;
      }

      const parallaxX = s.normX * 14;
      const parallaxY = s.normY * 14;

      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `translate3d(${(parallaxX * 0.45).toFixed(2)}px, ${(parallaxY * 0.45).toFixed(2)}px, 0) rotateX(${(-s.normY * 12).toFixed(2)}deg) rotateY(${(s.normX * 12).toFixed(2)}deg)`;
      }

      if (innerRingRef.current) {
        innerRingRef.current.style.transform = `translate3d(${(parallaxX * 0.85).toFixed(2)}px, ${(parallaxY * 0.85).toFixed(2)}px, 0) rotateX(${(-s.normY * 18).toFixed(2)}deg) rotateY(${(s.normX * 18).toFixed(2)}deg)`;
      }

      if (ambientGlowRef.current) {
        ambientGlowRef.current.style.transform = `translate3d(${(parallaxX * 1.1).toFixed(2)}px, ${(parallaxY * 1.1 - 8).toFixed(2)}px, 0) scale(${s.isHovering ? 0.96 : 0.9})`;
      }

      const sheenX = 50 + s.normX * 35;
      const sheenY = 50 + s.normY * 35;
      const lightAlpha = s.isHovering ? 0.36 : 0.24;

      if (frontSheenRef.current) {
        frontSheenRef.current.style.background = `radial-gradient(circle at ${sheenX.toFixed(1)}% ${sheenY.toFixed(1)}%, rgba(255, 255, 255, ${lightAlpha}) 0%, rgba(0, 210, 255, 0.16) 38%, rgba(255, 255, 255, 0) 72%)`;
      }

      if (backSheenRef.current) {
        backSheenRef.current.style.background = `radial-gradient(circle at ${(100 - sheenX).toFixed(1)}% ${sheenY.toFixed(1)}%, rgba(255, 255, 255, ${lightAlpha}) 0%, rgba(0, 210, 255, 0.16) 38%, rgba(255, 255, 255, 0) 72%)`;
      }

      if (shadowRef.current) {
        const shadowShiftX = s.normX * 18;
        const shadowScaleX = 1 - Math.abs(Math.sin((s.rotY * Math.PI) / 180)) * 0.16;
        shadowRef.current.style.transform = `translateX(${shadowShiftX.toFixed(2)}px) scaleX(${shadowScaleX.toFixed(3)})`;
      }

      rafId = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) startLoop();
      else stopLoop();
    };

    const handleReducedChange = (e) => {
      prefersReduced = Boolean(e.matches);
      if (prefersReduced) stopLoop();
      else startLoop();
    };

    let observer = null;
    if (stageRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = Boolean(entries[0]?.isIntersecting);
          if (isVisible) startLoop();
          else stopLoop();
        },
        { threshold: 0.05 }
      );
      observer.observe(stageRef.current);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery?.addEventListener?.('change', handleReducedChange);
    startLoop();

    return () => {
      stopLoop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery?.removeEventListener?.('change', handleReducedChange);
    };
  }, []);

  const updatePointerTarget = (clientX, clientY) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const rawX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const rawY = ((clientY - rect.top) / rect.height) * 2 - 1;

    physicsRef.current.targetNormX = Math.max(-1, Math.min(1, rawX));
    physicsRef.current.targetNormY = Math.max(-1, Math.min(1, rawY));
  };

  const handlePointerEnter = (e) => {
    const s = physicsRef.current;
    if (!s.isHovering) {
      // Lock onto nearest 180deg face so coin faces cursor cleanly without flipping 180deg unnecessarily
      s.hoverBaseY = Math.round(s.rotY / 180) * 180;
      s.dragSpinY = 0;
      s.dragSpinX = 0;
      s.isHovering = true;
    }
    updatePointerTarget(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    const s = physicsRef.current;
    if (!s.isHovering) {
      s.hoverBaseY = Math.round(s.rotY / 180) * 180;
      s.isHovering = true;
    }

    if (s.isDragging) {
      const dx = e.clientX - s.lastPointerX;
      const dy = e.clientY - s.lastPointerY;
      s.lastPointerX = e.clientX;
      s.lastPointerY = e.clientY;

      s.dragSpinY += dx * 0.85;
      s.dragSpinX = Math.max(-40, Math.min(40, s.dragSpinX - dy * 0.45));
      s.velY = dx * 0.42;
      s.velX = -dy * 0.22;
    }

    updatePointerTarget(e.clientX, e.clientY);
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const s = physicsRef.current;
    s.isDragging = true;
    s.lastPointerX = e.clientX;
    s.lastPointerY = e.clientY;
    s.velY = 0;
    s.velX = 0;
    if (!s.isHovering) {
      s.hoverBaseY = Math.round(s.rotY / 180) * 180;
      s.isHovering = true;
    }
    updatePointerTarget(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    physicsRef.current.isDragging = false;
  };

  const handlePointerLeave = () => {
    const s = physicsRef.current;
    s.isDragging = false;
    s.isHovering = false;
    s.targetNormX = 0;
    s.targetNormY = 0;
  };

  return (
    <div
      ref={stageRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerLeave}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] aspect-square mx-auto flex items-center justify-center select-none py-4 touch-pan-y cursor-grab active:cursor-grabbing"
      title="Move cursor to rotate 3D coin — drag to spin freely"
    >
      {/* Background ambient lighting using logo's vibrant cyan and royal blue */}
      <div
        ref={ambientGlowRef}
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none bg-gradient-to-tr from-[#00D2FF]/25 via-[#2563EB]/20 to-transparent transition-opacity duration-300"
      />
      <div className="absolute w-3/4 h-3/4 rounded-full blur-2xl pointer-events-none bg-[#00D2FF]/20" />

      {/* Outer subtle orbital ring matching the logo's glowing ring */}
      <div
        ref={outerRingRef}
        className="absolute inset-2 sm:inset-4 rounded-full border border-[#00D2FF]/45 pointer-events-none animate-pulse will-change-transform"
      />
      <div
        ref={innerRingRef}
        className="absolute inset-8 sm:inset-10 rounded-full border border-[#2563EB]/25 pointer-events-none will-change-transform"
      />

      {/* Floating 3D Scene */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 perspective-1000 animate-float-subtle pointer-events-none">
        {/* 3D Rotating Coin Object */}
        <div
          ref={coinRef}
          className="relative w-full h-full preserve-3d will-change-transform"
        >
          {/* FRONT FACE */}
          <div
            className="absolute inset-0 rounded-full backface-hidden flex items-center justify-center p-2"
            style={{
              transform: 'translateZ(8px)',
              background: 'radial-gradient(circle at 35% 35%, #0B132B 0%, #060913 80%)',
              boxShadow: '0 0 35px rgba(0, 210, 255, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.25)',
              border: '2px solid rgba(0, 210, 255, 0.85)'
            }}
          >
            <img
              src={logoUrl}
              alt="DNSV Technologies 3D Logo Front"
              width={384}
              height={384}
              className="w-full h-full rounded-full object-cover select-none pointer-events-none"
              loading="eager"
              decoding="async"
              draggable={false}
            />
            {/* Dynamic Cursor-Responsive Gloss Reflection Overlay */}
            <div
              ref={frontSheenRef}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.24) 0%, rgba(0, 210, 255, 0.16) 38%, rgba(255, 255, 255, 0) 72%)'
              }}
            />
          </div>

          {/* 3D CYLINDER RIM DEPTH LAYERS */}
          {[-6, -4, -2, 0, 2, 4, 6].map((zOffset) => (
            <div
              key={zOffset}
              className="absolute inset-0 rounded-full pointer-events-none border border-[#00D2FF]/45 bg-[#0B132B]/70"
              style={{
                transform: `translateZ(${zOffset}px)`,
                boxShadow: '0 0 8px rgba(0, 210, 255, 0.3)'
              }}
            />
          ))}

          {/* BACK FACE */}
          <div
            className="absolute inset-0 rounded-full backface-hidden flex items-center justify-center p-2"
            style={{
              transform: 'rotateY(180deg) translateZ(8px)',
              background: 'radial-gradient(circle at 65% 35%, #0B132B 0%, #060913 80%)',
              boxShadow: '0 0 35px rgba(0, 210, 255, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.25)',
              border: '2px solid rgba(0, 210, 255, 0.85)'
            }}
          >
            <img
              src={logoUrl}
              alt="DNSV Technologies 3D Logo Reverse"
              width={384}
              height={384}
              className="w-full h-full rounded-full object-cover select-none pointer-events-none"
              loading="eager"
              decoding="async"
              draggable={false}
            />
            <div
              ref={backSheenRef}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.24) 0%, rgba(0, 210, 255, 0.16) 38%, rgba(255, 255, 255, 0) 72%)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating ground shadow */}
      <div
        ref={shadowRef}
        className="absolute -bottom-6 w-3/5 h-6 rounded-full blur-md bg-[#17213A]/25 opacity-70 pointer-events-none will-change-transform"
        style={{
          boxShadow: '0 0 25px rgba(37, 99, 235, 0.25)'
        }}
      />
    </div>
  );
}
