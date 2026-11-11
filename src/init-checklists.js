// Behaviour for the "Checklists" group (house rules, arrival guide, our housekeeper checklist).
import { init } from './init.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const I = (n, cls = 'pi32') => `<span class="pi ${cls}"><svg><use href="#pi-${n}"/></svg></span>`;

Object.assign(init, {
  houserules() {
    const R = [
      ['Up to 4 overnight guests', '', 'M8 11a3 3 0 100-6 3 3 0 000 6zM16 11a3 3 0 100-6 3 3 0 000 6zM2 20a6 6 0 0112 0M10 20a6 6 0 0112 0'],
      ['No pets', '', 'M5 9a2 2 0 100-4 2 2 0 000 4zM9 6a2 2 0 100-4 2 2 0 000 4zM15 6a2 2 0 100-4 2 2 0 000 4zM19 9a2 2 0 100-4 2 2 0 000 4zM8 20c-2 0-3-2-2-4l3-4a4 4 0 016 0l3 4c1 2 0 4-2 4zM3 3l18 18'],
      ['No smoking', 'Including vaping and e-cigarettes', 'M3 14h13v4H3zM19 14v4M22 14v4M3 3l18 18'],
      ['No parties or events', '', 'M4 20L9 5l10 10zM14 4l1-2M18 8l2-1M3 3l18 18'],
      ['Lock up at checkout', '', 'M15 7a4 4 0 11-3.8 5.2L4 19.4V21h3v-2h2v-2h2l1.2-1.2A4 4 0 0115 7z'],
    ];
    $('#rules').innerHTML = R.map(([t, s, d]) => `<div class="rrow"><span class="rtile"><svg class="lineico" viewBox="0 0 24 24"><path d="${d}"/></svg></span><div><div class="t-body-md">${t}</div>${s ? `<div class="t-body-sm muted">${s}</div>` : ''}</div></div>`).join('');
  },

  arrival() {
    const S = [
      ['linear-gradient(160deg,#cfd8dc,#8fa3ad 55%,#5d6b72)', 'Find the building', 'The green door next to the bakery, opposite the market entrance.'],
      ['linear-gradient(160deg,#ffe9c7,#e0b27a 55%,#8a5a2b)', 'Open the gate', 'Pull the latch on the left side of the gate upwards.'],
      ['linear-gradient(160deg,#e9e3f6,#a597cf 55%,#4c4378)', 'Get the access card', 'Safe next to reception. Code is in your booking messages.'],
      ['linear-gradient(160deg,#d4eef0,#7cc0c4 55%,#2d6c70)', 'Take the lift to floor 3', 'Apartment 3B is the second door on the right.'],
    ];
    let i = 0;
    const render = () => {
      const [bg, t, d] = S[i];
      $('#arrival').innerHTML = `<div class="ph" style="background:${bg}"><span class="cnt">Step ${i + 1} of ${S.length}</span></div><div class="bd"><div class="t-display-sm">${t}</div><p class="t-body-md muted" style="margin:6px 0 0">${d}</p><div class="dots">${S.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div><div class="nav"><button class="btn btn-tertiary" style="text-decoration:underline;font-size:16px" ${i === 0 ? 'disabled' : ''} id="arPrev">Back</button><button class="btn btn-dark" id="arNext">${i === S.length - 1 ? 'Done' : 'Next'}</button></div></div>`;
      $('#arPrev').onclick = () => { i = Math.max(0, i - 1); render(); };
      $('#arNext').onclick = () => { i = i === S.length - 1 ? 0 : i + 1; render(); };
    };
    render();
  },

  hkchecklist() {
    const L = {
      en: { dir: 'ltr', room: 'Room 204', meta: 'Check-out · Deluxe King', steps: ['Strip bed & change linen', 'Fresh towels ×4', 'Clean bathroom', 'Empty bins', 'Restock minibar', 'Final check & lock'], note: 'Guest request: prayer mat facing Qibla', done: 'Done — ready for inspection', left: n => `${n} left` },
      ar: { dir: 'rtl', room: 'الغرفة 204', meta: 'مغادرة · ديلوكس كينج', steps: ['تغيير أغطية السرير', 'مناشف جديدة ×4', 'تنظيف الحمام', 'تفريغ سلال المهملات', 'إعادة تعبئة الميني بار', 'فحص نهائي وإغلاق'], note: 'طلب الضيف: سجادة صلاة باتجاه القبلة', done: 'تم — جاهزة للفحص', left: n => `متبقي ${n}` },
      tl: { dir: 'ltr', room: 'Kwarto 204', meta: 'Check-out · Deluxe King', steps: ['Palitan ang kobre-kama', 'Bagong tuwalya ×4', 'Linisin ang banyo', 'Itapon ang basura', 'Punan ang minibar', 'Huling tingin at i-lock'], note: 'Hiling ng bisita: prayer mat paharap sa Qibla', done: 'Tapos — handa na sa inspeksyon', left: n => `${n} pa` },
    };
    const ICONS = ['bed', 'towels', 'spray', 'bucket', 'tag', 'key'];
    const PH = ['linear-gradient(160deg,#fffaf1,#e6d8c2 50%,#7fb9b4)', 'linear-gradient(160deg,#fffaf1,#f2d7a6 50%,#c4623d)', 'linear-gradient(160deg,#eef6fb,#b9d6e6 50%,#5f8fa8)', 'linear-gradient(160deg,#f2f2f2,#c9cdd2 50%,#6b7076)', 'linear-gradient(160deg,#fff1f4,#f7b2c3 50%,#b8064f)', 'linear-gradient(160deg,#fff7df,#e0aa38 50%,#7a5a40)'];
    const done = new Set([0, 1, 2]);
    let lang = 'en';
    const render = () => {
      const t = L[lang], n = done.size, all = n === ICONS.length;
      const hk = $('#hk');
      hk.setAttribute('dir', t.dir);
      hk.innerHTML = `<div class="hkhead"><div class="room">${t.room}</div><div class="meta">${I('house', 'pi32')}${t.meta}</div><div class="hkprog"><span>${n} / ${ICONS.length}</span><span class="bar"><i style="width:${n / ICONS.length * 100}%"></i></span><span class="muted" style="font-weight:500">${all ? '✓' : t.left(ICONS.length - n)}</span></div></div>`
        + `<div class="hknote">${I('bubble', 'pi32')}<span>${t.note}</span></div>`
        + `<div class="hklist">${t.steps.map((s, k) => `<div class="hkstep${done.has(k) ? ' done' : ''}" data-k="${k}" role="checkbox" aria-checked="${done.has(k)}" tabindex="0">${I(ICONS[k], 'pi48')}<span class="txt">${s}</span><button class="hkcam" data-k="${k}" aria-label="Reference photo"><svg class="lineico" viewBox="0 0 24 24" style="width:20px;height:20px"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg></button><span class="hkcheck"></span></div>`).join('')}</div>`
        + `<div class="hkfoot"><button class="btn ${all ? 'btn-grad' : 'btn-dark'}" ${all ? '' : 'disabled'}>${t.done}</button></div>`
        + `<div class="hkref" id="hkref"></div>`;
      $$('#hk .hkstep').forEach(r => {
        r.onclick = e => { if (e.target.closest('.hkcam')) return; const k = +r.dataset.k; done.has(k) ? done.delete(k) : done.add(k); render(); };
        r.onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); r.click(); } };
      });
      $$('#hk .hkcam').forEach(b => b.onclick = () => {
        const k = +b.dataset.k, ref = $('#hkref');
        ref.innerHTML = `<div class="sheet2"><div style="width:40px;height:4px;border-radius:2px;background:#c1c1c1;margin:0 auto"></div><div class="ph" style="background:${PH[k]}"></div><div class="row" style="justify-content:space-between">${I(ICONS[k], 'pi48')}<span class="t-title-md" style="flex:1">${t.steps[k]}</span><button class="btn btn-dark" id="hkClose">OK</button></div></div>`;
        ref.classList.add('on');
        $('#hkClose').onclick = () => ref.classList.remove('on');
        ref.onclick = e => { if (e.target === ref) ref.classList.remove('on'); };
      });
    };
    $('#hkLang').onchange = e => { lang = e.target.value; render(); };
    render();
  },
});
