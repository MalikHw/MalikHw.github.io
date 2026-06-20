(function () {
  const donateWrap = document.getElementById('donateWrap');
  const donateBtn = document.getElementById('donateBtn');
  const donateMenu = document.getElementById('donateMenu');
  const donChev = document.getElementById('donChev');
  const merchBtn = document.getElementById('merchBtn');

  donateBtn.addEventListener('click', () => {
    const open = donateMenu.classList.toggle('open');
    donChev.className = open ? 'nf nf-md-chevron_up' : 'nf nf-md-chevron_down';
  });

  document.addEventListener('mousedown', (e) => {
    if (!donateWrap.contains(e.target)) {
      donateMenu.classList.remove('open');
      donChev.className = 'nf nf-md-chevron_down';
    }
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

  function loadGd() {
    if (gdLoaded) return;
    fetch('https://gdbrowser.com/api/profile/MalikHw47')
      .then((r) => r.json())
      .then((data) => {
        gdLoaded = true;
        const grid = document.getElementById('gdGrid');
        grid.innerHTML = gdStats.map((s) => `
          <div class="gd-card" style="border-color:${s.color}40">
            <span class="gd-icon ${s.icon}" style="color:${s.color}"></span>
            <div class="gd-val" style="color:${s.color}">${(data[s.key] || 0).toLocaleString()}</div>
            <div class="gd-lbl">${s.label}</div>
          </div>
        `).join('');
      })
      .catch(() => {
        document.getElementById('gdGrid').innerHTML = '<p class="loading-txt">Failed to load GD stats.</p>';
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

  function loadGeodeMods() {
    if (geodeLoaded) return;
    const grid = document.getElementById('geodeGrid');
    fetch('https://api.geode-sdk.org/v1/mods?developer=MalikHw47')
      .then((r) => r.json())
      .then((data) => {
        geodeLoaded = true;
        const mods = (data.payload?.data || []).filter((m) => m.id.startsWith('malikhw47.'));
        if (!mods.length) {
          grid.innerHTML = '<p class="loading-txt">No mods found.</p>';
          return;
        }
        grid.innerHTML = mods.map((mod) => {
          const version = mod.versions?.[0] || {};
          const source = mod.links?.source;
          return `
            <div class="mod-card">
              <img class="mod-logo" src="https://api.geode-sdk.org/v1/mods/${mod.id}/logo" alt="${version.name || mod.id}" loading="lazy">
              <div class="mod-title">${version.name || mod.id}</div>
              <div class="mod-desc">${version.description || ''}</div>
              <div class="mod-btns">
                <a href="${version.download_link}" target="_blank" rel="noopener" class="proj-btn">Download</a>
                ${source ? `<a href="${source}" target="_blank" rel="noopener" class="proj-btn secondary">Source code</a>` : ''}
              </div>
            </div>
          `;
        }).join('');
      })
      .catch(() => {
        grid.innerHTML = '<p class="loading-txt">Failed to load mods.</p>';
      });
  }
})();
