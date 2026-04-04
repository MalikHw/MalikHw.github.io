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

  tabs.addEventListener('change', () => {
    const active = tabs.activeTabIndex;
    panelProjects.classList.toggle('hidden', active !== 0);
    panelGd.classList.toggle('hidden', active !== 1);
    if (active === 1) loadGd();
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

  const gdStats = [
    { key: 'stars',     label: 'Stars',        icon: 'nf nf-md-star',            color: '#FFD700' },
    { key: 'cp',        label: 'Creator Points',icon: 'nf nf-md-trophy',          color: '#FF6B6B' },
    { key: 'rank',      label: 'Rank',          icon: 'nf nf-md-podium',          color: '#4ECDC4' },
    { key: 'diamonds',  label: 'Diamonds',      icon: 'nf nf-md-diamond_stone',   color: '#95E1D3' },
    { key: 'demons',    label: 'Demons',        icon: 'nf nf-md-ghost',           color: '#F38181' },
    { key: 'userCoins', label: 'User Coins',    icon: 'nf nf-md-coin',            color: '#AA96DA' },
    { key: 'coins',     label: 'Secret Coins',  icon: 'nf nf-md-circle_multiple', color: '#FCBAD3' }
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

  fetch('/youtube.json')
    .then((r) => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then((d) => {
      document.getElementById('ytBox').innerHTML = `
        <iframe src="${d.src}" title="${d.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      `;
    })
    .catch(() => {
      document.getElementById('ytBox').innerHTML = `
        <iframe src="https://www.youtube.com/embed/lvSsbSbUYnk" title="TETORIS"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      `;
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

  const text = 'Small Dev, GD player, and Professional Shit-Poster';
  let ci = 0;
  const tw = document.getElementById('typewriter');

  function typeStep() {
    tw.textContent = text.slice(0, ci + 1);
    ci++;
    if (ci < text.length) setTimeout(typeStep, 40);
  }
  setTimeout(typeStep, 800);

  const canvas = document.getElementById('aurora');
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawAurora() {
    ctx.clearRect(0, 0, W, H);
    const colors = ['#850000', '#853500', '#850045'];
    for (let l = 0; l < 3; l++) {
      const c = colors[l];
      const grad = ctx.createLinearGradient(0, H * .2, W, H * .8);
      grad.addColorStop(0, c + '00');
      grad.addColorStop(.5, c + 'cc');
      grad.addColorStop(1, c + '00');
      ctx.beginPath();
      ctx.moveTo(0, H * .5);
      for (let x = 0; x <= W; x += 4) {
        const y = H * .5
          + Math.sin(x * .006 + t * .4 + l * 1.2) * H * .12
          + Math.sin(x * .003 + t * .25 + l * .8) * H * .08;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.globalAlpha = .35;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    t += 0.012;
    requestAnimationFrame(drawAurora);
  }
  drawAurora();
})();
