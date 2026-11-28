// Yerel önizleme için küçük çalıştırıcı: .dc.html ekranlarını claude.ai olmadan gösterir.
(function () {
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(s) { Object.assign(this.state, s); window.__dcRender(); }
    forceUpdate() { window.__dcRender(); }
  }
  function resolve(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
  }
  const WHOLE = /^\s*\{\{([^}]+)\}\}\s*$/;
  const ANY = /\{\{([^}]+)\}\}/g;
  function interp(str, scope) {
    return str.replace(ANY, (_, p) => { const v = resolve(p, scope); return v == null ? '' : String(v); });
  }
  function build(node, scope, out) {
    if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    if (tag === 'helmet') return;
    if (tag === 'sc-for') {
      const list = resolve(node.getAttribute('list').replace(/[{}]/g, ''), scope) || [];
      const as = node.getAttribute('as') || 'item';
      list.forEach((item, i) => {
        const s = Object.assign({}, scope, { [as]: item, $index: i });
        node.childNodes.forEach((c) => build(c, s, out));
      });
      return;
    }
    if (tag === 'sc-if') {
      if (resolve(node.getAttribute('value').replace(/[{}]/g, ''), scope)) node.childNodes.forEach((c) => build(c, scope, out));
      return;
    }
    const el = document.createElementNS(node.namespaceURI, node.localName);
    for (const a of Array.from(node.attributes)) {
      if (a.name.startsWith('hint-')) continue;
      const m = a.value.match(WHOLE);
      if (m && a.name.startsWith('on')) {
        const fn = resolve(m[1], scope);
        if (typeof fn === 'function') el.addEventListener(a.name.slice(2).toLowerCase(), fn);
        continue;
      }
      let v = interp(a.value, scope);
      if ((a.name === 'src' || a.name === 'href') && v.startsWith('/_blob/')) v = 'ayora-figur-mavi.png';
      el.setAttribute(a.name, v);
    }
    const src = tag === 'template' ? node.content : node;
    src.childNodes.forEach((c) => build(c, scope, el));
    out.appendChild(el);
  }
  document.addEventListener('DOMContentLoaded', () => {
    const x = document.querySelector('x-dc');
    const helmet = x.querySelector('helmet');
    if (helmet) Array.from(helmet.children).forEach((c) => document.head.appendChild(c.cloneNode(true)));
    const tpl = x.cloneNode(true);
    x.remove();
    const code = document.querySelector('script[data-dc-script]').textContent;
    const Component = new Function('DCLogic', code + '\nreturn Component;')(DCLogic);
    const inst = new Component({});
    if (!inst.state) inst.state = {};
    const root = document.createElement('div');
    document.body.prepend(root);
    window.__dcRender = () => {
      const frag = document.createDocumentFragment();
      const vals = inst.renderVals();
      tpl.childNodes.forEach((c) => build(c, vals, frag));
      root.replaceChildren(frag);
    };
    window.__dcRender();
  });
})();
