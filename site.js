// Pàgines del web: capçalera i peu comuns, idioma, entrada amb inèrcia lligada a l'scroll i botons de demo.
(function () {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const outC = (t) => 1 - Math.pow(1 - t, 3);
  const lang = () => (document.documentElement.lang === 'es' ? 'es' : 'ca');
  const L = (ca, es) => (lang() === 'es' ? es : ca);

  const SQ = ['5.5,0 2.75,4.76 7.51,7.51 10.26,2.75', '2.75,4.76 -2.75,4.76 -2.75,10.26 2.75,10.26', '-2.75,4.76 -5.5,0 -10.26,2.75 -7.51,7.51', '-5.5,0 -2.75,-4.76 -7.51,-7.51 -10.26,-2.75', '-2.75,-4.76 2.75,-4.76 2.75,-10.26 -2.75,-10.26', '2.75,-4.76 5.5,0 10.26,-2.75 7.51,-7.51'];
  const TR = ['2.75,4.76 7.51,7.51 2.75,10.26', '-2.75,4.76 -2.75,10.26 -7.51,7.51', '-5.5,0 -10.26,2.75 -10.26,-2.75', '-2.75,-4.76 -7.51,-7.51 -2.75,-10.26', '2.75,-4.76 2.75,-10.26 7.51,-7.51', '5.5,0 10.26,-2.75 10.26,2.75'];
  const HEX = '5.5,0 2.75,4.76 -2.75,4.76 -5.5,0 -2.75,-4.76 2.75,-4.76';
  const logo = (n) => `<svg width="${n}" height="${n}" viewBox="-11.6 -11.6 23.2 23.2" role="img" aria-label="Pauta" style="display:block" stroke="#2A2540" stroke-width="0.4" stroke-linejoin="round">${SQ.map((p) => `<polygon points="${p}" fill="#DCEBFA"/>`).join('')}${TR.map((p) => `<polygon points="${p}" fill="#F9DFE4"/>`).join('')}<polygon points="${HEX}" fill="#FAF0C8"/></svg>`;

  // Capçalera i peu (un sol lloc per mantenir-los)
  const NAV = [['funcions', 'Funcions', 'Funciones'], ['academies', 'Acadèmies', 'Academias'], ['seguretat', 'Seguretat', 'Seguridad'], ['preguntes', 'Preguntes', 'Preguntas']];
  const here = location.pathname.split('/').pop().replace(/\.html$/, '');
  const header = document.createElement('header'); header.className = 'nav';
  header.innerHTML = `<div class="wrap"><a class="brand" href="./" aria-label="Pauta">${logo(30)}Pauta</a>
    <ul id="navlist">${NAV.map(([h, ca, es]) => `<li><a href="${h}" data-es="${es}" ${h === here ? 'aria-current="page"' : ''}>${ca}</a></li>`).join('')}<li class="lang-m"><div class="lang" role="group" aria-label="Idioma"><button data-l="ca" class="on" aria-pressed="true">CA</button><button data-l="es" aria-pressed="false">ES</button></div></li></ul>
    <div class="right"><div class="lang" role="group" aria-label="Idioma"><button data-l="ca" class="on" aria-pressed="true">CA</button><button data-l="es" aria-pressed="false">ES</button></div>
    <a class="btn sec sm login" href="/app" data-es="Entrar">Entra</a><a class="btn prim sm" href="/app?onboarding" data-es="Empieza">Comença</a>
    <button class="menu-btn" aria-label="Menú" aria-expanded="false" aria-controls="navlist"><i></i></button></div></div>`;
  document.body.prepend(header);
  const footer = document.createElement('footer'); footer.className = 'foot';
  footer.innerHTML = `<div class="wrap"><div><a class="brand" href="./" style="font-size:18px">${logo(24)}Pauta</a><p style="margin-top:12px;max-width:300px" data-es="Software de gestión para academias y profesores particulares.">Programari de gestió per a acadèmies i professors particulars.</p></div>
    <div><h4 data-es="Producto">Producte</h4><nav><a href="./" data-es="Cómo funciona">Com funciona</a><a href="funcions" data-es="Funciones">Funcions</a><a href="academies" data-es="Academias">Acadèmies</a></nav></div>
    <div><h4 data-es="Confianza">Confiança</h4><nav><a href="seguretat" data-es="Seguridad y datos">Seguretat i dades</a><a href="preguntes" data-es="Preguntas">Preguntes</a></nav></div>
    <div><h4 data-es="Acceso">Accés</h4><nav><a href="/app" data-es="Entrar">Entra</a><a href="/familia" data-es="Familias">Famílies</a><a href="/app?onboarding" data-es="Crear una cuenta">Crea un compte</a></nav></div></div>`;
  document.body.append(footer);
  const mb = $('.menu-btn'), nl = $('#navlist');
  mb.addEventListener('click', () => { const o = nl.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });

  // Idioma
  const nodes = $$('[data-es]'); nodes.forEach((el) => { el.dataset.ca = el.innerHTML; });
  const titles = { ca: document.title, es: document.body.dataset.titleEs || document.title };
  function setLang(l) {
    document.documentElement.lang = l;
    nodes.forEach((el) => { el.innerHTML = l === 'es' ? el.dataset.es : el.dataset.ca; });
    document.title = titles[l];
    $$('.lang button').forEach((b) => { const on = b.dataset.l === l; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  }
  $$('.lang button').forEach((b) => b.addEventListener('click', () => { try { localStorage.setItem('pauta.lang', b.dataset.l); } catch { /* sense emmagatzematge */ } setLang(b.dataset.l); }));
  try { if (localStorage.getItem('pauta.lang') === 'es') setLang('es'); } catch { /* idem */ }

  // Demos
  $$('[data-demo]').forEach((btn) => btn.addEventListener('click', async () => {
    if (btn.disabled) return;
    const academy = btn.dataset.demo === 'academy', txt = btn.innerHTML;
    btn.disabled = true; btn.style.opacity = '.7'; btn.textContent = academy ? L('Preparant l\'acadèmia…', 'Preparando la academia…') : L('Preparant la demo…', 'Preparando la demo…');
    try {
      const r = await fetch(academy ? '/api/demo/academy' : '/api/demo/start', { method: 'POST', credentials: 'same-origin' });
      if (!r.ok) throw new Error();
      location.assign('/app');
    } catch { btn.disabled = false; btn.style.opacity = ''; btn.innerHTML = txt; alert(L('No s\'ha pogut obrir la demo. Torna-ho a provar.', 'No se ha podido abrir la demo. Vuelve a intentarlo.')); }
  }));

  // Entrada amb inèrcia: el contingut segueix l'scroll amb una mica de retard
  let rvs = [], sy = scrollY, vh = innerHeight;
  const cache = () => { vh = innerHeight; rvs = $$('.rv').map((el) => { const t = el.style.transform; el.style.transform = 'none'; const top = el.getBoundingClientRect().top + scrollY; el.style.transform = t; return { el, top, last: -1 }; }); };
  function frame() {
    sy += (scrollY - sy) * (RM ? 1 : 0.09); if (Math.abs(scrollY - sy) < 0.1) sy = scrollY;
    for (const r of rvs) {
      const top = r.top - sy; if (top > vh * 1.2 || top < -vh * 2) continue;
      const q = RM ? 1 : outC(clamp((vh * 0.95 - top) / (vh * 0.28)));
      if (Math.abs(q - r.last) < 0.002) continue; r.last = q;
      r.el.style.opacity = q.toFixed(3); r.el.style.transform = q >= 0.999 ? 'none' : `translate3d(0, ${((1 - q) * 56).toFixed(1)}px, 0) scale(${(0.975 + 0.025 * q).toFixed(4)})`;
    }
    requestAnimationFrame(frame);
  }
  cache(); addEventListener('resize', cache); addEventListener('load', cache); if (document.fonts?.ready) document.fonts.ready.then(cache);
  requestAnimationFrame(frame);
}());
