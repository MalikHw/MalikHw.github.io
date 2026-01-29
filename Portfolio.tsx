import React, { useState, useRef, useEffect } from 'react';

// Simple animated background component
const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 12, 41, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(frame * 0.001 + i) * canvas.width) / 2 + canvas.width / 2;
        const y = (Math.cos(frame * 0.002 + i * 0.5) * canvas.height) / 2 + canvas.height / 2;
        
        ctx.fillStyle = `rgba(103, 80, 164, ${0.3 - (i / 100)})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      frame++;
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.4 }} />;
};

interface Project {
  title: string;
  description: string;
  borderColor: string;
  gradient: string;
  buttons?: Array<{
    text: string;
    url: string;
    icon?: string;
  }>;
}

interface GDData {
  stars?: number;
  cp?: number;
  rank?: number;
  diamonds?: number;
  demons?: number;
  usercoins?: number;
  coins?: number;
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'gdstats'>('projects');
  const [gdData, setGdData] = useState<GDData | null>(null);
  const [gdLoading, setGdLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://www.nerdfonts.com/assets/css/webfont.css';
    document.head.appendChild(link);

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

  useEffect(() => {
    if (activeTab === 'gdstats' && !gdData) {
      setGdLoading(true);
      fetch('https://gdbrowser.com/api/profile/MalikHw47')
        .then(res => res.json())
        .then(data => {
          setGdData(data);
          setGdLoading(false);
        })
        .catch(err => {
          console.error('Failed to load GD data:', err);
          setGdLoading(false);
        });
    }
  }, [activeTab, gdData]);

  const openModal = (url: string, title: string) => {
    setModalUrl(url);
    setModalTitle(title);
    setShowModal(true);
  };

  const gdStats = [
    { key: 'stars' as const, label: 'Stars', icon: 'nf nf-md-star', color: '#FFD700' },
    { key: 'cp' as const, label: 'Creator Points', icon: 'nf nf-md-trophy', color: '#FF6B6B' },
    { key: 'rank' as const, label: 'Rank', icon: 'nf nf-md-podium', color: '#4ECDC4' },
    { key: 'diamonds' as const, label: 'Diamonds', icon: 'nf nf-md-diamond_stone', color: '#95E1D3' },
    { key: 'demons' as const, label: 'Demons', icon: 'nf nf-md-ghost', color: '#F38181' },
    { key: 'usercoins' as const, label: 'User Coins', icon: 'nf nf-md-coin', color: '#AA96DA' },
    { key: 'coins' as const, label: 'Secret Coins', icon: 'nf nf-md-circle_multiple', color: '#FCBAD3' }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '2rem' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative' }}>
      <AnimatedBackground />

      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4), 0 0 20px rgba(102, 126, 234, 0.3);
          }
          50% {
            box-shadow: 0 4px 25px rgba(102, 126, 234, 0.6), 0 0 40px rgba(102, 126, 234, 0.5);
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .top-button {
          animation: glow-pulse 2s ease-in-out infinite, scale-in 0.5s ease-out;
        }

        .top-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6) !important;
        }

        .modal-enter {
          animation: modal-scale 0.3s ease-out;
        }

        @keyframes modal-scale {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .project-button {
          transition: all 0.2s ease;
        }

        .project-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
      `}</style>

      {/* Top Buttons */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '12px' }}>
        <button
          onClick={() => openModal('https://malikhw.github.io/donate', 'Donate')}
          className="top-button"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="nf nf-md-heart" style={{ fontSize: '1.2rem' }}></i>
          Donate
        </button>

        <button
          onClick={() => openModal('https://streamlabs.com/sl_id_79bfdf5f-f9bb-3746-9bdf-1e389269d1b7/merch', 'Merch Store')}
          className="top-button"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            animationDelay: '0.1s'
          }}
        >
          <i className="nf nf-md-shopping" style={{ fontSize: '1.2rem' }}></i>
          Merch Store
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-enter"
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '900px',
              height: '80vh',
              background: '#1a1625',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              border: '2px solid rgba(102, 126, 234, 0.3)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
            >
              <i className="nf nf-md-close"></i>
            </button>
            <iframe
              src={modalUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={modalTitle}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
            />
          </div>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(180deg, rgba(103,80,164,0.3) 0%, transparent 100%)', padding: '80px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', margin: '0', fontWeight: 'bold', textShadow: '0 0 40px rgba(103,80,164,0.8)' }}>MalikHw47</h1>
          <p style={{ fontSize: '1.5rem', margin: '20px 0 0', opacity: 0.9 }}>Small Dev, GD player, and Professional Shit-Poster</p>
          <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button
              onClick={() => openModal('https://youtube.com/@MalikHw47', 'YouTube')}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', transition: 'transform 0.3s' }}
              className="project-button"
            >
              <i className="nf nf-md-youtube"></i>
            </button>
            <button
              onClick={() => openModal('https://twitch.tv/MalikHw47', 'Twitch')}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', transition: 'transform 0.3s' }}
              className="project-button"
            >
              <i className="nf nf-md-twitch"></i>
            </button>
            <button
              onClick={() => openModal('https://github.com/MalikHw', 'GitHub')}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', transition: 'transform 0.3s' }}
              className="project-button"
            >
              <i className="nf nf-md-github"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '30px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <button
            onClick={() => setActiveTab('projects')}
            className="project-button"
            style={{
              background: activeTab === 'projects' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: activeTab === 'projects' ? 'none' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '12px 30px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'projects' ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
            }}
          >
            <i className="nf nf-md-briefcase" style={{ fontSize: '1.3rem' }}></i>
            Projects
          </button>
          <button
            onClick={() => setActiveTab('gdstats')}
            className="project-button"
            style={{
              background: activeTab === 'gdstats' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: activeTab === 'gdstats' ? 'none' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '12px 30px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'gdstats' ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
            }}
          >
            <i className="nf nf-md-gamepad_variant" style={{ fontSize: '1.3rem' }}></i>
            GD Stats
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div style={{ padding: '0 20px 60px', maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', textShadow: '0 0 20px rgba(103,80,164,0.5)' }}>My Projects</h2>
            {projects.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {projects.map((project, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#1a1625',
                      borderRadius: '16px',
                      padding: '28px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    <h3 style={{ margin: '0 0 12px', fontSize: '1.8rem', color: project.borderColor }}>{project.title}</h3>
                    <p style={{ margin: '0 0 20px', opacity: 0.9, lineHeight: '1.6', fontSize: '1rem' }}>{project.description}</p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {project.buttons?.map((btn, btnIdx) => (
                        <button
                          key={btnIdx}
                          onClick={() => openModal(btn.url, btn.text)}
                          className="project-button"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            background: btnIdx === 0 ? project.borderColor : 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            border: btnIdx === 0 ? 'none' : '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          {btn.icon && <i className={btn.icon} style={{ fontSize: '1.1rem' }}></i>}
                          {btn.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.7 }}>No projects found. Add some via the workflow!</p>
            )}
          </div>
        )}

        {/* GD Stats Tab */}
        {activeTab === 'gdstats' && (
          <div style={{ padding: '0 20px 60px', maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', textShadow: '0 0 20px rgba(103,80,164,0.5)' }}>Geometry Dash Stats</h2>
            {gdLoading ? (
              <div style={{ textAlign: 'center', fontSize: '1.5rem', padding: '60px 0' }}>
                <p style={{ marginTop: '20px' }}>Loading stats...</p>
              </div>
            ) : gdData ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {gdStats.map(stat => (
                  <div
                    key={stat.key}
                    style={{
                      background: 'linear-gradient(135deg, rgba(103,80,164,0.2) 0%, rgba(26,22,37,0.8) 100%)',
                      borderRadius: '16px',
                      padding: '30px',
                      textAlign: 'center',
                      border: `2px solid ${stat.color}40`,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className={stat.icon} style={{ fontSize: '3.5rem', color: stat.color, marginBottom: '15px', display: 'block' }}></i>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: stat.color, marginBottom: '10px' }}>
                      {gdData[stat.key]?.toLocaleString() || '0'}
                    </div>
                    <div style={{ fontSize: '1.1rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.7, padding: '60px 0' }}>
                <p>Failed to load GD stats. Please try again later.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', marginTop: '60px' }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>Made with ❤️ and shit by <strong>MalikHw47</strong></p>
        </div>
      </div>
    </div>
  );
}
