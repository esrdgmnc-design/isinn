// ChatGPT (Apps SDK) için vitrin kartı arayüzü. 2026-11-17: kurucu "ChatGPT doğru görsellerle çekmiyor"
// dedi. Sunucu doğru kapak adresini döndürüyordu ama arayüz şablonu olmadığı için görseli ChatGPT kendisi
// seçiyor, bazen kendi aramasından başka resim koyuyordu. Bu şablonla kartları biz çiziyoruz: görsel yalnızca
// aracın döndürdüğü kapak adresinden gelir, fotoğrafı olmayan vitrinde stok resim yerine baş harf gösterilir.
// Metinler textContent ile basılır (vitrin metni HTML olarak yorumlanmaz).
//
// 2026-11-22: kurucu "hâlâ gerçek görselleri çekmiyor" dedi. Veri doğruydu (adresler mutlak, herkese açık, 200),
// ama şablon eski biçimdeydi (text/html+skybridge + openai/widgetCSP). Güncel ChatGPT MCP Apps standardını
// bekliyor: text/html;profile=mcp-app, _meta.ui.resourceUri, resources/read içeriğinde _meta.ui.csp.resourceDomains,
// sonuç postMessage köprüsüyle (ui/notifications/tool-result). Eski anahtarlar uyumluluk için duruyor.
// Şablon değişince URI değişmeli (ChatGPT şablonu URI'ye göre önbelleğe alır).
export const WIDGET_URI = "ui://widget/isinn-vitrinler-v2.html";
export const WIDGET_MIME = "text/html;profile=mcp-app";

const SUPABASE_ORIGIN = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").origin; } catch { return null; }
})();

const RESOURCE_DOMAINS = ["https://www.isinn.com.tr", ...(SUPABASE_ORIGIN ? [SUPABASE_ORIGIN] : [])];

// Araç tanımına konan bağlantı (yeni anahtar + eski takma ad).
export const toolUiMeta = (invoking, invoked) => ({
  ui: { resourceUri: WIDGET_URI },
  "openai/outputTemplate": WIDGET_URI,
  "openai/toolInvocation/invoking": invoking,
  "openai/toolInvocation/invoked": invoked,
});

export const WIDGET_META = {
  ui: { prefersBorder: true, csp: { resourceDomains: RESOURCE_DOMAINS, connectDomains: [] } },
  "openai/widgetDescription": "İşinn vitrinlerini kapak fotoğrafı, başlık, hizmet veren, konum ve fiyatla kart olarak gösterir; her kart vitrin sayfasına bağlanır. Kartlar sonuçları zaten gösterdiği için listeyi metin olarak tekrarlama.",
  "openai/widgetPrefersBorder": true,
  "openai/widgetCSP": {
    connect_domains: [],
    resource_domains: RESOURCE_DOMAINS,
    redirect_domains: ["https://www.isinn.com.tr"],
  },
};

