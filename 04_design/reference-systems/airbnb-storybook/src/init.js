// Behaviour for each story, keyed by section id (src/sections/<id>.html).
// Only one story is mounted at a time, so document-level queries are safe.

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const STAR = '<svg class="star" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 21l2-7.5L2 9h7z"/></svg>';
const HEART = '<svg viewBox="0 0 32 32"><path d="M16 28S3 20 3 11a6.5 6.5 0 0113-2 6.5 6.5 0 0113 2c0 9-13 17-13 17z"/></svg>';
const I = (n, cls = 'pi32') => `<span class="pi ${cls}"><svg><use href="#pi-${n}"/></svg></span>`;

/* ---------- data from airbnb.design.md ---------- */
const COLORS = {
  'Brand & accent': [['primary', '#ff385c', 'Rausch — CTA, search orb, saved heart'], ['primary-active', '#e00b41', 'Pressed state'], ['primary-disabled', '#ffd1da', 'Disabled CTA'], ['luxe', '#460479', 'Sub-brand only'], ['plus', '#92174d', 'Sub-brand only']],
  'Text': [['ink', '#222222', 'Headlines, body, stars — never pure black'], ['body', '#3f3f3f', 'Long-form review / amenity copy'], ['muted', '#6a6a6a', 'Sub-labels, inactive tabs'], ['muted-soft', '#929292', 'Disabled links'], ['star-rating', '#222222', 'Stars are ink, not gold'], ['on-primary', '#ffffff', 'Text on Rausch'], ['on-dark', '#ffffff', 'Text on ink']],
  'Surface': [['canvas', '#ffffff', 'Page floor'], ['surface-card', '#ffffff', 'Cards'], ['surface-soft', '#f7f7f7', 'Disabled fields, range lozenge'], ['surface-strong', '#f2f2f2', 'Icon-button fill']],
  'Hairlines & borders': [['hairline', '#dddddd', 'Default 1px border'], ['hairline-soft', '#ebebeb', 'Editorial separators'], ['border-strong', '#c1c1c1', 'Inputs, disabled outlines']],
  'Semantic': [['primary-error-text', '#c13515', 'Form errors'], ['primary-error-text-hover', '#b32505', 'Error link hover'], ['legal-link', '#428bff', 'Legal band links only']],
  'Scrim': [['scrim', '#000000', 'Modal backdrop @ 50%']],
  'Seen on live site (not in file)': [['cta-gradient-start', '#e61e4d', 'Gradient CTA start'], ['cta-gradient-mid', '#e31c5f', 'Gradient CTA middle'], ['cta-gradient-end', '#d70466', 'Gradient CTA end'], ['switch-off-text', '#6c6c6c', 'Unselected segment label']],
};
const TYPE = [
  ['rating-display', '64 / 700 / 1.1 / -1px', '4.81'], ['display-xl', '28 / 700 / 1.43', 'Inspiration for future getaways'], ['display-lg', '22 / 500 / 1.18 / -0.44px', 'Seaside apartment close to the old town'],
  ['display-md', '21 / 700 / 1.43', 'What this place offers'], ['display-sm', '20 / 600 / 1.2 / -0.18px', 'Things to know'], ['title-md', '16 / 600 / 1.25', 'Lisbon'], ['title-sm', '16 / 500 / 1.25', 'Support'],
  ['body-md', '16 / 400 / 1.5', 'A calm, light-filled flat with a balcony over the river.'], ['body-sm', '14 / 400 / 1.43', '2 km away · Nov 16 – 21'], ['caption', '14 / 500 / 1.29', 'Where'],
  ['caption-sm', '13 / 400 / 1.23', '© 2026 Company, Inc.'], ['badge', '11 / 600 / 1.18', 'Guest favorite'], ['micro-label', '12 / 700 / 1.33', 'Inline 6'], ['uppercase-tag', '8 / 700 / 1.25 / 0.32px', 'New'],
  ['button-md', '16 / 500 / 1.25', 'Reserve'], ['button-sm', '14 / 500 / 1.29', 'Become a host'], ['link', '14 / 400 / 1.43', 'Show more'], ['nav-link', '16 / 600 / 1.25', 'Homes'],
];
const SPACE = [['xxs', 2], ['xs', 4], ['sm', 8], ['md', 12], ['base', 16], ['lg', 24], ['xl', 32], ['xxl', 48], ['section', 64]];
const RADIUS = [['none', '0px'], ['xs', '4px'], ['sm', '8px'], ['md', '14px'], ['lg', '20px'], ['xl', '32px'], ['full', '9999px']];
const PHOTOS = ['linear-gradient(160deg,#9cc9e6,#3f7fa8 55%,#e8d3a8 56%,#d8bd88)', 'linear-gradient(160deg,#f6d1b0,#d98e6a 50%,#5f3d33)', 'linear-gradient(160deg,#c9e3c2,#6aa36b 50%,#2f5d3b)', 'linear-gradient(160deg,#e9e3f6,#9b8fc9 50%,#3d3466)', 'linear-gradient(160deg,#ffe9b8,#f2b35b 50%,#8a5626)', 'linear-gradient(160deg,#d4eef0,#62b3b8 50%,#265f63)', 'linear-gradient(160deg,#f3d5d9,#c97a86 50%,#5c2d36)', 'linear-gradient(160deg,#e6e6e6,#a5a5a5 50%,#4a4a4a)'];

