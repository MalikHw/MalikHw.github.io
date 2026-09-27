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
          ${(p.buttons || []).map((b, i) => `
            <a href="${b.url}" target="_blank" rel="noopener" class="proj-btn${i > 0 ? ' secondary' : ''}" style="${i === 0 ? 'background:' + p.borderColor : ''}">
              ${b.icon ? `<span class="${b.icon}"></span>` : ''}${b.text}
            </a>
          `).join('')}
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

  const gdStats = [
    { key: 'stars', label: 'Stars', icon: 'nf nf-md-star', color: '#FFD700' },
    { key: 'cp', label: 'Creator Points',icon: 'nf nf-md-trophy', color: '#FF6B6B' },
    { key: 'rank', label: 'Rank', icon: 'nf nf-md-podium', color: '#4ECDC4' },
    { key: 'diamonds', label: 'Diamonds', icon: 'nf nf-md-diamond_stone', color: '#95E1D3' },
    { key: 'demons', label: 'Demons', icon: 'nf nf-md-ghost', color: '#F38181' },
    { key: 'userCoins', label: 'User Coins', icon: 'nf nf-fae-coins', color: '#AA96DA' },
    { key: 'coins', label: 'Secret Coins', icon: 'nf nf-md-circle_multiple', color: '#ebd234' }
  ];

  function fetchAredlRank() {
    return fetch('https://api.aredl.net/v2/api/aredl/profile/1131020856827580508')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => (data.rank && typeof data.rank.rank === 'number' ? data.rank.rank : null))
      .catch(() => null);
  }

  function fetchGdlRank() {
    return fetch('https://api.demonlist.org/user/get?id=24010')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => (data.data && typeof data.data.placement === 'number' ? data.data.placement : null))
      .catch(() => null);
  }

  function loadGd() {
    if (gdLoaded) return;
    const grid = document.getElementById('gdGrid');

    const profilePromise = fetch('https://gdbrowser.com/api/profile/MalikHw47')
      .then((r) => r.json())
      .catch(() => null);

    Promise.all([profilePromise, fetchAredlRank(), fetchGdlRank()]).then(([data, aredlRank, gdlRank]) => {
      gdLoaded = true;

      if (!data) {
        grid.innerHTML = '<p class="loading-txt">Failed to load GD stats.</p>';
        return;
      }

      const standardHtml = gdStats.map((s) => `
        <div class="gd-card" style="border-color:${s.color}40">
          <span class="gd-icon ${s.icon}" style="color:${s.color}"></span>
          <div class="gd-val" style="color:${s.color}">${(data[s.key] || 0).toLocaleString()}</div>
          <div class="gd-lbl">${s.label}</div>
        </div>
      `).join('');

      const extraStats = [
        { text: 'AREDL', label: 'AREDL Rank', value: aredlRank, color: '#ff5964' },
        { text: 'Global Demonlist', label: 'GDL Rank', value: gdlRank, color: '#5cdb95' },
      ];

      const extraHtml = extraStats.map((s) => `
        <div class="gd-card" style="border-color:${s.color}40">
          <div class="gd-text-icon" style="color:${s.color}">${s.text}</div>
          <div class="gd-val" style="color:${s.color}">${s.value !== null ? '#' + s.value.toLocaleString() : 'N/A'}</div>
          <div class="gd-lbl">${s.label}</div>
        </div>
      `).join('');

      grid.innerHTML = standardHtml + extraHtml;
    });
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
        height: 420,
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
        'floating-chat.donateButton.background-color': '#2e2eb3',
        'floating-chat.donateButton.text-color': '#fff'
      });
    }
  };

  const adsenseScript = document.createElement('script');
  adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2613515169840820';
  adsenseScript.async = true;
  adsenseScript.crossOrigin = 'anonymous';
  document.head.appendChild(adsenseScript);

  function isMalikHwDev(mod) {
    // The id itself is often prefixed by the developer's username (e.g. malikhw47.xyz).
    if (typeof mod.id === 'string' && mod.id.toLowerCase().includes('malikhw')) return true;

    // A single "developer" field, as a string or object, seen on some index implementations.
    if (mod.developer) {
      const d = mod.developer;
      if (typeof d === 'string' && d.toLowerCase().includes('malikhw')) return true;
      if (typeof d === 'object' && matchesDevObject(d)) return true;
    }

    // The usual "developers" array — entries can be plain strings or {username, display_name} objects.
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
        ${downloads !== null ? `<div class="mod-downloads"><span class="nf nf-md-download"></span> ${downloads} downloads</div>` : ''}
        <div class="mod-btns">
          <a href="${version.download_link}" target="_blank" rel="noopener" class="proj-btn">Download</a>
          ${sourceLink ? `<a href="${sourceLink}" target="_blank" rel="noopener" class="proj-btn secondary">Source code</a>` : ''}
        </div>
      </div>
    `;
  }

  function errorTileHtml(message, rawSample) {
    return `
      <div class="mod-card mod-card-error">
        <div class="mod-error-icon nf nf-md-alert_circle_outline"></div>
        <div class="mod-title">Open Geode Index unavailable</div>
        <div class="mod-desc">Couldn't load mods from the Open Geode Index (${message}). This is usually caused by that server blocking cross-origin requests (CORS) or being temporarily down — try again later.</div>
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
        <div class="mod-error-icon nf nf-md-alert_circle_outline"></div>
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

  // The Open Geode Index paginates (default 50 per page) and reports the true
  // total in payload.count, which can be higher than a single page's worth of
  // mods. Walk every page so we don't silently miss mods past page 1.
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
        // Stash on window for anyone who does have devtools handy.
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
