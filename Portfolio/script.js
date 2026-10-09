/* ===== Thème clair / sombre ===== */
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function apply(theme, save) {
    root.setAttribute('data-theme', theme);
    btn.setAttribute('aria-label', theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre');
    if (save) {
      try { localStorage.setItem('theme', theme); } catch (e) { /* stockage indisponible */ }
    }
    document.dispatchEvent(new Event('themechange'));
  }

  apply(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  btn.addEventListener('click', () => {
    apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });
})();

/* ===== Palette de couleurs ===== */
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('palette-btn');
  const menu = document.getElementById('palette-menu');
  if (!btn || !menu) return;
  const items = Array.from(menu.querySelectorAll('[data-palette]'));

  function apply(name, save) {
    root.setAttribute('data-palette', name);
    items.forEach((i) => i.setAttribute('aria-checked', String(i.dataset.palette === name)));
    if (save) {
      try { localStorage.setItem('palette', name); } catch (e) { /* stockage indisponible */ }
    }
    document.dispatchEvent(new Event('themechange'));
  }
  function close() {
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  items.forEach((i) => i.addEventListener('click', () => {
    apply(i.dataset.palette, true);
    close();
  }));
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  apply(root.getAttribute('data-palette') || 'framboise', false);
})();

/* ===== Menu mobile ===== */
(function () {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ===== Section active dans la navigation ===== */
(function () {
  const links = Array.from(document.querySelectorAll('.nav__links a[data-section]'));
  if (!links.length) return;

  function setActive(id) {
    links.forEach((a) => {
      const on = a.dataset.section === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  let onProjectPage = false;
  document.addEventListener('routechange', (e) => {
    onProjectPage = e.detail.view === 'project';
    if (onProjectPage) setActive('projets');
  });

  const hero = document.getElementById('hero');
  const sections = links.map((a) => document.getElementById(a.dataset.section)).filter(Boolean);

  function atBottom() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  }

  if ('IntersectionObserver' in window) {
    // La section qui traverse la ligne du milieu de l'écran devient active.
    const io = new IntersectionObserver((entries) => {
      if (onProjectPage) return;
      if (atBottom() && sections.length) {
        setActive(sections[sections.length - 1].id);
        return;
      }
      entries.forEach((en) => {
        if (en.isIntersecting) setActive(en.target === hero ? '' : en.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
    if (hero) io.observe(hero);
  }

  // En bas de page, la dernière section est active.
  window.addEventListener('scroll', () => {
    if (onProjectPage || !sections.length) return;
    if (atBottom()) setActive(sections[sections.length - 1].id);
  }, { passive: true });
})();

/* ===== À propos ===== */
(function () {
  if (typeof ABOUT === 'undefined') return;
  const root = document.getElementById('about-content');
  if (!root) return;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function timeline(items) {
    const ol = el('ol', 'timeline');
    items.forEach((it) => {
      const li = el('li', 'tl');
      li.appendChild(el('p', 'tl__period' + (it.period ? '' : ' is-empty'), it.period || 'Dates à compléter'));
      li.appendChild(el('h4', 'tl__title', it.title));
      if (it.org) li.appendChild(el('p', 'tl__org', it.org));

      if (it.bullets && it.bullets.length) {
        const ul = el('ul', 'bullets');
        it.bullets.forEach((b) => ul.appendChild(el('li', null, b)));
        li.appendChild(ul);
      }
      if (it.skills && it.skills.length) {
        const tags = el('ul', 'tags');
        it.skills.forEach((s) => tags.appendChild(el('li', 'tag', s)));
        li.appendChild(tags);
      }
      if (it.project && typeof PROJECTS !== 'undefined' && PROJECTS.some((p) => p.id === it.project)) {
        const a = el('a', 'tl__link', 'Voir le projet →');
        a.href = '#/projet/' + it.project;
        li.appendChild(a);
      }
      ol.appendChild(li);
    });
    return ol;
  }

  // présentation + fiche « en bref »
  const top = el('div', 'about');
  const text = el('div', 'about__text');
  (ABOUT.intro || []).forEach((para) => text.appendChild(el('p', null, para)));
  top.appendChild(text);

  if (ABOUT.facts && ABOUT.facts.length) {
    const dl = el('dl', 'about__facts');
    ABOUT.facts.forEach((f) => {
      const row = el('div');
      row.appendChild(el('dt', null, f.label));
      row.appendChild(el('dd', null, f.value));
      dl.appendChild(row);
    });
    top.appendChild(dl);
  }
  root.appendChild(top);

  if (ABOUT.education && ABOUT.education.length) {
    root.appendChild(el('h3', 'subhead', 'Formation'));
    root.appendChild(timeline(ABOUT.education));
  }
  if (ABOUT.experience && ABOUT.experience.length) {
    root.appendChild(el('h3', 'subhead', 'Expérience'));
    root.appendChild(timeline(ABOUT.experience));
  }
})();

/* ===== Projets : cartes + page d'un projet ===== */
(function () {
  if (typeof PROJECTS === 'undefined') return;
  const home = document.getElementById('home');
  const view = document.getElementById('project-view');
  const grid = document.getElementById('projects-grid');
  if (!home || !view || !grid) return;

  const BASE_TITLE = document.title;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function tagList(list, max) {
    const ul = el('ul', 'tags');
    const shown = max ? list.slice(0, max) : list;
    shown.forEach((t) => ul.appendChild(el('li', 'tag', t)));
    if (max && list.length > max) ul.appendChild(el('li', 'tag', '+' + (list.length - max)));
    return ul;
  }

  function linkBtn(label, url, primary) {
    if (url) {
      const a = el('a', 'btn btn--small' + (primary ? ' btn--primary' : ''), label);
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      return a;
    }
    const s = el('span', 'btn btn--small is-disabled', label + ' · bientôt');
    s.setAttribute('aria-disabled', 'true');
    return s;
  }

  function bullets(list) {
    const ul = el('ul', 'bullets');
    list.forEach((item) => ul.appendChild(el('li', null, item)));
    return ul;
  }

  function section(title) {
    const s = el('section', 'project__section');
    s.appendChild(el('h2', null, title));
    return s;
  }

  /* ----- Image de couverture (ou motif de réseau s'il n'y a pas d'image) ----- */
  function seededRandom(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    let a = h >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function placeholderSvg(seed) {
    const NS = 'http://www.w3.org/2000/svg';
    const W = 320, H = 180, LINK = 75;
    const rnd = seededRandom(seed);
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('aria-hidden', 'true');

    const colors = ['--primary', '--accent-1', '--accent-2', '--accent-3'];
    const pts = Array.from({ length: 24 }, () => ({
      x: rnd() * W, y: rnd() * H, r: 2 + rnd() * 3.5, c: Math.floor(rnd() * 4),
    }));

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < LINK) {
          const line = document.createElementNS(NS, 'line');
          line.setAttribute('x1', pts[i].x.toFixed(1));
          line.setAttribute('y1', pts[i].y.toFixed(1));
          line.setAttribute('x2', pts[j].x.toFixed(1));
          line.setAttribute('y2', pts[j].y.toFixed(1));
          line.setAttribute('stroke-opacity', ((1 - d / LINK) * 0.55).toFixed(2));
          line.style.stroke = 'var(--primary)';
          svg.appendChild(line);
        }
      }
    }
    pts.forEach((pt) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', pt.x.toFixed(1));
      c.setAttribute('cy', pt.y.toFixed(1));
      c.setAttribute('r', pt.r.toFixed(1));
      c.style.fill = 'var(' + colors[pt.c] + ')';
      svg.appendChild(c);
    });
    return svg;
  }

  function coverEl(p, extraClass) {
    const wrap = el('div', 'cover' + (extraClass ? ' ' + extraClass : ''));
    const fallback = () => {
      wrap.replaceChildren(placeholderSvg(p.id));
      wrap.classList.add('is-placeholder');
    };
    if (p.image) {
      const img = el('img');
      img.src = p.image;
      img.alt = p.imageAlt || 'Aperçu du projet ' + p.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', fallback); // image introuvable → motif de secours
      wrap.appendChild(img);
    } else {
      fallback();
    }
    return wrap;
  }

  /* ----- Cartes de la page d'accueil ----- */
  const cards = [];
  PROJECTS.forEach((p) => {
    const card = el('article', 'card');
    card.appendChild(coverEl(p));
    card.appendChild(el('p', 'card__kicker', p.kicker));
    card.appendChild(el('h3', 'card__title', p.title));
    card.appendChild(el('p', 'card__summary', p.summary));
    card.appendChild(tagList(p.stack, 4));

    const actions = el('div', 'card__actions');
    const more = el('a', 'btn btn--small btn--primary', 'Lire le projet →');
    more.href = '#/projet/' + p.id;
    actions.appendChild(more);
    const l = p.links || {};
    actions.appendChild(linkBtn('GitHub ↗', l.github));
    if (l.demo) actions.appendChild(linkBtn('Démo ↗', l.demo));
    card.appendChild(actions);

    grid.appendChild(card);
    cards.push({ card, p });
  });

  /* ----- Filtres par métier ----- */
  const filterBar = document.getElementById('project-filters');
  const emptyMsg = document.getElementById('projects-empty');

  function applyFilter(id) {
    let shown = 0;
    cards.forEach(({ card, p }) => {
      const ok = id === 'all' || (p.categories || []).indexOf(id) !== -1;
      card.hidden = !ok;
      if (ok) shown++;
    });
    filterBar.querySelectorAll('.filter').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.filter === id));
    });
    if (emptyMsg) emptyMsg.hidden = shown > 0;
  }

  if (filterBar && typeof CATEGORIES !== 'undefined') {
    CATEGORIES.forEach((c) => {
      const count = c.id === 'all'
        ? PROJECTS.length
        : PROJECTS.filter((p) => (p.categories || []).indexOf(c.id) !== -1).length;
      if (c.id !== 'all' && count === 0) return; // pas de bouton pour une catégorie vide
      const b = el('button', 'filter');
      b.type = 'button';
      b.dataset.filter = c.id;
      b.appendChild(document.createTextNode(c.label));
      b.appendChild(el('span', 'filter__count', String(count)));
      b.addEventListener('click', () => applyFilter(c.id));
      filterBar.appendChild(b);
    });
    applyFilter('all');
  }

  /* ----- Page complète d'un projet ----- */
  function renderProject(p, index) {
    view.replaceChildren();
    const art = el('article', 'project');

    const back = el('a', 'back', '← Tous les projets');
    back.href = '#projets';
    art.appendChild(back);

    art.appendChild(coverEl(p, 'project__cover'));

    art.appendChild(el('p', 'card__kicker', p.kicker));
    art.appendChild(el('h1', 'project__title', p.title));
    art.appendChild(el('p', 'project__lead', p.summary));

    const l = p.links || {};
    const actions = el('div', 'project__actions');
    actions.appendChild(linkBtn('Code sur GitHub', l.github, true));
    if (l.demo) actions.appendChild(linkBtn('Démo', l.demo));
    if (l.report) actions.appendChild(linkBtn('Rapport', l.report));
    art.appendChild(actions);

    art.appendChild(tagList(p.stack));

    const meta = (p.meta || []).slice();
    if (p.categories && p.categories.length && typeof CATEGORIES !== 'undefined') {
      const names = p.categories
        .map((id) => (CATEGORIES.find((c) => c.id === id) || {}).label)
        .filter(Boolean);
      if (names.length) meta.push({ label: 'Profil', value: names.join(' · ') });
    }
    if (meta.length) {
      const dl = el('dl', 'project__meta');
      meta.forEach((m) => {
        const box = el('div');
        box.appendChild(el('dt', null, m.label));
        box.appendChild(el('dd', m.value ? null : 'is-empty', m.value || 'à compléter'));
        dl.appendChild(box);
      });
      art.appendChild(dl);
    }

    if (p.metrics && p.metrics.length) {
      const wrap = el('div', 'metrics');
      p.metrics.forEach((m) => {
        const tile = el('div', 'metric');
        tile.appendChild(el('span', 'metric__value', m.value));
        tile.appendChild(el('span', 'metric__label', m.label));
        wrap.appendChild(tile);
      });
      art.appendChild(wrap);
    }

    const ctx = section('Contexte et problème');
    ctx.appendChild(el('p', null, p.context));
    art.appendChild(ctx);

    const stepsSec = section('Les étapes du projet');
    stepsSec.appendChild(el('p', 'project__intro', 'Comment j’ai procédé, étape par étape.'));
    const ol = el('ol', 'steps');
    p.steps.forEach((s, i) => {
      const li = el('li', 'step');
      li.appendChild(el('span', 'step__num', String(i + 1)));
      li.appendChild(el('h3', 'step__title', s.title));
      li.appendChild(el('p', 'step__text' + (s.text ? '' : ' is-empty'), s.text || 'À compléter'));
      if (s.bullets && s.bullets.length) li.appendChild(bullets(s.bullets));
      if (s.image) {
        const fig = el('figure', 'step__figure');
        const img = el('img');
        img.src = s.image;
        img.alt = s.imageCaption || s.title;
        img.loading = 'lazy';
        img.addEventListener('error', () => fig.remove()); // image introuvable → on n'affiche rien
        fig.appendChild(img);
        if (s.imageCaption) fig.appendChild(el('figcaption', null, s.imageCaption));
        li.appendChild(fig);
      }
      ol.appendChild(li);
    });
    stepsSec.appendChild(ol);
    art.appendChild(stepsSec);

    const resSec = section('Résultats');
    const hasDetail = (p.resultsPoints && p.resultsPoints.length) || p.resultsTable;
    if (!hasDetail) {
      resSec.appendChild(el('p', p.result ? null : 'is-empty', p.result || 'À compléter'));
    }
    if (p.resultsPoints && p.resultsPoints.length) resSec.appendChild(bullets(p.resultsPoints));
    if (p.resultsTable) {
      const t = p.resultsTable;
      const wrap = el('div', 'table-wrap');
      const table = el('table');
      if (t.caption) table.appendChild(el('caption', null, t.caption));
      const thead = el('thead');
      const hr = el('tr');
      t.head.forEach((h) => hr.appendChild(el('th', null, h)));
      thead.appendChild(hr);
      table.appendChild(thead);
      const tbody = el('tbody');
      t.rows.forEach((row) => {
        const tr = el('tr');
        row.forEach((cell) => tr.appendChild(el('td', null, cell)));
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      resSec.appendChild(wrap);
    }
    art.appendChild(resSec);

    // projet précédent / suivant
    const pager = el('nav', 'pager');
    pager.setAttribute('aria-label', 'Autres projets');
    const prev = PROJECTS[index - 1];
    const next = PROJECTS[index + 1];
    if (prev) {
      const a = el('a', 'pager__prev');
      a.href = '#/projet/' + prev.id;
      a.appendChild(el('small', null, '← Projet précédent'));
      a.appendChild(el('strong', null, prev.title));
      pager.appendChild(a);
    }
    if (next) {
      const a = el('a', 'pager__next');
      a.href = '#/projet/' + next.id;
      a.appendChild(el('small', null, 'Projet suivant →'));
      a.appendChild(el('strong', null, next.title));
      pager.appendChild(a);
    }
    art.appendChild(pager);

    view.appendChild(art);
  }

  /* ----- Navigation entre l'accueil et les pages de projet ----- */
  function showHome() {
    const wasProject = !view.hidden;
    view.hidden = true;
    home.hidden = false;
    document.title = BASE_TITLE;
    document.dispatchEvent(new CustomEvent('routechange', { detail: { view: 'home' } }));

    const id = location.hash.slice(1);
    const target = id && id.charAt(0) !== '/' ? document.getElementById(id) : null;
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else if (wasProject) window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showProject(index) {
    const p = PROJECTS[index];
    renderProject(p, index);
    home.hidden = true;
    view.hidden = false;
    document.title = p.title + ' — Ndèye Fatou Niassy';
    document.dispatchEvent(new CustomEvent('routechange', { detail: { view: 'project' } }));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function route() {
    const m = location.hash.match(/^#\/projet\/([\w-]+)/);
    const index = m ? PROJECTS.findIndex((p) => p.id === m[1]) : -1;
    if (index >= 0) showProject(index);
    else showHome();
  }

  window.addEventListener('hashchange', route);
  route();
})();

/* ===== Compétences, certifications, livres ===== */
(function () {
  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text) n.textContent = text;
    return n;
  }
  function img(src, alt, onFail) {
    const i = document.createElement('img');
    i.src = src; i.alt = alt || ''; i.loading = 'lazy';
    i.onerror = function () { i.remove(); if (onFail) onFail(); };
    return i;
  }

  // Compétences
  const sk = document.getElementById('skills-grid');
  if (sk && typeof SKILLS !== 'undefined') {
    SKILLS.forEach((g) => {
      const c = el('article', 'skill');
      c.appendChild(el('h3', null, g.title));
      if (g.text) c.appendChild(el('p', null, g.text));
      const ul = el('ul', 'tags');
      g.items.forEach((x) => ul.appendChild(el('li', 'tag', x)));
      c.appendChild(ul);
      sk.appendChild(c);
    });
  }

  // Certifications
  const ce = document.getElementById('certs-grid');
  if (ce && typeof CERTIFICATIONS !== 'undefined') {
    CERTIFICATIONS.forEach((x) => {
      const c = el('article', 'cert' + (x.draft ? ' is-draft' : ''));
      const badge = el('div', 'cert__badge');
      badge.appendChild(el('span', null, '✦'));
      if (x.image) badge.appendChild(img(x.image, x.title));
      c.appendChild(badge);
      const body = el('div', 'cert__body');
      body.appendChild(el('h3', null, x.title));
      body.appendChild(el('p', 'cert__meta', [x.issuer, x.date].filter(Boolean).join(' · ')));
      if (x.skills && x.skills.length) {
        const ul = el('ul', 'tags');
        x.skills.forEach((s) => ul.appendChild(el('li', 'tag', s)));
        body.appendChild(ul);
      }
      if (x.url) {
        const a = el('a', 'tl__link', 'Vérifier →');
        a.href = x.url; a.target = '_blank'; a.rel = 'noopener';
        body.appendChild(a);
      }
      if (x.draft) body.appendChild(el('p', 'cert__draft', 'À compléter'));
      c.appendChild(body);
      ce.appendChild(c);
    });
  }

  // Livres
  const bg = document.getElementById('books-grid');
  const bf = document.getElementById('book-filters');
  if (bg && bf && typeof BOOKS !== 'undefined') {
    const label = {};
    BOOK_DOMAINS.forEach((d) => { label[d.id] = d.label; });
    const cards = BOOKS.map((b) => {
      const c = el('article', 'book' + (b.draft ? ' is-draft' : ''));
      c.dataset.domain = b.domain;
      const cover = el('div', 'book__cover');
      cover.dataset.domain = b.domain;
      const fb = el('div', 'book__fallback');
      fb.appendChild(el('span', null, b.title));
      cover.appendChild(fb);
      if (b.image) cover.appendChild(img(b.image, 'Couverture : ' + b.title));
      c.appendChild(cover);
      c.appendChild(el('p', 'book__domain', label[b.domain] || ''));
      c.appendChild(el('h4', 'book__title', b.title));
      if (b.author) c.appendChild(el('p', 'book__author', b.author));
      if (b.note) c.appendChild(el('p', 'book__note', b.note));
      bg.appendChild(c);
      return c;
    });
    function apply(id) {
      cards.forEach((c) => { c.hidden = !(id === 'all' || c.dataset.domain === id); });
      Array.from(bf.children).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
    }
    BOOK_DOMAINS.forEach((d) => {
      const n = d.id === 'all' ? BOOKS.length : BOOKS.filter((b) => b.domain === d.id).length;
      if (d.id !== 'all' && !n) return;
      const btn = el('button', 'filter');
      btn.type = 'button'; btn.dataset.id = d.id;
      btn.appendChild(document.createTextNode(d.label + ' '));
      btn.appendChild(el('span', 'filter__count', String(n)));
      btn.addEventListener('click', () => apply(d.id));
      bf.appendChild(btn);
    });
    apply('all');
  }
})();

/* ===== Bannière : réseau de nœuds animé ===== */
(function () {
  const canvas = document.getElementById('network');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Les couleurs viennent des variables CSS de la palette active
  let NODE_COLORS = ['#c9467a', '#b39ddb', '#f4a98a', '#e58fb0'];
  let LINE_COLOR = '201, 70, 122';
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const get = (name) => cs.getPropertyValue(name).trim();
    const colors = ['--primary', '--accent-1', '--accent-2', '--accent-3'].map(get);
    if (colors.every(Boolean)) NODE_COLORS = colors;
    const rgb = get('--net-rgb');
    if (rgb) LINE_COLOR = rgb;
  }
  readColors();
  document.addEventListener('themechange', () => {
    readColors();
    if (reduceMotion) frame();
  });

  let w = 0, h = 0, linkDist = 130, nodes = [];
  const mouse = { x: null, y: null };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return; // bannière masquée (page de projet)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    linkDist = w < 600 ? 95 : 135;
    const count = Math.round(Math.min(75, Math.max(28, (w * h) / 8500)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 2 + Math.random() * 3.5,
      ci: Math.floor(Math.random() * 4),
    }));
  }

  function drawLine(x1, y1, x2, y2, alpha) {
    ctx.strokeStyle = `rgba(${LINE_COLOR}, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  let running = false;
  function frame() {
    ctx.clearRect(0, 0, w, h);

    for (const n of nodes) {
      if (!reduceMotion) {
        if (mouse.x !== null) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
          if (d < 170 && d > 1) { n.x += (dx / d) * 0.35; n.y += (dy / d) * 0.35; }
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
    }

    // liens entre nœuds proches
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < linkDist) drawLine(a.x, a.y, b.x, b.y, (1 - d / linkDist) * 0.45);
      }
    }

    // liens vers le curseur
    if (mouse.x !== null) {
      for (const n of nodes) {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (d < linkDist * 1.2) drawLine(n.x, n.y, mouse.x, mouse.y, (1 - d / (linkDist * 1.2)) * 0.6);
      }
    }

    // nœuds
    for (const n of nodes) {
      ctx.fillStyle = NODE_COLORS[n.ci];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(frame);
  }

  canvas.parentElement.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener('pointerleave', () => {
    mouse.x = mouse.y = null;
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      if (reduceMotion) frame();
    }, 150);
  });

  // la bannière reprend vie quand on revient à l'accueil depuis une page de projet
  document.addEventListener('routechange', (e) => {
    if (e.detail.view === 'home') {
      resize();
      if (reduceMotion) frame();
    }
  });

  resize();
  frame();
})();


/* ===== Effets dynamiques ===== */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Barre de progression de lecture + ombre de l'en-tête
  const bar = document.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  const nav = document.querySelector('.nav');
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Apparition progressive des éléments au défilement
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(
      '#home .section__title, #home .section__intro, #home .subhead, .about, .tl, .skill, .cert, .soon, .filters, .footer__inner'
    ).forEach((n, i) => {
      n.classList.add('reveal');
      n.style.transitionDelay = ((i % 3) * 80) + 'ms';
      io.observe(n);
    });
  }

  // Texte du bandeau qui s'écrit en alternance
  const title = document.querySelector('.hero__title');
  if (title && !reduce) {
    const phrases = ['Ingénieure IA / Data', 'Agents LLM & RAG', 'NLP en wolof et en français', 'Pipelines de données'];
    title.setAttribute('aria-label', phrases[0]);
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');
    title.textContent = '';
    title.append(span, caret);
    let pi = 0, ci = phrases[0].length, deleting = false;
    span.textContent = phrases[0];
    function tick() {
      const full = phrases[pi];
      let delay = deleting ? 35 : 70;
      if (!deleting && ci === full.length) { deleting = true; delay = 2200; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
      else ci += deleting ? -1 : 1;
      span.textContent = phrases[pi].slice(0, ci);
      setTimeout(tick, delay);
    }
    setTimeout(tick, 2200);
  }

  // Inclinaison des cartes de projet au survol (souris uniquement)
  if (!reduce && finePointer) {
    const grid = document.getElementById('projects-grid');
    if (grid) {
      grid.addEventListener('pointermove', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg) translateY(-3px)';
      });
      grid.addEventListener('pointerout', (e) => {
        const card = e.target.closest('.card');
        if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
      });
    }
  }

  // Chiffres clés qui comptent jusqu'à leur valeur (pages de projet)
  function countUp(node) {
    const m = /^(\d+(?:[.,]\d+)?)(.*)$/.exec(node.textContent.trim());
    if (!m) return;
    const comma = m[1].indexOf(',') > -1;
    const target = parseFloat(m[1].replace(',', '.'));
    const dec = comma || m[1].indexOf('.') > -1 ? m[1].split(/[.,]/)[1].length : 0;
    const t0 = performance.now(), dur = 1100;
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      let v = (target * e).toFixed(dec);
      if (comma) v = v.replace('.', ',');
      node.textContent = v + m[2];
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  if (!reduce) {
    document.addEventListener('routechange', (e) => {
      if (e.detail.view !== 'project') return;
      setTimeout(() => document.querySelectorAll('.metric__value').forEach(countUp), 120);
    });
    if (location.hash.indexOf('#/projet/') === 0) {
      setTimeout(() => document.querySelectorAll('.metric__value').forEach(countUp), 200);
    }
  }
})();
