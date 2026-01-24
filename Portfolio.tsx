import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

// ClickSpark Component
const ClickSpark = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  children
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let resizeTimeout;
    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(parent);
    resizeCanvas();

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    t => {
      switch (easing) {
        case 'linear': return t;
        case 'ease-in': return t * t;
        case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default: return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = timestamp => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeFunc(progress);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

  const handleClick = e => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x, y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now
    }));
    sparksRef.current.push(...newSparks);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }} onClick={handleClick}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
      {children}
    </div>
  );
};

// Antigravity Component
const AntigravityInner = ({ count = 300, magnetRadius = 6, ringRadius = 7, waveSpeed = 0.4, waveAmplitude = 1, particleSize = 1.5, lerpSpeed = 0.05, color = '#5227FF', autoAnimate = false, particleVariance = 1, rotationSpeed = 0, depthFactor = 1, pulseSpeed = 3, particleShape = 'sphere', fieldStrength = 10 }) => {
  const meshRef = useRef(null);
  const { viewport } = useThree();
  const dummy = React.useMemo(() => new THREE.Object3D(), []);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });

  const particles = React.useMemo(() => {
    const temp = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;
      const randomRadiusOffset = (Math.random() - 0.5) * 2;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: x, my: y, mz: z, cx: x, cy: y, cz: z, vx: 0, vy: 0, vz: 0, randomRadiusOffset });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame(state => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const { viewport: v, pointer: m } = state;
    const mouseDist = Math.sqrt(Math.pow(m.x - lastMousePos.current.x, 2) + Math.pow(m.y - lastMousePos.current.y, 2));
    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }
    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;
    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const time = state.clock.getElapsedTime();
      destX = Math.sin(time * 0.5) * (v.width / 4);
      destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
    }
    const smoothFactor = 0.05;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;
    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;
    const globalRotation = state.clock.getElapsedTime() * rotationSpeed;

    particles.forEach((particle, i) => {
      let { t, speed, mx, my, mz, cz, randomRadiusOffset } = particle;
      t = particle.t += speed / 2;
      const projectionFactor = 1 - cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;
      const dx = mx - projectedTargetX;
      const dy = my - projectedTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let targetPos = { x: mx, y: my, z: mz * depthFactor };

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;
        const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
        const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));
        const currentRingRadius = ringRadius + wave + deviation;
        targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
        targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
        targetPos.z = mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor);
      }

      particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
      particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
      particle.cz += (targetPos.z - particle.cz) * lerpSpeed;
      dummy.position.set(particle.cx, particle.cy, particle.cz);
      dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
      dummy.rotateX(Math.PI / 2);
      const currentDistToMouse = Math.sqrt(Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2));
      const distFromRing = Math.abs(currentDistToMouse - ringRadius);
      let scaleFactor = 1 - distFromRing / 10;
      scaleFactor = Math.max(0, Math.min(1, scaleFactor));
      const finalScale = scaleFactor * (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
};

const Antigravity = props => (
  <Canvas camera={{ position: [0, 0, 50], fov: 35 }}>
    <AntigravityInner {...props} />
  </Canvas>
);

// ChromaGrid Component
const ChromaGrid = ({ items, className = '', radius = 300, columns = 3, rows = 2, damping = 0.45, fadeOut = 0.6, ease = 'power3.out' }) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x, y, duration: damping, ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = e => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
  };

  const handleCardClick = url => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCardMove = e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        '--r': `${radius}px`,
        '--cols': columns,
        '--rows': rows,
        '--x': '0px',
        '--y': '0px',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
        gap: '24px',
        padding: '20px'
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((c, i) => (
        <article
          key={i}
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={{
            '--card-border': c.borderColor || 'transparent',
            '--card-gradient': c.gradient,
            '--mouse-x': '0px',
            '--mouse-y': '0px',
            cursor: c.url ? 'pointer' : 'default',
            position: 'relative',
            background: '#1a1625',
            borderRadius: '16px',
            overflow: 'hidden',
            padding: '24px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = `0 8px 30px ${c.borderColor}40`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
          }}
        >
          <div style={{ width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', background: c.gradient }}>
            <img src={c.image} alt={c.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.5rem', color: c.borderColor }}>{c.title}</h3>
            {c.handle && <span style={{ fontSize: '0.9rem', opacity: 0.7, display: 'block', marginBottom: '8px' }}>{c.handle}</span>}
            <p style={{ margin: '0', opacity: 0.9, lineHeight: '1.6' }}>{c.subtitle}</p>
          </div>
        </article>
      ))}
      <div ref={fadeRef} style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, rgba(0,0,0,0.5) 100%)`, pointerEvents: 'none', transition: 'opacity 0.3s' }} />
    </div>
  );
};

// Portfolio App
export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('projects.json')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load projects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <ClickSpark sparkColor="#6750A4" sparkSize={12} sparkRadius={20} sparkCount={10}>
        <div style={{ background: 'linear-gradient(180deg, rgba(103,80,164,0.3) 0%, transparent 100%)', padding: '80px 20px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', zIndex: 0 }}>
            <Antigravity count={200} magnetRadius={8} ringRadius={10} particleSize={2} color="#6750A4" autoAnimate particleShape="sphere" />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '4rem', margin: '0', fontWeight: 'bold', textShadow: '0 0 40px rgba(103,80,164,0.8)' }}>MalikHw47</h1>
            <p style={{ fontSize: '1.5rem', margin: '20px 0 0', opacity: 0.9 }}>Small Dev, GD player, and Professional Shit-Poster</p>
            <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <a href="https://youtube.com/@MalikHw47" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '2rem', transition: 'transform 0.3s' }}>
                <span style={{ display: 'inline-block' }}>▶️</span>
              </a>
              <a href="https://twitch.tv/MalikHw47" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '2rem' }}>
                <span>📺</span>
              </a>
              <a href="https://github.com/MalikHw" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '2rem' }}>
                <span>💻</span>
              </a>
            </div>
          </div>
        </div>

        <div style={{ padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', textShadow: '0 0 20px rgba(103,80,164,0.5)' }}>My Projects</h2>
          {projects.length > 0 ? (
            <ChromaGrid items={projects} radius={350} damping={0.5} fadeOut={0.7} />
          ) : (
            <p style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.7 }}>No projects found. Add some via the workflow!</p>
          )}
        </div>

        <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', marginTop: '60px' }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>Made with ❤️ and shit by <strong>MalikHw47</strong></p>
        </div>
      </ClickSpark>
    </div>
  );
}