export const WIDGET_HTML = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
:root{--bg:#fff;--card:#fff;--ink:#0F1115;--mut:#6B7280;--line:#E5E7EB;--acc:#2563EB;--ph:#EEF2FF}
@media (prefers-color-scheme:dark){:root{--bg:transparent;--card:#1F2023;--ink:#F3F4F6;--mut:#9CA3AF;--line:#2E3036;--acc:#60A5FA;--ph:#272A33}}
*{box-sizing:border-box}body{margin:0;font:14px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ink);background:var(--bg)}
.row{display:flex;gap:12px;overflow-x:auto;padding:4px 2px 10px;scroll-snap-type:x mandatory}
.card{flex:0 0 220px;scroll-snap-align:start;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;text-align:left;padding:0;color:inherit;font:inherit}
.card.one{flex:1 1 auto;max-width:420px}
.img{width:100%;aspect-ratio:4/3;background:var(--ph);display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;color:var(--acc);overflow:hidden}
.img img{width:100%;height:100%;object-fit:cover;display:block}
.b{padding:10px 12px 12px;display:flex;flex-direction:column;gap:3px;flex:1}
.t{font-weight:700;font-size:15px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.m{color:var(--mut);font-size:12.5px}.p{font-weight:700;margin-top:auto;padding-top:6px}
.d{font-size:13px;color:var(--mut);margin-top:4px}
.go{color:var(--acc);font-size:12.5px;font-weight:600;padding-top:4px}
.empty{color:var(--mut);padding:8px 2px}
.ft{color:var(--mut);font-size:11.5px;padding:0 2px}
.gal{display:flex;gap:6px;overflow-x:auto;padding:0 2px 10px}.gal img{flex:0 0 96px;height:96px;object-fit:cover;border-radius:10px;border:1px solid var(--line)}
</style></head><body><div id="root"></div>
<script>
(function(){
  var root=document.getElementById("root");
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;}
  function open(url){try{if(window.openai&&window.openai.openExternal){window.openai.openExternal({href:url});return;}}catch(e){}window.open(url,"_blank","noopener");}
  function card(v,single){
    var c=el("button","card"+(single?" one":""));c.type="button";
    var im=el("div","img");
    if(v.image&&/^https:\\/\\//.test(v.image)){var i=document.createElement("img");i.src=v.image;i.alt=v.title||"";i.loading="lazy";i.onerror=function(){im.textContent=((v.provider||v.title||"İ").trim()[0]||"İ").toUpperCase();};im.appendChild(i);}
    else im.textContent=((v.provider||v.title||"İ").trim()[0]||"İ").toUpperCase();
    c.appendChild(im);
    var b=el("div","b");
    b.appendChild(el("div","t",v.title||"Vitrin"));
    b.appendChild(el("div","m",[v.provider,v.category].filter(Boolean).join(" · ")));
    if(v.location)b.appendChild(el("div","m",v.location));
    if(single&&v.description)b.appendChild(el("div","d",v.description));
    if(v.price)b.appendChild(el("div","p",v.price));
    b.appendChild(el("div","go","Vitrini aç →"));
    c.appendChild(b);
    c.onclick=function(){if(v.url)open(v.url);};
    return c;
  }
  var latest=null;
  function render(){
    var out=latest||(window.openai&&window.openai.toolOutput)||null;
    root.textContent="";
    if(!out)return;
    var list=out.results||(out.vitrin?[out.vitrin]:[]);
    if(!list.length){root.appendChild(el("div","empty","Bu aramaya uyan vitrin bulunamadı."));return;}
    var row=el("div","row");
    list.forEach(function(v){row.appendChild(card(v,list.length===1));});
    root.appendChild(row);
    var g=(list.length===1&&Array.isArray(list[0].gallery))?list[0].gallery.filter(function(u){return typeof u==="string"&&u.indexOf("https://")===0;}):[];
    if(g.length){var gal=el("div","gal");g.forEach(function(u){var i=document.createElement("img");i.src=u;i.alt="Çalışma örneği";i.loading="lazy";i.onerror=function(){i.remove();};gal.appendChild(i);});root.appendChild(gal);}
    root.appendChild(el("div","ft","Fiyatlar hizmet verenin beyanıdır. İletişim vitrin sayfasındaki mesaj düğmesiyle kurulur."));
  }
  window.addEventListener("openai:set_globals",render,{passive:true});
  // MCP Apps köprüsü: sunucu sonucu ui/notifications/tool-result ile gelir.
  var nextId=1;
  window.addEventListener("message",function(ev){
    if(ev.source!==window.parent)return;var m=ev.data;if(!m||m.jsonrpc!=="2.0")return;
    if(m.method==="ui/notifications/tool-result"&&m.params&&m.params.structuredContent){latest=m.params.structuredContent;render();}
    if(m.id===1&&(m.result||m.error)){try{window.parent.postMessage({jsonrpc:"2.0",method:"ui/notifications/initialized",params:{}},"*");}catch(e){}}
  });
  try{window.parent.postMessage({jsonrpc:"2.0",id:nextId++,method:"ui/initialize",params:{appInfo:{name:"isinn-vitrinler",version:"2"},appCapabilities:{},protocolVersion:"2025-06-18"}},"*");}catch(e){}
  render();
})();
</script></body></html>`;