// heart toggle works in every card story
if (!window.__heartBound) {
  window.__heartBound = true;
  document.addEventListener('click', e => { const h = e.target.closest('.heart'); if (h) { h.classList.toggle('saved'); e.stopPropagation(); } });
}

export const init = {
  colors() {
    $('#colorGroups').innerHTML = Object.entries(COLORS).map(([g, list]) => `<h2>${g}</h2><div class="swatches">${list.map(([n, h, u]) => `<div class="sw" data-hex="${h}" title="Copy ${h}"><div class="chip" style="background:${h}"></div><div class="meta"><b>${n}</b><span>${h}</span><br><span>${u}</span></div></div>`).join('')}</div>`).join('');
    $$('.sw').forEach(s => s.onclick = () => { try { navigator.clipboard.writeText(s.dataset.hex); } catch (e) {} const b = s.querySelector('b'); const o = b.textContent; b.textContent = 'Copied ' + s.dataset.hex; setTimeout(() => b.textContent = o, 900); });
  },

  typography() {
    const render = () => { const v = $('#typeSample').value; $('#typeList').innerHTML = TYPE.map(([t, spec, s]) => `<div class="typerow"><span class="tok">${t}</span><span class="t-${t}">${v ? v.replace(/</g, '&lt;') : s}</span><span class="spec">${spec}</span></div>`).join(''); };
    $('#typeSample').oninput = render; render();
  },

  spacing() { $('#spaceList').innerHTML = SPACE.map(([n, v]) => `<div class="spacebar"><span class="lbl"><code>${n}</code> ${v}px</span><span class="bar" style="width:${v * 4}px"></span></div>`).join(''); },
  radius() { $('#radiusList').innerHTML = RADIUS.map(([n, v]) => `<div class="r" style="border-radius:${n === 'full' ? '60px' : v}"><code>${n}</code>&nbsp;${v}</div>`).join(''); },

  buttons() {
    const render = () => { const b = $('#btnLive'); b.className = 'btn ' + $('#btnVariant').value + ' ' + $('#btnState').value + ($('#btnFull').checked ? ' full' : ''); b.disabled = $('#btnState').value === 'is-disabled'; b.textContent = $('#btnLabel').value || 'Button'; };
    ['#btnVariant', '#btnState', '#btnLabel', '#btnFull'].forEach(s => $(s).oninput = render);
  },

  topnav() { $$('#ptabs .ptab').forEach(t => t.onclick = () => { $$('#ptabs .ptab').forEach(x => x.classList.remove('on')); t.classList.add('on'); }); },

  category() {
    const CATS = [['Beachfront', 'M2 18c3 0 3-2 6-2s3 2 6 2 3-2 6-2M4 14l8-10 8 10'], ['Cabins', 'M3 21V10l9-7 9 7v11H3zM9 21v-6h6v6'], ['Countryside', 'M3 20l6-9 4 5 3-4 5 8z'], ['Iconic cities', 'M4 21V8h5v13M9 21V3h6v18M15 21V11h5v10'], ['Amazing pools', 'M2 17c2 0 2 1.5 4 1.5S8 17 10 17s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5M7 14V4h3M14 14V4h3M7 8h10'], ['Design', 'M4 20h16M6 20V9l6-5 6 5v11'], ['Islands', 'M2 19c3-2 17-2 20 0M12 17V7M12 7c-3-3-6-2-7 0M12 7c3-3 6-2 7 0'], ['Trending', 'M3 17l6-6 4 4 8-8M15 7h6v6']];
    $('#cats').innerHTML = CATS.map(([n, d], i) => `<button class="cat${i ? '' : ' on'}"><svg class="ico" viewBox="0 0 24 24"><path d="${d}"/></svg>${n}</button>`).join('');
    $$('#cats .cat').forEach(c => c.onclick = () => { $$('#cats .cat').forEach(x => x.classList.remove('on')); c.classList.add('on'); });
  },

  property() {
    const PLACES = [['Lisbon, Portugal', '4.92', '2,140 km away', 'Nov 16 – 21', '$128', 1], ['Kyoto, Japan', '4.88', 'Hosted by Aiko', 'Dec 2 – 7', '$164', 0], ['Marrakech, Morocco', '4.97', 'Riad · 3 beds', 'Jan 4 – 9', '$96', 1], ['Cape Town, South Africa', '4.85', 'Ocean view', 'Nov 28 – Dec 3', '$141', 0]];
    $('#cards').innerHTML = PLACES.map(([t, r, d, dt, p, fav], i) => `<div class="pcard"><div class="photo"><div class="img" style="background:${PHOTOS[i]}"></div>${fav ? '<span class="fav">Guest favorite</span>' : ''}<button class="heart${i === 2 ? ' saved' : ''}" aria-label="Save">${HEART}</button><div class="dots"><i></i><i></i><i></i><i></i><i></i></div></div><div class="pmeta"><div class="top"><span class="t-title-md" style="font-size:15px">${t}</span><span>${STAR} ${r}</span></div><div class="muted">${d}</div><div class="muted">${dt}</div><div class="price"><b>${p}</b> night</div></div></div>`).join('');
  },

  experience() {
    const XP = [['Pottery with a local master', '$45 / guest'], ['Sunrise desert walk', '$60 / guest'], ['Street-food night tour', '$38 / guest'], ['Rooftop jazz evening', '$52 / guest']];
    $('#xcards').innerHTML = XP.map(([t, p], i) => `<div class="pcard xcard"><div class="photo"><div class="img" style="background:${PHOTOS[i + 4]}"></div><span class="fav t-uppercase-tag" style="font-size:8px;padding:2px 6px">New</span><button class="heart" aria-label="Save">${HEART}</button></div><div class="pmeta"><div class="t-title-md">${t}</div><div class="muted">From ${p}</div></div></div>`).join('');
  },

  rating() { $('#ratingRange').oninput = e => $('#ratingNum').textContent = (e.target.value / 10).toFixed(1); },

  amenities() {
    const AM = [['Kitchen', 'M4 3v8a3 3 0 006 0V3M7 3v18M17 3c-2 0-3 3-3 7h3v11'], ['Wifi', 'M2 9a15 15 0 0120 0M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 19.5h.01'], ['Free parking', 'M5 21V3h7a5 5 0 010 10H5'], ['Washer', 'M4 2h16v20H4zM4 7h16M12 11a4 4 0 100 8 4 4 0 000-8'], ['Air conditioning', 'M12 2v20M4 6l16 12M20 6L4 18'], ['Dedicated workspace', 'M3 10h18M5 10v10M19 10v10M8 6h8v4H8z'], ['Pool', 'M2 17c2 0 2 1.5 4 1.5S8 17 10 17s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5M7 14V4h3M14 14V4h3'], ['Carbon monoxide alarm', 'M12 3a9 9 0 100 18 9 9 0 000-18M12 8v5M12 16h.01', 1]];
    $('#amen').innerHTML = AM.map(([n, d, off]) => `<div class="a${off ? ' off' : ''}"><svg class="ico" viewBox="0 0 24 24"><path d="${d}"/></svg>${n}</div>`).join('');
  },

  reviews() {
    const RV = [['Lena', '#7a5c99', 'Berlin, Germany', 'October 2026', 'Spotless, quiet and exactly like the photos. The host left a handwritten guide to the neighbourhood with the best bakeries and a lovely walk along the river that we did every morning before breakfast.'], ['Omar', '#2f6f73', 'Cairo, Egypt', 'October 2026', 'Great location and very responsive host. Check-in was simple with the lockbox and the instructions were clear in both English and Arabic, which my parents really appreciated.'], ['Yuki', '#a45f3c', 'Osaka, Japan', 'September 2026', 'Beautiful light in the mornings. Bed was very comfortable. The kitchen had everything we needed to cook, and the balcony was perfect for evening tea.'], ['Carlos', '#4c6b2f', 'Bogotá, Colombia', 'September 2026', 'Would stay again. Street can be a little noisy on weekends but the windows block most of it. Host was flexible with our late arrival.']];
    $('#reviews').innerHTML = RV.map(([n, c, f, d, t]) => `<div class="rv"><div class="who"><div class="avatar" style="background:${c}">${n[0]}</div><div><div class="t-title-md">${n}</div><div class="t-body-sm muted">${f}</div></div></div><div class="t-caption-sm" style="margin-bottom:6px">${STAR}${STAR}${STAR}${STAR}${STAR} · ${d}</div><p>${t}</p><button class="btn btn-tertiary t-title-md" style="text-decoration:underline;font-size:14px;font-weight:600">Show more</button></div>`).join('');
    $$('#reviews .rv .btn').forEach(b => b.onclick = () => { const r = b.parentElement; r.classList.toggle('open'); b.textContent = r.classList.contains('open') ? 'Show less' : 'Show more'; });
  },

  reservation() {
    let guests = 2; const NIGHT = 128, N = 5;
    const render = () => { $('#gcount').textContent = guests + (guests === 1 ? ' guest' : ' guests'); $('#gminus').disabled = guests <= 1; $('#gplus').disabled = guests >= 6; const base = NIGHT * N, clean = 45, svc = Math.round(base * .14) + (guests > 2 ? (guests - 2) * 10 : 0); $('#fees').innerHTML = `<div class="ln"><span>$${NIGHT} × ${N} nights</span><span>$${base}</span></div><div class="ln"><span>Cleaning fee</span><span>$${clean}</span></div><div class="ln"><span>Service fee</span><span>$${svc}</span></div><div class="tot"><span>Total before taxes</span><span>$${base + clean + svc}</span></div>`; };
    $('#gminus').onclick = () => { guests--; render(); }; $('#gplus').onclick = () => { guests++; render(); }; render();
  },

  datepicker() {
    let rs = 16, re = 21; const TODAY = 11;
    const render = () => {
      const first = new Date(2026, 10, 1).getDay(), days = 30;
      let h = '<div class="hd"><button class="icon-circle" aria-label="Previous" style="background:transparent"><svg class="ico" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button><b>November 2026</b><button class="icon-circle" aria-label="Next" style="background:transparent"><svg class="ico" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button></div><div class="gridd">';
      h += 'SMTWTFS'.split('').map(d => `<div class="dow">${d}</div>`).join(''); for (let i = 0; i < first; i++) h += '<div></div>';
      for (let d = 1; d <= days; d++) { let c = 'day', w = 'cellwrap'; if (d < TODAY) c += ' past'; if (d === rs || d === re) c += ' sel'; if (rs && re && d > rs && d < re) c += ' inrange'; if (rs && re && rs !== re) { if (d === rs) w += ' rs'; if (d === re) w += ' re'; } h += `<div class="${w}"><button class="${c}" data-d="${d}">${d}</button></div>`; }
      $('#dp').innerHTML = h + '</div>'; $('#dpOut').textContent = rs ? (re ? `Nov ${rs} – Nov ${re} · ${re - rs} nights` : `Check-in Nov ${rs} — pick checkout`) : 'Select check-in date';
      $$('#dp .day').forEach(b => b.onclick = () => { const d = +b.dataset.d; if (d < TODAY) return; if (!rs || re) { rs = d; re = null; } else if (d <= rs) { rs = d; } else re = d; render(); });
    };
    $('#dpClear').onclick = () => { rs = re = null; render(); }; render();
  },

  inputs() { $('#email').oninput = e => $('#emailField').classList.toggle('err', !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.target.value)); },

  citygrid() {
    const CT = [['Lisbon', 'Apartment rentals'], ['Kyoto', 'Ryokan stays'], ['Marrakech', 'Riad rentals'], ['Cape Town', 'Villa rentals'], ['Istanbul', 'Flat rentals'], ['Mexico City', 'Loft rentals'], ['Bali', 'Villa rentals'], ['Athens', 'Cottage rentals'], ['Dubai', 'Condo rentals'], ['Paris', 'Studio rentals'], ['Cairo', 'Apartment rentals'], ['Seoul', 'Hanok stays']];
    $('#cities').innerHTML = CT.map(([c, s]) => `<div class="city"><b>${c}</b><span>${s}</span></div>`).join('');
  },

  /* ===================== live-site study ===================== */
  photoicons() {
    $$('#pinav button').forEach(b => b.onclick = () => { $$('#pinav button').forEach(x => x.classList.remove('on')); void b.offsetWidth; b.classList.add('on'); });
    const PIS = [['bed', 'Bed / make bed'], ['towels', 'Towels & linen'], ['bucket', 'Bucket / supplies'], ['spray', 'Cleaning spray'], ['cart', 'Housekeeping cart'], ['house', 'Room / home'], ['door', 'Check-in / door'], ['key', 'Key / access'], ['clip', 'Checklist'], ['cal', 'Schedule'], ['shield', 'Safety'], ['bubble', 'Message / request'], ['bell', 'Service bell'], ['tag', 'Price / minibar']];
    $('#pigrid').innerHTML = PIS.map(([n, l]) => `<div class="picell">${I(n, 'pi64')}<span>${l}</span></div>`).join('');
  },

  announce() {
    const replay = () => { const t = $('#toast'); t.classList.remove('in'); void t.offsetWidth; t.classList.add('in'); };
    $('#toastBtn').onclick = replay; $('#annBtn').onclick = replay;
  },

  searchx() {
    $$('#sx .seg').forEach(s => s.onclick = () => { $$('#sx .seg').forEach(x => x.classList.remove('act')); s.classList.add('act'); });
    const G = [['Adults', 'Ages 13 or above', 2], ['Children', 'Ages 2–12', 0], ['Infants', 'Under 2', 0], ['Pets', '<a>Bringing a service animal?</a>', 0]];
    const render = () => {
      $('#guests').innerHTML = G.map((g, i) => `<div class="prow"><div><b>${g[0]}</b><small>${g[1]}</small></div><div class="step2"><button data-i="${i}" data-d="-1" ${g[2] === 0 ? 'disabled' : ''} aria-label="Fewer">−</button><output>${g[2]}</output><button data-i="${i}" data-d="1" ${g[2] >= 8 ? 'disabled' : ''} aria-label="More">+</button></div></div>`).join('');
      $$('#guests button').forEach(b => b.onclick = () => { G[b.dataset.i][2] += +b.dataset.d; render(); const n = G[0][2] + G[1][2]; $('#sx .seg:nth-child(3) .p').textContent = n ? `${n} guest${n > 1 ? 's' : ''}` : 'Add guests'; });
    };
    render();
  },

  chips() {
    const QF = ['Instant Book', 'Washer', 'Kitchen', 'Self check-in', 'Air conditioning', 'Allows pets', 'Free parking', 'Wifi']; const qsel = new Set(['Washer']);
    const render = () => {
      $('#chips').innerHTML = `<button class="chip"><svg class="ico" viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>Filters${qsel.size ? `<span class="count">${qsel.size}</span>` : ''}</button><span class="vdiv"></span>` + QF.map(f => `<button class="chip${qsel.has(f) ? ' on' : ''}" data-f="${f}">${f}</button>`).join('');
      $$('#chips .chip[data-f]').forEach(c => c.onclick = () => { qsel.has(c.dataset.f) ? qsel.delete(c.dataset.f) : qsel.add(c.dataset.f); render(); });
    };
    render();
    const LG = [['Air conditioning', 'M12 2v20M4 6l16 12M20 6L4 18'], ['Free parking', 'M7 21V3h6a5 5 0 010 10H7'], ['Wifi', 'M2 9a15 15 0 0120 0M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 19.5h.01'], ['Kitchen', 'M4 3v8a3 3 0 006 0V3M7 3v18M17 3c-2 0-3 3-3 7h3v11'], ['Washer', 'M4 2h16v20H4zM4 7h16M12 11a4 4 0 100 8 4 4 0 000-8']];
    $('#chipsLg').innerHTML = LG.map(([n, d], i) => `<button class="chip chip-lg${i === 4 ? ' on' : ''}"><svg class="ico" viewBox="0 0 24 24" style="width:20px;height:20px"><path d="${d}"/></svg>${n}</button>`).join('');
    $$('#chipsLg .chip').forEach(c => c.onclick = () => c.classList.toggle('on'));
  },

  filters() {
    let count = 1000; const upd = () => { $('#showN').textContent = count >= 1000 ? 'Show 1,000+ places' : `Show ${count} places`; };
    const bump = d => { count = Math.max(12, Math.min(1000, count + d)); upd(); };
    $('#tiles').innerHTML = ['Instant Book', 'Washer', 'Kitchen', 'Self check-in'].map((l, i) => `<button class="tile${i === 1 ? ' on' : ''}">${I(['key', 'bucket', 'bell', 'door'][i], 'pi32')}${l}</button>`).join('');
    $$('#tiles .tile').forEach(t => t.onclick = () => { t.classList.toggle('on'); bump(t.classList.contains('on') ? -140 : 140); });
    $$('#segc button').forEach(b => b.onclick = () => { $$('#segc button').forEach(x => x.classList.remove('on')); b.classList.add('on'); bump(b.textContent === 'Any' ? 400 : -180); });
    const HB = [2, 3, 5, 4, 7, 9, 12, 15, 19, 23, 28, 33, 38, 41, 44, 46, 45, 43, 40, 36, 32, 29, 25, 22, 19, 17, 15, 13, 11, 10, 9, 8, 7, 6, 6, 5, 4, 4, 3, 3];
    $('#hist').innerHTML = HB.map(h => `<i style="height:${h / 46 * 100}%"></i>`).join('');
    let r0 = .08, r1 = 1;
    const drawRange = () => {
      const nightly = $('#sw').dataset.v === '1', max = nightly ? 320 : 1600;
      $('#th0').style.left = r0 * 100 + '%'; $('#th1').style.left = r1 * 100 + '%'; $('#rfill').style.left = r0 * 100 + '%'; $('#rfill').style.width = (r1 - r0) * 100 + '%';
      $$('#hist i').forEach((b, i) => b.classList.toggle('out', (i + .5) / HB.length < r0 || (i + .5) / HB.length > r1));
      $('#pmin').textContent = '$' + Math.round(r0 * max); $('#pmax').textContent = r1 >= .999 ? '$' + max + '+' : '$' + Math.round(r1 * max);
    };
    $$('#sw button').forEach((b, i) => b.onclick = () => { $('#sw').dataset.v = i; $$('#sw button').forEach(x => x.classList.remove('on')); b.classList.add('on'); drawRange(); });
    const dragTh = (el, which) => {
      el.onpointerdown = e => { el.setPointerCapture(e.pointerId); const R = $('#range').getBoundingClientRect(); el.onpointermove = m => { const v = Math.max(0, Math.min(1, (m.clientX - R.left) / R.width)); if (which === 0) r0 = Math.min(v, r1 - .05); else r1 = Math.max(v, r0 + .05); drawRange(); }; el.onpointerup = () => { el.onpointermove = null; count = Math.round(1000 * (r1 - r0)); upd(); }; };
      el.onkeydown = k => { const s = k.key === 'ArrowRight' ? .02 : k.key === 'ArrowLeft' ? -.02 : 0; if (!s) return; if (which === 0) r0 = Math.max(0, Math.min(r0 + s, r1 - .05)); else r1 = Math.min(1, Math.max(r1 + s, r0 + .05)); drawRange(); k.preventDefault(); };
    };
    dragTh($('#th0'), 0); dragTh($('#th1'), 1); drawRange();
    const RM = [['Bedrooms', 0], ['Beds', 0], ['Bathrooms', 0]];
    const renderRooms = () => {
      $('#rooms').innerHTML = RM.map((r, i) => `<div class="srow"><span>${r[0]}</span><div class="step2 step3"><button data-i="${i}" data-d="-1" ${r[1] === 0 ? 'disabled' : ''} aria-label="Decrease">−</button><output style="min-width:36px">${r[1] ? r[1] + '+' : 'Any'}</output><button data-i="${i}" data-d="1" ${r[1] >= 8 ? 'disabled' : ''} aria-label="Increase">+</button></div></div>`).join('');
      $$('#rooms button').forEach(b => b.onclick = () => { RM[b.dataset.i][1] += +b.dataset.d; bump(+b.dataset.d * -90); renderRooms(); });
    };
    renderRooms();
    $('#selcards').innerHTML = [['shield', 'Guest favorite', 'The most loved homes'], ['key', 'Luxe', 'Luxury homes with elevated design']].map(([ic, t, d]) => `<button class="selcard">${I(ic, 'pi32')}<div><b>${t}</b><span>${d}</span></div></button>`).join('');
    $$('#selcards .selcard').forEach(c => c.onclick = () => { c.classList.toggle('on'); bump(c.classList.contains('on') ? -300 : 300); });
    $$('.tswitch').forEach(s => s.onclick = () => { const on = s.getAttribute('aria-checked') !== 'true'; s.setAttribute('aria-checked', on); bump(on ? -120 : 120); });
    $('#more').onclick = e => { const b = e.currentTarget, open = b.dataset.open !== '1'; b.dataset.open = open ? '1' : '0'; b.firstChild.textContent = open ? 'Show less ' : 'Show more '; b.querySelector('svg').style.transform = open ? 'rotate(180deg)' : ''; };
    $('#clearAll').onclick = () => { count = 1000; upd(); r0 = 0; r1 = 1; drawRange(); RM.forEach(r => r[1] = 0); renderRooms(); $$('#tiles .tile,#selcards .selcard').forEach(x => x.classList.remove('on')); $$('.tswitch').forEach(s => s.setAttribute('aria-checked', 'false')); $$('#segc button').forEach((x, i) => x.classList.toggle('on', i === 0)); };
  },

  map() {
    const PINS = [[18, 30, '$128'], [34, 52, '$96'], [48, 28, '$141'], [58, 62, '$210'], [70, 40, '$88'], [40, 76, '$175'], [24, 64, '$119'], [78, 70, '$132', 1]];
    $('#map').insertAdjacentHTML('afterbegin', PINS.map(([x, y, p, h]) => `<button class="ppin" style="left:${x}%;top:${y}%">${h ? I('bell', 'pi') : ''}${p}</button>`).join(''));
    $$('#map .ppin').forEach(p => p.onclick = () => { $$('#map .ppin.on').forEach(o => { o.classList.remove('on'); o.classList.add('seen'); }); p.classList.add('on'); });
  },

  carousel() {
    const CR = [['Apartment in Alfama', '$412 for 2 nights · ★ 4.97', 1], ['Loft in Chiado', '$388 for 2 nights · ★ 4.91', 0], ['Room in Belém', '$156 for 2 nights · ★ 4.88', 1], ['Flat in Graça', '$298 for 2 nights · ★ 5.0', 1], ['Home in Estrela', '$520 for 2 nights · ★ 4.93', 0], ['Studio in Baixa', '$244 for 2 nights · ★ 4.86', 1], ['Villa in Restelo', '$690 for 2 nights · ★ 4.95', 0], ['Room in Lapa', '$140 for 2 nights · ★ 4.9', 1]];
    $('#crail').innerHTML = CR.map(([t, s, f], i) => `<div class="mini"><div class="ph" style="background:${PHOTOS[i % 8]}">${f ? '<span class="fav">Guest favorite</span>' : ''}<button class="heart" aria-label="Save" style="position:absolute;top:8px;right:8px;width:32px;height:32px;background:none;border:0;cursor:pointer"><svg viewBox="0 0 32 32" style="width:22px;height:22px;fill:rgba(0,0,0,.5);stroke:#fff;stroke-width:2"><path d="M16 28S3 20 3 11a6.5 6.5 0 0113-2 6.5 6.5 0 0113 2c0 9-13 17-13 17z"/></svg></button></div><p><b style="font-weight:500">${t}</b><br><span class="muted">${s}</span></p></div>`).join('');
    let cpos = 0; const crs = d => { const rail = $('#crail'), w = rail.clientWidth + 12; cpos = Math.max(0, Math.min(cpos + d, 1)); rail.scrollLeft = cpos * w; $('#cprev').disabled = cpos === 0; $('#cnext').disabled = cpos === 1; };
    $('#cprev').onclick = () => crs(-1); $('#cnext').onclick = () => crs(1);
  },

  listingx() { $$('#anchors a').forEach(a => a.onclick = e => { e.preventDefault(); $$('#anchors a').forEach(x => x.classList.remove('on')); a.classList.add('on'); }); },

  ratingx() {
    const RB = [['Cleanliness', '5.0', 'M7 21h10l-1-9H8zM9 12V8h6v4M10 8V4h4'], ['Accuracy', '5.0', 'M12 3a9 9 0 100 18 9 9 0 000-18M8 12l3 3 5-6'], ['Check-in', '5.0', 'M15 7a4 4 0 11-3.8 5.2L4 19.4V21h3v-2h2v-2h2l1.2-1.2A4 4 0 0115 7z'], ['Communication', '5.0', 'M4 5h16v11H9l-5 4z'], ['Location', '4.9', 'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15'], ['Value', '4.9', 'M3 12l9-9h8v8l-9 9zM16 8h.01']];
    $('#rbreak').innerHTML = `<div><b>Overall rating</b><div class="bars">${[[5, 96], [4, 4], [3, 0], [2, 0], [1, 0]].map(([n, w]) => `<div>${n}<i style="--w:${w}%"></i></div>`).join('')}</div></div>` + RB.map(([n, s, d]) => `<div><b>${n}</b><span style="font-weight:600">${s}</span><svg viewBox="0 0 24 24"><path d="${d}"/></svg></div>`).join('');
  },

  calx() {
    const month = (y, m, name, blocked) => {
      const f = new Date(y, m, 1).getDay(), n = new Date(y, m + 1, 0).getDate();
      let h = `<div><div class="mh">${m === 10 ? '<button class="icon-circle" style="background:none" disabled aria-label="Previous"><svg class="ico" viewBox="0 0 24 24" style="color:#c1c1c1"><path d="M15 18l-6-6 6-6"/></svg></button>' : '<span></span>'}<span>${name}</span>${m === 11 ? '<button class="icon-circle" style="background:none" aria-label="Next"><svg class="ico" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>' : '<span></span>'}</div><div class="g">` + 'SMTWTFS'.split('').map(d => `<span>${d}</span>`).join('');
      for (let i = 0; i < f; i++) h += '<span></span>';
      for (let d = 1; d <= n; d++) { const na = blocked(d); h += `<button class="${na ? 'na' : ''}" ${na ? 'disabled' : ''}>${d}</button>`; }
      return h + '</div></div>';
    };
    $('#cal2').innerHTML = month(2026, 10, 'November 2026', d => d < 15 || [21, 22, 23, 24, 25, 29, 30].includes(d)) + month(2026, 11, 'December 2026', d => [1, 26, 29, 30, 31].includes(d));
    $$('#cal2 button:not(.na):not(.icon-circle)').forEach(b => b.onclick = () => { $$('#cal2 .sel').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); });
  },

  translate() {
    let orig = false;
    $('#trToggle').onclick = () => {
      orig = !orig;
      $('#trTitle').textContent = orig ? 'Apartamento boutique junto ao rio' : 'Boutique apartment by the river';
      $('#trBody').textContent = orig ? 'Fique num edifício icónico, em frente ao mercado e a poucos passos do rio.' : 'Stay in an iconic building, opposite the market and just a few steps from the river.';
      $('#trMsg').textContent = orig ? 'You are viewing the original (Portuguese).' : 'Some info has been automatically translated.';
      $('#trToggle').textContent = orig ? 'Translate to English' : 'Show original';
    };
  },

  skeleton() { $('#skelCards').innerHTML = Array(4).fill('<div><div class="skel" style="aspect-ratio:1/1;border-radius:14px"></div><div class="skel" style="height:12px;width:70%;margin-top:12px"></div><div class="skel" style="height:12px;width:45%;margin-top:8px"></div></div>').join(''); },

  app() {
    const TB = [['Explore', 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4'], ['Wishlists', 'M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11z'], ['Trips', 'M4 20V8l8-5 8 5v12zM9 20v-6h6v6'], ['Inbox', 'M4 5h16v11H9l-5 4z'], ['Profile', 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0']];
    $('#tabbar').innerHTML = TB.map(([n, d], i) => `<button class="${i ? '' : 'on'}"><svg viewBox="0 0 24 24"><path d="${d}"/></svg>${n}</button>`).join('');
    $$('#tabbar button').forEach(b => b.onclick = () => { $$('#tabbar button').forEach(x => x.classList.remove('on')); b.classList.add('on'); });
    const SN = [150, 300, 440]; let si = 1;
    $('#sheet').onclick = e => { if (!e.target.closest('.grab,.c')) return; si = (si + 1) % 3; $('#sheet').style.top = SN[si] + 'px'; };
  },
};
