import React, { useState, useRef, useEffect } from 'react';
import Aurora from './Aurora';
import TargetCursor from './TargetCursor';
import TextType from './TextType';

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

interface YouTubeData {
  src: string;
  title: string;
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'gdstats'>('projects');
  const [gdData, setGdData] = useState<GDData | null>(null);
  const [gdLoading, setGdLoading] = useState(false);
  const [showDonateDropdown, setShowDonateDropdown] = useState(false);
  const [youtubeData, setYoutubeData] = useState<YouTubeData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const twitchEmbedRef = useRef<HTMLDivElement>(null);

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

    fetch('/youtube.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('YouTube data loaded:', data);
        setYoutubeData(data);
      })
      .catch(err => {
        console.error('Failed to load YouTube data:', err);
        // Fallback to default video if fetch fails
        setYoutubeData({
          src: "https://www.youtube.com/embed/lvSsbSbUYnk",
          title: "TETORIS"
        });
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDonateDropdown(false);
      }
    };

    if (showDonateDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDonateDropdown]);

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

useEffect(() => {
    // 1. Load Twitch embed script
    const twitchScript = document.createElement('script');
    twitchScript.src = 'https://embed.twitch.tv/embed/v1.js';
    twitchScript.async = true;
    document.body.appendChild(twitchScript);

    twitchScript.onload = () => {
      if (twitchEmbedRef.current && (window as any).Twitch) {
        new (window as any).Twitch.Embed(twitchEmbedRef.current, {
          width: '100%',
          height: 480,
          channel: 'MalikHw47',
          parent: ['malikhw.github.io']
        });
      }
    };

    // 2. Load Ko-fi widget script
    const kofiScript = document.createElement('script');
    kofiScript.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
    kofiScript.async = true;
    document.body.appendChild(kofiScript);

    kofiScript.onload = () => {
      if ((window as any).kofiWidgetOverlay) {
        (window as any).kofiWidgetOverlay.draw('malikhw47', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'Donate',
          'floating-chat.donateButton.background-color': '#ff5f5f',
          'floating-chat.donateButton.text-color': '#fff'
        });
      }
    };

    // Cleanup: Remove scripts if you leave the page
    return () => {
      document.body.removeChild(twitchScript);
      document.body.removeChild(kofiScript);
      const kofiWidget = document.getElementById('kofi-widget-overlay');
      if (kofiWidget) kofiWidget.remove();
    };
  }, []);

  const donateLinks = [
    { text: '☕ Donate (Ko-Fi)', url: 'https://ko-fi.com/MalikHw47', color: '#7aa2f7' },
    { text: '💎 Boost Server (Discord)', url: 'https://discord.gg/G9bZ92eg2n', color: '#5913ad' },
    { text: '🎁 Get a Gift (Throne)', url: 'https://throne.com/MalikHw47', color: '#f7768e' },
    { text: '🚀 Gift MHv9', url: 'https://absolllute.com/store/mega_hack?gift=1', color: '#9ece6a' }
  ];

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
    <div style={{ minHeight: '100vh', background: '#0f0c29', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative' }}>
      {/* TargetCursor */}
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.35}
      />

      {/* Aurora Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Aurora
          colorStops={["#850000","#853500","#850045"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

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

        @keyframes dropdown-slide {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .top-button {
          animation: glow-pulse 2s ease-in-out infinite, scale-in 0.5s ease-out;
        }

        .top-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6) !important;
        }

        .dropdown-enter {
          animation: dropdown-slide 0.3s ease-out;
        }

        .project-button {
          transition: all 0.2s ease;
        }

        .project-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        /* Force hide default cursor on interactive elements */
        .cursor-target,
        .cursor-target * {
          cursor: none !important;
        }
      `}</style>

      {/* Top Buttons */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '12px' }}>
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDonateDropdown(!showDonateDropdown)}
            className="top-button cursor-target"
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
            <i className={`nf nf-md-chevron_${showDonateDropdown ? 'up' : 'down'}`} style={{ fontSize: '0.9rem', marginLeft: '4px' }}></i>
          </button>

          {showDonateDropdown && (
            <div
              className="dropdown-enter"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: '0',
                background: '#1a1625',
                borderRadius: '16px',
                padding: '12px',
                minWidth: '280px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(102, 126, 234, 0.3)'
              }}
            >
              {donateLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-target"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px 18px',
                    margin: '6px 0',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    textDecoration: 'none',
                    color: '#000',
                    fontWeight: '600',
                    background: link.color,
                    transition: 'all 0.15s ease',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {link.text}
                </a>
              ))}
              <div style={{ 
                marginTop: '12px', 
                paddingTop: '12px', 
                borderTop: '1px solid rgba(255,255,255,0.1)', 
                fontSize: '0.75rem', 
                opacity: 0.6, 
                textAlign: 'center',
                color: '#fff'
              }}>
                Thanks for the support!
              </div>
            </div>
          )}
        </div>

        <a
          href="https://streamlabs.com/sl_id_79bfdf5f-f9bb-3746-9bdf-1e389269d1b7/merch"
          target="_blank"
          rel="noopener noreferrer"
          className="top-button cursor-target"
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
            animationDelay: '0.1s',
            textDecoration: 'none'
          }}
        >
          <i className="nf nf-md-shopping" style={{ fontSize: '1.2rem' }}></i>
          Merch Store
        </a>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(180deg, rgba(103,80,164,0.3) 0%, transparent 100%)', padding: '80px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', margin: '0', fontWeight: 'bold', textShadow: '0 0 40px rgba(103,80,164,0.8)' }}>
            <TextType 
              text={["MalikHw47"]}
              typingSpeed={40}
              pauseDuration={1500}
              showCursor={false}
              loop={false}
            />
          </h1>
          <p style={{ fontSize: '1.5rem', margin: '20px 0 0', opacity: 0.9, minHeight: '2rem' }}>
            <TextType 
              text={[
                "Small Dev, GD player, and Professional Shit-Poster",
                "And a Miku/Teto fan!!",
                "Hardest is sonik wafe-",
                "MIKU MIKU BEAMMM"
              ]}
              typingSpeed={40}
              deletingSpeed={50}
              pauseDuration={1500}
              showCursor
              cursorCharacter="●"
              cursorBlinkDuration={0.5}
              initialDelay={800}
            />
          </p>
          <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <a
              href="https://youtube.com/@MalikHw47"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fff', fontSize: '2rem', transition: 'transform 0.3s', display: 'inline-block' }}
              className="project-button cursor-target"
            >
              <i className="nf nf-md-youtube"></i>
            </a>
            <a
              href="https://twitch.tv/MalikHw47"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fff', fontSize: '2rem', transition: 'transform 0.3s', display: 'inline-block' }}
              className="project-button cursor-target"
            >
              <i className="nf nf-md-twitch"></i>
            </a>
            <a
              href="https://github.com/MalikHw"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fff', fontSize: '2rem', transition: 'transform 0.3s', display: 'inline-block' }}
              className="project-button cursor-target"
            >
              <i className="nf nf-md-github"></i>
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '30px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <button
            onClick={() => setActiveTab('projects')}
            className="project-button cursor-target"
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
            className="project-button cursor-target"
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
                        <a
                          key={btnIdx}
                          href={btn.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-button cursor-target"
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
                            cursor: 'pointer',
                            textDecoration: 'none'
                          }}
                        >
                          {btn.icon && <i className={btn.icon} style={{ fontSize: '1.1rem' }}></i>}
                          {btn.text}
                        </a>
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

        {/* Twitch and YouTube Embeds Section */}
        <div style={{ padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', textShadow: '0 0 20px rgba(103,80,164,0.5)' }}>Watch Me Live & Latest Video</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
            {/* Twitch Embed */}
            <div style={{ 
              background: '#1a1625', 
              borderRadius: '16px', 
              padding: '20px', 
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '1.5rem', color: '#9146FF', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="nf nf-md-twitch" style={{ fontSize: '1.8rem' }}></i>
                Live on Twitch
              </h3>
              <div ref={twitchEmbedRef} style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}></div>
            </div>

            {/* YouTube Embed */}
            <div style={{ 
              background: '#1a1625', 
              borderRadius: '16px', 
              padding: '20px', 
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '1.5rem', color: '#FF0000', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="nf nf-md-youtube" style={{ fontSize: '1.8rem' }}></i>
                Latest Video
              </h3>
              {youtubeData ? (
                <iframe 
                  width="100%" 
                  height="480" 
                  src={youtubeData.src}
                  title={youtubeData.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  style={{ borderRadius: '12px' }}
                ></iframe>
              ) : (
                <div style={{ width: '100%', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                  <p style={{ opacity: 0.7 }}>Loading video...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', marginTop: '60px' }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>Made with ❤️ and shit by <strong>MalikHw47</strong></p>
        </div>
      </div>
    </div>
  );
}
