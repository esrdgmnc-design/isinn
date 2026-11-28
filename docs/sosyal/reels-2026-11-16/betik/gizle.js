(()=>{const bad=/₺|komisyon|ücretsiz|Ücretsiz|Fiyat/;
const run=()=>{document.querySelectorAll('body *').forEach(e=>{if(e.children.length===0||[...e.childNodes].some(n=>n.nodeType===3&&bad.test(n.textContent))){if(bad.test(e.textContent)&&e.textContent.length<140){const row=e.closest('tr,dl>div,li')||e;row.style.visibility='hidden';}}});
document.querySelectorAll('button,a').forEach(b=>{const r=b.getBoundingClientRect();if(r.width<90&&r.width>40&&getComputedStyle(b).position==='fixed')b.style.display='none'});
document.querySelectorAll('*').forEach(e=>{const s=getComputedStyle(e);if(s.position==='fixed'&&e.getBoundingClientRect().bottom>innerHeight-200&&e.getBoundingClientRect().width<120)e.style.display='none'});};
run();window.__gizle=run;return 'ok'})()
;(()=>{document.querySelectorAll('h3,h2,p,div').forEach(e=>{if(e.children.length===0&&/\d/.test(e.textContent)&&e.textContent.length<90){const card=e.closest('a[href*="/vitrin/"],[role=button],button.text-left');if(card)card.style.display='none';}});return 1})()
