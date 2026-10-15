(function () {
  const donateBtn = document.getElementById('donateBtn');
  const merchBtn = document.getElementById('merchBtn');

  donateBtn.addEventListener('click', () => {
    window.open('https://malikhw.github.io/Donate', '_blank');
  });

  merchBtn.addEventListener('click', () => {
    window.open('https://streamlabs.com/sl_id_79bfdf5f-f9bb-3746-9bdf-1e389269d1b7/merch', '_blank');
  });

  document.getElementById('yt-btn').addEventListener('click', () => window.open('https://youtube.com/@MalikHw47', '_blank'));
  document.getElementById('tw-btn').addEventListener('click', () => window.open('https://twitch.tv/MalikHw47', '_blank'));
  document.getElementById('dc-btn').addEventListener('click', () => window.open('https://discord.gg/VZmHhUN2', '_blank'));

  const tabs = document.getElementById('mainTabs');
  const panelProjects = document.getElementById('panel-projects');
  const panelGd = document.getElementById('panel-gd');
  const panelGeode = document.getElementById('panel-geode');

  tabs.addEventListener('change', () => {
    const active = tabs.activeTabIndex;
    panelProjects.classList.toggle('hidden', active !== 0);
    panelGd.classList.toggle('hidden', active !== 1);
    panelGeode.classList.toggle('hidden', active !== 2);
    if (active === 1) loadGd();
    if (active === 2) loadGeodeMods();
  });

  function iconHtml(iconValue, opts = {}) {
    if (!iconValue) return '';
    const size = opts.size || 18;
    const trimmed = String(iconValue).trim();

    if (/^(https?:\/\/|\/|\.\/)/.test(trimmed)) {
      return `<img src="${trimmed}" width="${size}" height="${size}" alt="icon" style="display:inline-block;vertical-align:middle;object-fit:contain">`;
    }

    const siMap = {
      'nf nf-dev-github': { slug: 'github', color: 'ffffff' },
      'nf nf-md-github': { slug: 'github', color: 'ffffff' },
      'nf nf-dev-pypi': { slug: 'pypi', color: 'ffffff' },
      'nf nf-md-firefox': { slug: 'firefox', color: 'ffffff' },
      'nf nf-md-microsoft_edge': { slug: 'microsoftedge', color: 'ffffff' },
      'nf nf-md-youtube': { slug: 'youtube', color: 'ffffff' },
      'nf nf-md-twitch': { slug: 'twitch', color: 'ffffff' },
      'nf nf-md-discord': { slug: 'discord', color: 'ffffff' },
      'github': { slug: 'github', color: 'ffffff' },
      'pypi': { slug: 'pypi', color: 'ffffff' },
      'firefox': { slug: 'firefox', color: 'ffffff' },
      'microsoftedge': { slug: 'microsoftedge', color: 'ffffff' },
      'youtube': { slug: 'youtube', color: 'ffffff' },
      'twitch': { slug: 'twitch', color: 'ffffff' },
      'discord': { slug: 'discord', color: 'ffffff' }
    };

    const msMap = {
      'nf nf-md-open_in_new': 'open_in_new',
      'nf nf-fa-link': 'link',
      'nf nf-md-download': 'download',
      'nf nf-md-alert': 'warning',
      'nf nf-md-alert_circle_outline': 'error'
    };

    if (siMap[trimmed]) {
      const { slug, color } = siMap[trimmed];
      return `<img src="https://cdn.simpleicons.org/${slug}/${color}" width="${size}" height="${size}" alt="${slug}" style="display:inline-block;vertical-align:middle">`;
    }

    const msName = msMap[trimmed] || trimmed;
    return `<span class="material-symbols-outlined" style="font-size:${size}px">${msName}</span>`;
  }

  function buildProjectsGrid(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!projects.length) {
      grid.innerHTML = '<p class="loading-txt">No projects found. Add some via the workflow!</p>';
      return;
    }
    grid.innerHTML = projects.map((p) => `
      <div class="proj-card">
        <div class="proj-title" style="color:${p.borderColor}">${p.title}</div>
        <div class="proj-desc">${p.description}</div>
        <div class="proj-btns">
          ${(p.buttons || []).map((b, i) => {
            const iconPart = b.icon ? `<span slot="icon">${iconHtml(b.icon)}</span>` : '';
            if (i === 0) {
              return `
                <md-filled-button href="${b.url}" target="_blank" rel="noopener"${b.icon ? ' has-icon' : ''} style="--md-filled-button-container-color:${p.borderColor};--md-filled-button-label-text-color:#ffffff">
                  ${iconPart}
                  ${b.text}
                </md-filled-button>
              `;
            } else {
              return `
                <md-outlined-button href="${b.url}" target="_blank" rel="noopener"${b.icon ? ' has-icon' : ''}>
                  ${iconPart}
                  ${b.text}
                </md-outlined-button>
              `;
            }
          }).join('')}
        </div>
      </div>
    `).join('');
  }

  fetch('projects.json')
    .then((r) => r.json())
    .then((d) => buildProjectsGrid(d.projects || []))
    .catch(() => {
      document.getElementById('projectsGrid').innerHTML = '<p class="loading-txt">Failed to load projects.</p>';
    });

  let gdLoaded = false;
  let geodeLoaded = false;

  function loadGd() {
    if (gdLoaded) return;
    gdLoaded = true;
    const grid = document.getElementById('gdGrid');
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:48px 20px;display:flex;flex-direction:column;align-items:center;gap:16px">
        <span class="material-symbols-outlined" style="font-size:3rem;color:var(--md-sys-color-primary)">cloud_off</span>
        <p style="font-size:1.1rem;font-weight:600;color:var(--md-sys-color-on-surface);margin:0">GDBrowser API is down for now</p>
        <p style="font-size:.9rem;color:var(--md-sys-color-on-surface-variant);margin:0">Will update soon once it's back up.</p>
      </div>
    `;
  }

  function loadYoutubeEmbed(boxId, jsonPath, fallback) {
    fetch(jsonPath)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        document.getElementById(boxId).innerHTML = `
          <iframe src="${d.src}" title="${d.title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        `;
      })
      .catch(() => {
        document.getElementById(boxId).innerHTML = `
          <iframe src="${fallback.src}" title="${fallback.title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        `;
      });
  }

  loadYoutubeEmbed('ytBox', 'youtube.json', {
    src: 'https://www.youtube.com/embed/lvSsbSbUYnk',
    title: 'TETORIS',
  });
  loadYoutubeEmbed('vodBox', 'vod.json', {
    src: 'https://www.youtube.com/embed/5m0JCXdIBDk',
    title: 'geometry dash level requests! + doing random shi (READ DESC)',
  });

  const twitchScript = document.createElement('script');
  twitchScript.src = 'https://embed.twitch.tv/embed/v1.js';
  twitchScript.async = true;
  document.body.appendChild(twitchScript);
  twitchScript.onload = () => {
    const el = document.getElementById('twitchEmbed');
    if (el && window.Twitch) {
      new window.Twitch.Embed(el, {
        width: '100%',
        height: 400,
        channel: 'MalikHw47',
        parent: ['malikhw.github.io']
      });
    }
  };

  const kofiScript = document.createElement('script');
  kofiScript.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
  kofiScript.async = true;
  document.body.appendChild(kofiScript);
  kofiScript.onload = () => {
    if (window.kofiWidgetOverlay) {
      window.kofiWidgetOverlay.draw('malikhw47', {
        'type': 'floating-chat',
        'floating-chat.donateButton.text': 'Donate',
        'floating-chat.donateButton.background-color': '#f5c800',
        'floating-chat.donateButton.text-color': '#3a2e00'
      });
    }
  };

  const adsenseScript = document.createElement('script');
  adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2613515169840820';
  adsenseScript.async = true;
  adsenseScript.crossOrigin = 'anonymous';
  document.head.appendChild(adsenseScript);

  function isMalikHwDev(mod) {
    if (typeof mod.id === 'string' && mod.id.toLowerCase().includes('malikhw')) return true;

    if (mod.developer) {
      const d = mod.developer;
      if (typeof d === 'string' && d.toLowerCase().includes('malikhw')) return true;
      if (typeof d === 'object' && matchesDevObject(d)) return true;
    }

    const devs = Array.isArray(mod.developers) ? mod.developers : [];
    return devs.some((d) => {
      if (typeof d === 'string') return d.toLowerCase().includes('malikhw');
      if (typeof d === 'object' && d) return matchesDevObject(d);
      return false;
    });
  }

  function matchesDevObject(d) {
    const fields = [d.username, d.display_name, d.name, d.login].filter(Boolean);
    return fields.some((f) => String(f).toLowerCase().includes('malikhw'));
  }

  function extractDevNames(mod) {
    const names = [];
    if (mod.developer) names.push(typeof mod.developer === 'string' ? mod.developer : (mod.developer.username || mod.developer.display_name || mod.developer.name));
    const devs = Array.isArray(mod.developers) ? mod.developers : [];
    devs.forEach((d) => {
      if (typeof d === 'string') names.push(d);
      else if (d) names.push(d.username || d.display_name || d.name || d.login);
    });
    return names.filter(Boolean);
  }

  function modCardHtml(mod, source) {
    const isOpenGeode = source === 'open-geode';
    const version = (mod.versions && mod.versions[0]) || {};
    const sourceLink = (mod.links && mod.links.source) || (mod.repo ? `https://github.com/${mod.repo}` : null);
    const logoUrl = isOpenGeode
      ? `https://open-geode.7m.pl/v1/mods/${mod.id}/logo`
      : `https://api.geode-sdk.org/v1/mods/${mod.id}/logo`;
    const title = version.name || mod.id;
    const desc = version.description || mod.about || '';
    const downloads = typeof mod.download_count === 'number' ? mod.download_count.toLocaleString() : null;

    return `
      <div class="mod-card${isOpenGeode ? ' mod-card-yellow' : ''}">
        ${isOpenGeode ? '<div class="mod-badge">Open Geode Index</div>' : ''}
        <img class="mod-logo" src="${logoUrl}" alt="${title}" loading="lazy">
        <div class="mod-title">${title}</div>
        <div class="mod-desc">${desc}</div>
        ${downloads !== null ? `<div class="mod-downloads"><span class="material-symbols-outlined" style="font-size:1rem">download</span> ${downloads} downloads</div>` : ''}
        <div class="mod-btns">
          <md-filled-button href="${version.download_link}" target="_blank" rel="noopener" has-icon>
            <span slot="icon" class="material-symbols-outlined">download</span>
            Download
          </md-filled-button>
          ${sourceLink ? `
            <md-outlined-button href="${sourceLink}" target="_blank" rel="noopener" has-icon>
              <img slot="icon" src="https://cdn.simpleicons.org/github/ccc6a8" width="18" height="18" alt="GitHub" style="display:block">
              Source code
            </md-outlined-button>
          ` : ''}
        </div>
      </div>
    `;
  }

  function errorTileHtml(message, rawSample) {
    return `
      <div class="mod-card mod-card-error">
        <div class="mod-error-icon material-symbols-outlined">error</div>
        <div class="mod-title">Open Geode Index unavailable</div>
        <div class="mod-desc">Couldn't load mods from the Open Geode Index (${message}). This is usually caused by that server blocking cross-origin requests (CORS) or being temporarily down - try again later.</div>
        ${rawSample ? `<details class="mod-debug"><summary>Show raw response</summary><pre>${escapeHtml(rawSample)}</pre></details>` : ''}
      </div>
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function noMatchTileHtml(totalCount, seenDevelopers, rawSample) {
    const devList = seenDevelopers.length
      ? `Developers seen on that index: ${seenDevelopers.join(', ')}.`
      : `Couldn't find a recognizable developer field on those mods at all.`;
    return `
      <div class="mod-card mod-card-error">
        <div class="mod-error-icon material-symbols-outlined">error</div>
        <div class="mod-title">No MalikHw mods matched</div>
        <div class="mod-desc">The Open Geode Index responded with ${totalCount} mod(s), but none matched "MalikHw" by id or developer name. ${devList} The API's data shape may not match what this site expects.</div>
        <details class="mod-debug">
          <summary>Show raw sample data</summary>
          <pre>${escapeHtml(rawSample)}</pre>
        </details>
      </div>
    `;
  }

  function fetchOfficialMods() {
    return fetch('https://api.geode-sdk.org/v1/mods?developer=MalikHw47')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => ({ mods: (data.payload?.data || []).filter((m) => m.id.startsWith('malikhw47.')) }))
      .catch((err) => ({ mods: [], error: (err && err.message) || 'unknown error' }));
  }

  function fetchAllOpenGeodePages(page, acc, expectedTotal) {
    return fetch(`https://open-geode.7m.pl/v1/mods?page=${page}&per_page=100`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const pageMods = data.payload?.data || data.data || (Array.isArray(data) ? data : []);
        const total = typeof data.payload?.count === 'number' ? data.payload.count : (expectedTotal ?? pageMods.length);
        const combined = acc.concat(pageMods);

        if (pageMods.length > 0 && combined.length < total) {
          return fetchAllOpenGeodePages(page + 1, combined, total);
        }
        return { all: combined, rawFirstPage: data };
      });
  }

  function fetchOpenGeodeMods() {
    return fetchAllOpenGeodePages(1, [], null)
      .then(({ all, rawFirstPage }) => {
        window.__openGeodeDebug = rawFirstPage;

        const mods = all.filter(isMalikHwDev);

        if (!mods.length && all.length) {
          const seen = new Set();
          all.forEach((m) => extractDevNames(m).forEach((n) => seen.add(n)));
          let rawSample = JSON.stringify(all.slice(0, 2), null, 2);
          if (rawSample.length > 1500) rawSample = rawSample.slice(0, 1500) + '\n… (truncated)';
          return {
            mods: [],
            noMatch: true,
            totalCount: all.length,
            seenDevelopers: Array.from(seen).slice(0, 20),
            rawSample,
          };
        }
        if (!all.length) {
          let rawSample = JSON.stringify(rawFirstPage, null, 2);
          if (rawSample.length > 1500) rawSample = rawSample.slice(0, 1500) + '\n… (truncated)';
          return { mods: [], error: 'the index returned 0 mods total', rawSample };
        }
        return { mods };
      })
      .catch((err) => ({ mods: [], error: (err && err.message) || 'unknown error (likely CORS)' }));
  }

  function loadGeodeMods() {
    if (geodeLoaded) return;
    const grid = document.getElementById('geodeGrid');

    Promise.all([fetchOfficialMods(), fetchOpenGeodeMods()]).then(([official, openGeode]) => {
      geodeLoaded = true;

      const officialHtml = official.mods.map((m) => modCardHtml(m, 'official')).join('');
      let openGeodeHtml;
      if (openGeode.error) {
        openGeodeHtml = errorTileHtml(openGeode.error, openGeode.rawSample);
      } else if (openGeode.noMatch) {
        openGeodeHtml = noMatchTileHtml(openGeode.totalCount, openGeode.seenDevelopers, openGeode.rawSample);
      } else {
        openGeodeHtml = openGeode.mods.map((m) => modCardHtml(m, 'open-geode')).join('');
      }

      if (!official.mods.length && !openGeode.mods.length && !openGeode.error && !openGeode.noMatch) {
        grid.innerHTML = '<p class="loading-txt">No mods found.</p>';
        return;
      }

      grid.innerHTML = officialHtml + openGeodeHtml;
    });
  }
})();
