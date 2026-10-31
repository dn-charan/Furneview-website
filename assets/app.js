/* Furneview storefront: shared layout, Shopify Storefront API client, cart, and page renderers */
(function () {
  const CFG = window.FURNEVIEW || {};
  const LIVE = !!(CFG.storefrontToken && CFG.shopDomain);
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const inr = (n) => "₹" + Math.round(Number(n)).toLocaleString("en-IN");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  /* ---------- illustrations ---------- */
  const W = "#8A5A34", WD = "#6b4a2b", S = "#E2D3BB", SS = "#EBDFCB", L = "#1F6B3B", O = "#F25A0B";
  const ART = {
    sofa: (c = S) => `<svg viewBox="0 0 200 130" aria-hidden="true"><rect x="22" y="44" width="156" height="44" rx="14" fill="${c}" opacity=".85"/><rect x="18" y="70" width="164" height="34" rx="12" fill="${c}"/><rect x="10" y="62" width="26" height="48" rx="10" fill="${c}" opacity=".9"/><rect x="164" y="62" width="26" height="48" rx="10" fill="${c}" opacity=".9"/><rect x="40" y="52" width="34" height="24" rx="7" fill="${O}"/><rect x="24" y="110" width="5" height="12" fill="${WD}"/><rect x="171" y="110" width="5" height="12" fill="${WD}"/></svg>`,
    bed: (c = S) => `<svg viewBox="0 0 200 130" aria-hidden="true"><rect x="20" y="22" width="40" height="86" rx="6" fill="${W}"/><rect x="30" y="66" width="160" height="30" rx="6" fill="${W}"/><rect x="36" y="56" width="150" height="16" rx="5" fill="#fff" stroke="${SS}" stroke-width="2"/><rect x="40" y="44" width="34" height="16" rx="6" fill="${c}"/><rect x="90" y="54" width="96" height="20" rx="5" fill="${L}" opacity=".85"/><rect x="34" y="96" width="5" height="16" fill="${WD}"/><rect x="180" y="96" width="5" height="16" fill="${WD}"/></svg>`,
    mattress: () => `<svg viewBox="0 0 200 130" aria-hidden="true"><rect x="16" y="50" width="168" height="44" rx="10" fill="#fff" stroke="${SS}" stroke-width="3"/><rect x="16" y="76" width="168" height="18" rx="6" fill="${L}" opacity=".85"/><path d="M30 62h140" stroke="${SS}" stroke-width="2" stroke-dasharray="6 6"/></svg>`,
    dining: () => `<svg viewBox="0 0 200 130" aria-hidden="true"><rect x="40" y="56" width="120" height="9" rx="3" fill="${W}"/><rect x="50" y="65" width="7" height="48" fill="${WD}"/><rect x="143" y="65" width="7" height="48" fill="${WD}"/><rect x="12" y="40" width="26" height="40" rx="4" fill="${S}" stroke="${W}" stroke-width="3"/><rect x="12" y="80" width="4" height="34" fill="${WD}"/><rect x="34" y="80" width="4" height="34" fill="${WD}"/><rect x="162" y="40" width="26" height="40" rx="4" fill="${S}" stroke="${W}" stroke-width="3"/><rect x="162" y="80" width="4" height="34" fill="${WD}"/><rect x="184" y="80" width="4" height="34" fill="${WD}"/><circle cx="100" cy="46" r="10" fill="${L}"/></svg>`,
    wardrobe: () => `<svg viewBox="0 0 200 130" aria-hidden="true"><rect x="50" y="8" width="100" height="112" rx="4" fill="${SS}" stroke="${W}" stroke-width="3"/><path d="M100 8v112M83 8v112" stroke="${W}" stroke-width="2"/><rect x="104" y="14" width="40" height="70" fill="#dfe6ea" opacity=".8"/><circle cx="96" cy="64" r="2.5" fill="${WD}"/><circle cx="104" cy="64" r="2.5" fill="${WD}"/></svg>`,
    recliner: () => `<svg viewBox="0 0 200 130" aria-hidden="true"><path d="M50 20h56a12 12 0 0 1 12 12v40H44V26a6 6 0 0 1 6-6z" fill="#5a3a2a"/><rect x="40" y="68" width="100" height="26" rx="10" fill="#6d4734"/><path d="M140 74l46 10v14l-46-6z" fill="#6d4734"/><rect x="30" y="56" width="22" height="42" rx="9" fill="#5a3a2a"/><rect x="120" y="56" width="22" height="42" rx="9" fill="#5a3a2a"/><rect x="40" y="98" width="100" height="10" rx="3" fill="#333"/></svg>`,
    tv: () => `<svg viewBox="0 0 200 130" aria-hidden="true"><rect x="46" y="12" width="108" height="62" rx="4" fill="#222"/><rect x="20" y="86" width="160" height="28" rx="4" fill="${W}"/><path d="M73 86v28M127 86v28" stroke="${WD}" stroke-width="2"/><path d="M150 86c-2-10 2-18 10-22-1 9-4 16-10 22z" fill="${L}"/></svg>`,
    coffee: () => `<svg viewBox="0 0 200 130" aria-hidden="true"><ellipse cx="100" cy="70" rx="72" ry="18" fill="${W}"/><ellipse cx="100" cy="66" rx="72" ry="18" fill="#a3714a"/><path d="M50 80l-8 36M150 80l8 36M78 84l-3 32M122 84l3 32" stroke="${WD}" stroke-width="5"/><path d="M110 58c0-16 8-24 18-26-2 12-8 20-18 26z" fill="${L}"/></svg>`,
    study: () => `<svg viewBox="0 0 200 130" aria-hidden="true"><rect x="30" y="56" width="140" height="8" rx="2" fill="${W}"/><rect x="36" y="64" width="6" height="54" fill="${WD}"/><rect x="128" y="64" width="38" height="54" fill="${SS}" stroke="${W}" stroke-width="2"/><path d="M128 82h38M128 100h38" stroke="${W}" stroke-width="2"/><rect x="70" y="24" width="50" height="32" rx="2" fill="#333"/><path d="M56 26a10 8 0 0 1 14 6" stroke="${O}" stroke-width="6" fill="none"/></svg>`,
    chair: (c = L) => `<svg viewBox="0 0 200 130" aria-hidden="true"><path d="M66 18h68l-6 54H72z" fill="${c}"/><rect x="58" y="70" width="84" height="16" rx="6" fill="${c}"/><rect x="96" y="86" width="8" height="22" fill="#333"/><path d="M68 116h64M100 108v8" stroke="#333" stroke-width="5" stroke-linecap="round"/><circle cx="68" cy="120" r="4" fill="#333"/><circle cx="132" cy="120" r="4" fill="#333"/></svg>`,
    decor: () => `<svg viewBox="0 0 200 130" aria-hidden="true"><path d="M40 116h40l-6-46H46z" fill="${L}"/><path d="M60 72c-8-36 4-56 24-64-2 28-12 48-24 64zm0 0c-14-22-32-28-48-24 8 18 26 26 48 24z" fill="#2E8A4E"/><circle cx="140" cy="54" r="34" fill="none" stroke="${W}" stroke-width="5"/><circle cx="140" cy="54" r="26" fill="#f0e7da"/><rect x="118" y="96" width="44" height="20" rx="4" fill="${O}"/></svg>`,
    lamp: () => `<svg viewBox="0 0 200 130" aria-hidden="true"><path d="M100 0v40" stroke="#222" stroke-width="3"/><path d="M66 66a34 26 0 0 1 68 0z" fill="#222"/><ellipse cx="100" cy="68" rx="14" ry="6" fill="#F6B21A"/><path d="M70 120h60" stroke="${S}" stroke-width="6" stroke-linecap="round"/></svg>`
  };
  window.FV_ART = ART;

  /* ---------- sample products (used until a Storefront token is set) ---------- */
  const DEMO = [
    { handle: "arlo-3-seater-sofa", title: "Arlo 3-Seater Fabric Sofa", sub: "Beige · Kiln-dried pine", art: "sofa", c: S, price: 28999, compare: 52000, cols: ["sofas", "living-room"], tag: "Bestseller" },
    { handle: "mira-l-shape-sofa", title: "Mira L-Shape Sofa", sub: "Forest green · 5 seater", art: "sofa", c: "#2E8A4E", price: 46499, compare: 89000, cols: ["sofas", "living-room"] },
    { handle: "kaveri-queen-bed", title: "Kaveri Sheesham Queen Bed", sub: "With hydraulic storage", art: "bed", price: 32499, compare: 58000, cols: ["beds", "bedroom"], tag: "Top rated" },
    { handle: "nila-king-bed", title: "Nila King Bed", sub: "Engineered wood · Walnut", art: "bed", c: "#C9470A", price: 21999, compare: 38000, cols: ["beds", "bedroom"] },
    { handle: "hampi-dining-set", title: "Hampi 6-Seater Dining Set", sub: "Solid sheesham", art: "dining", price: 38999, compare: 69000, cols: ["dining"], tag: "New" },
    { handle: "ortho-plus-mattress", title: "Ortho Plus Mattress", sub: "Queen · 8 inch memory foam", art: "mattress", price: 13499, compare: 24000, cols: ["mattresses", "bedroom"] },
    { handle: "ergo-mesh-chair", title: "Ergo Mesh Office Chair", sub: "Lumbar support · 3 yr warranty", art: "chair", price: 7999, compare: 15999, cols: ["office-chairs", "home-office"] },
    { handle: "coorg-wardrobe", title: "Coorg 3-Door Wardrobe", sub: "With mirror · Oak finish", art: "wardrobe", price: 26999, compare: 45000, cols: ["wardrobes", "bedroom"] },
    { handle: "leo-recliner", title: "Leo Single Recliner", sub: "Leatherette · Cocoa", art: "recliner", price: 19999, compare: 36000, cols: ["recliners", "living-room"] },
    { handle: "tunga-tv-unit", title: "Tunga TV Unit", sub: "Up to 65 inch TV", art: "tv", price: 9499, compare: 17999, cols: ["tv-units", "living-room"] },
    { handle: "kabini-coffee-table", title: "Kabini Round Coffee Table", sub: "Solid mango wood", art: "coffee", price: 6999, compare: 12499, cols: ["coffee-tables", "living-room"] },
    { handle: "sharavathi-study-table", title: "Sharavathi Study Table", sub: "With side storage", art: "study", price: 8499, compare: 14999, cols: ["study-tables", "home-office"] }
  ].map((p) => ({
    ...p, images: [], img: null, description: `<p>${esc(p.sub)}. Free delivery and installation in Bengaluru, with a 1-year warranty against manufacturing defects.</p>`,
    variants: [{ id: "demo-" + p.handle, title: "Default Title", price: p.price, compare: p.compare, available: true }]
  }));

  /* ---------- Shopify Storefront API ---------- */
  async function gql(query, variables = {}) {
    const res = await fetch(`https://${CFG.shopDomain}/api/${CFG.apiVersion || "2026-04"}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": CFG.storefrontToken },
      body: JSON.stringify({ query, variables })
    });
    const json = await res.json();
    if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
    return json.data;
  }
  const PRODUCT_FIELDS = `handle title productType vendor descriptionHtml tags
    featuredImage { url altText }
    images(first: 8) { nodes { url altText } }
    variants(first: 30) { nodes { id title availableForSale price { amount } compareAtPrice { amount } } }`;
  const norm = (p) => {
    const vs = p.variants.nodes.map((v) => ({ id: v.id, title: v.title, price: +v.price.amount, compare: v.compareAtPrice ? +v.compareAtPrice.amount : null, available: v.availableForSale }));
    const first = vs[0] || { price: 0 };
    return {
      handle: p.handle, title: p.title, sub: p.productType || p.vendor || "", img: p.featuredImage && p.featuredImage.url,
      images: p.images.nodes.map((i) => i.url), description: p.descriptionHtml, variants: vs, price: first.price, compare: first.compare,
      tag: (p.tags || []).find((t) => /bestseller|new|top rated|sale/i.test(t)) || null
    };
  };

  const api = {
    async products({ collection, query, first = 24, sort } = {}) {
      if (!LIVE) {
        let list = DEMO;
        if (collection) list = list.filter((p) => p.cols.includes(collection));
        if (query) { const q = query.toLowerCase(); list = list.filter((p) => (p.title + " " + p.sub).toLowerCase().includes(q)); }
        return { title: null, products: list.slice(0, first) };
      }
      if (collection) {
        const d = await gql(`query($h:String!,$n:Int!){ collection(handle:$h){ title description products(first:$n, sortKey: BEST_SELLING){ nodes { ${PRODUCT_FIELDS} } } } }`, { h: collection, n: first });
        if (!d.collection) return { title: null, products: [], missing: true };
        return { title: d.collection.title, description: d.collection.description, products: d.collection.products.nodes.map(norm) };
      }
      const d = await gql(`query($n:Int!,$q:String,$s:ProductSortKeys){ products(first:$n, query:$q, sortKey:$s){ nodes { ${PRODUCT_FIELDS} } } }`, { n: first, q: query || null, s: sort || (query ? "RELEVANCE" : "BEST_SELLING") });
      return { title: null, products: d.products.nodes.map(norm) };
    },
    async product(handle) {
      if (!LIVE) return DEMO.find((p) => p.handle === handle) || null;
      const d = await gql(`query($h:String!){ product(handle:$h){ ${PRODUCT_FIELDS} } }`, { h: handle });
      return d.product ? norm(d.product) : null;
    }
  };

  /* ---------- cart ---------- */
  const CART_FIELDS = `id checkoutUrl totalQuantity cost { subtotalAmount { amount } }
    lines(first: 50) { nodes { id quantity merchandise { ... on ProductVariant { id title price { amount } image { url } product { title handle featuredImage { url } } } } } }`;
  const normCart = (c) => c ? ({
    id: c.id, checkoutUrl: c.checkoutUrl, count: c.totalQuantity, subtotal: +c.cost.subtotalAmount.amount,
    lines: c.lines.nodes.map((l) => ({ id: l.id, qty: l.quantity, title: l.merchandise.product.title, handle: l.merchandise.product.handle,
      variant: l.merchandise.title === "Default Title" ? "" : l.merchandise.title, price: +l.merchandise.price.amount,
      img: (l.merchandise.image && l.merchandise.image.url) || (l.merchandise.product.featuredImage && l.merchandise.product.featuredImage.url) }))
  }) : null;

  const cart = {
    data: { lines: [], count: 0, subtotal: 0 },
    async load() {
      if (!LIVE) {
        try { this.data.lines = JSON.parse(store.get("fv_demo_cart") || "[]"); } catch (e) { this.data.lines = []; }
        return this.recalc();
      }
      const id = store.get("fv_cart");
      if (!id) return this.render();
      try {
        const d = await gql(`query($id:ID!){ cart(id:$id){ ${CART_FIELDS} } }`, { id });
        if (d.cart) this.data = normCart(d.cart); else store.del("fv_cart");
      } catch (e) { console.warn(e); }
      this.render();
    },
    recalc() {
      const l = this.data.lines;
      this.data.count = l.reduce((a, x) => a + x.qty, 0);
      this.data.subtotal = l.reduce((a, x) => a + x.qty * x.price, 0);
      store.set("fv_demo_cart", JSON.stringify(l));
      this.render();
    },
    async add(product, variant, qty = 1) {
      if (!LIVE) {
        const ex = this.data.lines.find((x) => x.id === variant.id);
        if (ex) ex.qty += qty; else this.data.lines.push({ id: variant.id, qty, title: product.title, handle: product.handle, variant: "", price: variant.price, img: null, art: product.art, c: product.c });
        this.recalc(); open(); return;
      }
      const lines = [{ merchandiseId: variant.id, quantity: qty }];
      let d;
      if (this.data.id) {
        d = await gql(`mutation($id:ID!,$l:[CartLineInput!]!){ cartLinesAdd(cartId:$id, lines:$l){ cart { ${CART_FIELDS} } userErrors { message } } }`, { id: this.data.id, l: lines });
        d = d.cartLinesAdd;
      } else {
        d = await gql(`mutation($l:[CartLineInput!]!){ cartCreate(input:{ lines:$l }){ cart { ${CART_FIELDS} } userErrors { message } } }`, { l: lines });
        d = d.cartCreate;
      }
      if (d.userErrors && d.userErrors.length) throw new Error(d.userErrors[0].message);
      this.data = normCart(d.cart); store.set("fv_cart", this.data.id); this.render(); open();
    },
    async setQty(lineId, qty) {
      if (!LIVE) {
        const l = this.data.lines.find((x) => x.id === lineId); if (!l) return;
        if (qty <= 0) this.data.lines = this.data.lines.filter((x) => x !== l); else l.qty = qty;
        return this.recalc();
      }
      let d;
      if (qty <= 0) d = (await gql(`mutation($id:ID!,$l:[ID!]!){ cartLinesRemove(cartId:$id, lineIds:$l){ cart { ${CART_FIELDS} } } }`, { id: this.data.id, l: [lineId] })).cartLinesRemove;
      else d = (await gql(`mutation($id:ID!,$l:[CartLineUpdateInput!]!){ cartLinesUpdate(cartId:$id, lines:$l){ cart { ${CART_FIELDS} } } }`, { id: this.data.id, l: [{ id: lineId, quantity: qty }] })).cartLinesUpdate;
      this.data = normCart(d.cart); this.render();
    },
    render() {
      const b = $("#ccount"); if (b) b.textContent = this.data.count || 0;
      const box = $("#lines"); if (!box) return;
      if (!this.data.lines.length) {
        box.innerHTML = `<div class="empty">Your cart is empty.<br><a class="btn btn-orange" style="margin-top:14px" href="shop.html">Start shopping</a></div>`;
      } else {
        box.innerHTML = this.data.lines.map((l) => `<div class="line">
          <a class="thumb" href="product.html?h=${encodeURIComponent(l.handle)}">${l.img ? `<img src="${esc(l.img)}&width=160" alt="">` : (ART[l.art] || ART.sofa)(l.c)}</a>
          <div><b>${esc(l.title)}</b>${l.variant ? `<span class="meta">${esc(l.variant)}</span>` : ""}
            <div class="ctrl"><button type="button" data-q="${esc(l.id)}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button type="button" data-q="${esc(l.id)}" data-d="1" aria-label="Increase">+</button></div>
            <button type="button" class="rm" data-rm="${esc(l.id)}">Remove</button></div>
          <b>${inr(l.price * l.qty)}</b></div>`).join("");
      }
      $("#subtotal").textContent = inr(this.data.subtotal || 0);
      const co = $("#checkout");
      co.disabled = !this.data.lines.length;
      $("#conote").textContent = LIVE ? "Shipping and discount codes are applied at checkout." : "Sample mode: connect Shopify in config.js to enable checkout.";
    }
  };

  /* ---------- layout ---------- */
  const page = document.body.dataset.page;
  const navCats = (CFG.categories || []).slice(0, 10);
  const params = new URLSearchParams(location.search);
  function shell() {
    const top = document.createElement("div");
    top.innerHTML = `${LIVE ? "" : `<div class="demo">Showing sample products. Add your Shopify Storefront token in assets/config.js to sell live.</div>`}
    <div class="strip"><div class="wrap">Festive Home Sale: up to <b>55% off</b> + extra 10% with code <b>FURNEVIEW10</b> · Free delivery in Bengaluru</div></div>
    <header class="site"><div class="wrap hbar">
      <a class="logo" href="index.html" aria-label="Furneview home"><img src="assets/logo.png" alt="Furneview" width="191" height="40"></a>
      <form class="search" action="shop.html" role="search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input id="q" name="q" type="search" placeholder="Search sofas, beds, wardrobes…" value="${esc(params.get("q") || "")}" aria-label="Search products">
      </form>
      <div class="hicons">
        <a class="hicon hide-sm" href="index.html#stores"><svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>Stores</a>
        <a class="hicon hide-sm" href="${LIVE ? `https://${CFG.shopDomain}/account` : "#"}"><svg viewBox="0 0 24 24" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>Account</a>
        <button class="hicon" type="button" id="cartbtn"><svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>Cart<span class="badge" id="ccount">0</span></button>
      </div>
    </div>
    <nav class="rail" aria-label="Categories"><ul class="wrap">
      <li><a href="shop.html" class="${page === "shop" && !params.get("c") && !params.get("q") ? "on" : ""}">All</a></li>
      ${navCats.map((c) => `<li><a href="shop.html?c=${encodeURIComponent(c.handle)}" class="${params.get("c") === c.handle ? "on" : ""}">${esc(c.title)}</a></li>`).join("")}
    </ul></nav></header>`;
    document.body.prepend(top);

    const foot = document.createElement("div");
    foot.innerHTML = `<footer class="site"><div class="wrap">
      <div class="fgrid">
        <div><span class="flogo"><img src="assets/logo.png" alt="Furneview" width="143" height="30"></span><p style="font-size:14px;margin-top:14px">Help 9:30 AM to 8 PM, all days<br><b style="color:#fff">${esc(CFG.phone || "")}</b><br>${esc(CFG.email || "")}</p></div>
        <div><h4>Shop</h4><ul>${navCats.slice(0, 5).map((c) => `<li><a href="shop.html?c=${encodeURIComponent(c.handle)}">${esc(c.title)}</a></li>`).join("")}</ul></div>
        <div><h4>Help</h4><ul><li><a href="${LIVE ? `https://${CFG.shopDomain}/account` : "#"}">Track order</a></li><li><a href="${LIVE ? `https://${CFG.shopDomain}/policies/shipping-policy` : "#"}">Shipping &amp; delivery</a></li><li><a href="${LIVE ? `https://${CFG.shopDomain}/policies/refund-policy` : "#"}">Returns &amp; refunds</a></li><li><a href="index.html#stores">Stores</a></li></ul></div>
        <div><h4>Company</h4><ul><li><a href="index.html#why">About us</a></li><li><a href="index.html#stores">Bulk orders</a></li><li><a href="${LIVE ? `https://${CFG.shopDomain}/policies/privacy-policy` : "#"}">Privacy policy</a></li><li><a href="${LIVE ? `https://${CFG.shopDomain}/policies/terms-of-service` : "#"}">Terms</a></li></ul></div>
      </div>
      <div class="fine"><span>© ${new Date().getFullYear()} Furneview. All rights reserved.</span><div class="pay"><span>UPI</span><span>Visa</span><span>Mastercard</span><span>RuPay</span><span>EMI</span></div></div>
    </div></footer>
    ${CFG.whatsapp ? `<a class="wa" href="https://wa.me/${esc(CFG.whatsapp)}" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>Chat with us</a>` : ""}
    <div class="scrim" id="scrim" hidden></div>
    <aside class="drawer" id="drawer" hidden aria-label="Cart">
      <header><h3>Your cart</h3><button class="x" type="button" id="closecart" aria-label="Close cart">×</button></header>
      <div class="lines" id="lines"></div>
      <footer><div class="tot"><span>Subtotal</span><span id="subtotal">₹0</span></div><span class="note" id="conote"></span>
        <button class="btn btn-orange" type="button" id="checkout">Checkout securely</button></footer>
    </aside>
    <div class="toast" id="toast" hidden></div>`;
    document.body.append(foot);

    $("#cartbtn").onclick = open;
    $("#closecart").onclick = close;
    $("#scrim").onclick = close;
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    $("#lines").addEventListener("click", async (e) => {
      const q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
      try {
        if (q) { const l = cart.data.lines.find((x) => x.id === q.dataset.q); await cart.setQty(l.id, l.qty + +q.dataset.d); }
        if (r) await cart.setQty(r.dataset.rm, 0);
      } catch (err) { toast("Couldn't update the cart. Please try again."); }
    });
    $("#checkout").onclick = () => {
      if (LIVE && cart.data.checkoutUrl) location.href = cart.data.checkoutUrl;
      else toast("Checkout works once Shopify is connected.");
    };
  }
  function open() { $("#drawer").hidden = false; $("#scrim").hidden = false; }
  function close() { $("#drawer").hidden = true; $("#scrim").hidden = true; }
  function toast(t) { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (el.hidden = true), 2200); }

  /* ---------- product card ---------- */
  const imgUrl = (u, w) => u + (u.includes("?") ? "&" : "?") + "width=" + w;
  function card(p) {
    const off = p.compare && p.compare > p.price ? Math.round((1 - p.price / p.compare) * 100) : 0;
    const v = p.variants[0];
    const single = p.variants.length === 1;
    return `<article class="card">
      <a class="img" href="product.html?h=${encodeURIComponent(p.handle)}">${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}${p.img ? `<img src="${esc(imgUrl(p.img, 600))}" alt="${esc(p.title)}" loading="lazy">` : (ART[p.art] || ART.sofa)(p.c)}</a>
      <div class="body"><h3><a href="product.html?h=${encodeURIComponent(p.handle)}">${esc(p.title)}</a></h3>${p.sub ? `<span class="meta">${esc(p.sub)}</span>` : ""}
        <div class="price"><b>${inr(p.price)}</b>${off ? `<s>${inr(p.compare)}</s><em>${off}% off</em>` : ""}</div>
        ${p.price >= 3000 ? `<span class="emi">EMI from ${inr(p.price / 12)}/month</span>` : ""}
        ${single ? `<button class="add" type="button" data-add="${esc(p.handle)}" ${v && v.available ? "" : "disabled"}>${v && v.available ? "Add to cart" : "Sold out"}</button>`
                 : `<a class="add" style="text-align:center" href="product.html?h=${encodeURIComponent(p.handle)}">Choose options</a>`}
      </div></article>`;
  }
  const loaded = new Map();
  function renderProducts(el, list, emptyMsg) {
    list.forEach((p) => loaded.set(p.handle, p));
    el.innerHTML = list.length ? list.map(card).join("") : `<div class="empty">${emptyMsg}</div>`;
  }
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-add]"); if (!b) return;
    const p = loaded.get(b.dataset.add); if (!p) return;
    b.disabled = true; const t = b.textContent; b.textContent = "Adding…";
    try { await cart.add(p, p.variants[0], 1); toast("Added to cart"); }
    catch (err) { toast(err.message || "Couldn't add to cart"); }
    b.disabled = false; b.textContent = t;
  });
  const skeleton = (n) => Array.from({ length: n }, () => `<div class="skel"></div>`).join("");

  /* ---------- pages ---------- */
  function clock() {
    const el = $("#clock"); if (!el) return;
    if (!CFG.saleEnds) { el.hidden = true; return; }
    const end = new Date(CFG.saleEnds + "T23:59:59+05:30");
    const tick = () => {
      let s = Math.max(0, Math.floor((end - new Date()) / 1000));
      const d = Math.floor(s / 86400); s %= 86400; const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60); s %= 60;
      el.innerHTML = [[d, "Days"], [h, "Hrs"], [m, "Mins"], [s, "Sec"]].map(([v, l]) => `<span><b>${String(v).padStart(2, "0")}</b><small>${l}</small></span>`).join("");
    };
    tick(); setInterval(tick, 1000);
  }

  async function home() {
    clock();
    $("#cats").innerHTML = (CFG.categories || []).map((c) => `<a class="cat" href="shop.html?c=${encodeURIComponent(c.handle)}"><span class="tile">${(ART[c.art] || ART.sofa)()}</span>${esc(c.title)}</a>`).join("");
    $("#roomgrid").innerHTML = (CFG.rooms || []).map((r) => `<a class="room" href="shop.html?c=${encodeURIComponent(r.handle)}" style="background:${esc(r.bg)}">${(ART[r.art] || ART.sofa)()}<span>${esc(r.title)}</span></a>`).join("");
    $("#offers").innerHTML = (CFG.offers || []).map((o) => `<div class="offer"><b>${esc(o.title)}</b><span class="meta">${esc(o.text)}</span>${o.code ? `<div class="code">${esc(o.code)}<button type="button" data-copy="${esc(o.code)}">Copy</button></div>` : ""}</div>`).join("");
    $("#cities").innerHTML = (CFG.stores || []).map((s) => `<div class="city"><b>${esc(s.name)}</b><small>${esc(s.detail)}</small></div>`).join("");
    $("#vstore").innerHTML = (CFG.stores || []).map((s) => `<option>${esc(s.name)}</option>`).join("");
    document.querySelectorAll("[data-copy]").forEach((b) => (b.onclick = () => {
      const c = b.dataset.copy;
      (navigator.clipboard ? navigator.clipboard.writeText(c) : Promise.reject()).then(() => toast("Code " + c + " copied"), () => toast("Code: " + c));
    }));
    $("#vform").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#vname").value, phone = $("#vphone").value, st = $("#vstore").value, dt = $("#vdate").value;
      const msg = `Hi Furneview, I'd like to book a store visit.%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AStore: ${encodeURIComponent(st)}%0ADate: ${encodeURIComponent(dt || "Any")}`;
      if (CFG.whatsapp) { window.open(`https://wa.me/${CFG.whatsapp}?text=${msg}`, "_blank"); $("#vok").textContent = "Opening WhatsApp to confirm your visit…"; }
      else { location.href = `mailto:${CFG.email}?subject=Store visit booking&body=${msg}`; $("#vok").textContent = "Opening your email app to send the booking…"; }
      $("#vok").hidden = false;
    });

    const tabs = [{ title: "All", handle: "" }, ...(CFG.categories || []).slice(0, 5)];
    let active = "";
    const tabsEl = $("#tabs"), grid = $("#products");
    const drawTabs = () => (tabsEl.innerHTML = tabs.map((t) => `<button class="tab${t.handle === active ? " on" : ""}" type="button" data-t="${esc(t.handle)}">${esc(t.title)}</button>`).join(""));
    async function load() {
      grid.innerHTML = skeleton(4);
      try {
        const r = await api.products({ collection: active || undefined, first: 12 });
        renderProducts(grid, r.products, LIVE ? "No products here yet. Add products to this collection in Shopify." : "No sample products in this category.");
      } catch (err) { grid.innerHTML = `<div class="empty">Couldn't load products: ${esc(err.message)}</div>`; }
    }
    tabsEl.onclick = (e) => { const b = e.target.closest("[data-t]"); if (!b) return; active = b.dataset.t; drawTabs(); load(); };
    drawTabs(); load();
  }

  async function shop() {
    const c = params.get("c"), q = params.get("q");
    const cat = (CFG.categories || []).concat(CFG.rooms || []).find((x) => x.handle === c);
    $("#title").textContent = q ? `Results for “${q}”` : cat ? cat.title : "All furniture";
    document.title = $("#title").textContent + " · Furneview";
    const grid = $("#grid"); grid.innerHTML = skeleton(8);
    try {
      const r = await api.products({ collection: c || undefined, query: q || undefined, first: 48 });
      if (r.title) { $("#title").textContent = r.title; document.title = r.title + " · Furneview"; }
      if (r.description) { $("#sub").textContent = r.description; }
      $("#count").textContent = r.products.length + (r.products.length === 1 ? " product" : " products");
      renderProducts(grid, r.products, r.missing ? `No collection with the handle “${esc(c)}” in Shopify yet. Create it, or change the handle in config.js.` : q ? "No products match your search. Try a different word." : "No products here yet.");
    } catch (err) { grid.innerHTML = `<div class="empty">Couldn't load products: ${esc(err.message)}</div>`; }
  }

  async function product() {
    const h = params.get("h"), root = $("#pdp");
    let p = null;
    try { p = await api.product(h); } catch (err) { root.innerHTML = `<div class="empty">Couldn't load this product: ${esc(err.message)}</div>`; return; }
    if (!p) { root.innerHTML = `<div class="empty">This product isn't available. <a class="btn btn-orange" style="margin-top:14px" href="shop.html">Browse all furniture</a></div>`; return; }
    loaded.set(p.handle, p);
    document.title = p.title + " · Furneview";
    $("#crumb").textContent = p.title;
    const imgs = p.images.length ? p.images : p.img ? [p.img] : [];
    const multi = p.variants.length > 1;
    root.innerHTML = `<div class="gallery"><div class="main" id="mainimg">${imgs.length ? `<img src="${esc(imgUrl(imgs[0], 1200))}" alt="${esc(p.title)}">` : (ART[p.art] || ART.sofa)(p.c)}</div>
      ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((u, i) => `<button type="button" class="${i ? "" : "on"}" data-img="${esc(u)}" aria-label="Image ${i + 1}"><img src="${esc(imgUrl(u, 160))}" alt=""></button>`).join("")}</div>` : ""}</div>
      <div class="info">
        ${p.sub ? `<span class="eyebrow">${esc(p.sub)}</span>` : ""}
        <h1>${esc(p.title)}</h1>
        <div class="price" id="pprice"></div>
        <span class="emi" id="pemi"></span>
        ${multi ? `<label class="field" for="variant">Option<select id="variant">${p.variants.map((v, i) => `<option value="${i}" ${v.available ? "" : "disabled"}>${esc(v.title)}${v.available ? "" : " (sold out)"}</option>`).join("")}</select></label>` : ""}
        <div class="buyrow"><div class="qty"><button type="button" id="qm" aria-label="Decrease">−</button><input id="qty" value="1" inputmode="numeric" aria-label="Quantity"><button type="button" id="qp" aria-label="Increase">+</button></div>
          <button class="btn btn-orange" type="button" id="addbtn" style="flex:1">Add to cart</button></div>
        <div class="perks"><span>🚚 Free delivery and installation above ₹9,999</span><span>🛡 Warranty against manufacturing defects</span><span>₹ No-cost EMI on major cards</span></div>
        <div class="desc">${p.description || ""}</div>
      </div>`;
    let vi = Math.max(0, p.variants.findIndex((v) => v.available));
    const draw = () => {
      const v = p.variants[vi]; const off = v.compare && v.compare > v.price ? Math.round((1 - v.price / v.compare) * 100) : 0;
      $("#pprice").innerHTML = `<b>${inr(v.price)}</b>${off ? `<s>${inr(v.compare)}</s><em>${off}% off</em>` : ""}`;
      $("#pemi").textContent = v.price >= 3000 ? `EMI from ${inr(v.price / 12)}/month` : "";
      $("#addbtn").disabled = !v.available; $("#addbtn").textContent = v.available ? "Add to cart" : "Sold out";
      if ($("#variant")) $("#variant").value = vi;
    };
    draw();
    if ($("#variant")) $("#variant").onchange = (e) => { vi = +e.target.value; draw(); };
    const qty = $("#qty");
    $("#qm").onclick = () => (qty.value = Math.max(1, (+qty.value || 1) - 1));
    $("#qp").onclick = () => (qty.value = (+qty.value || 1) + 1);
    root.addEventListener("click", (e) => {
      const t = e.target.closest("[data-img]"); if (!t) return;
      root.querySelectorAll("[data-img]").forEach((x) => x.classList.toggle("on", x === t));
      $("#mainimg").innerHTML = `<img src="${esc(imgUrl(t.dataset.img, 1200))}" alt="${esc(p.title)}">`;
    });
    $("#addbtn").onclick = async () => {
      const b = $("#addbtn"); b.disabled = true; b.textContent = "Adding…";
      try { await cart.add(p, p.variants[vi], Math.max(1, +qty.value || 1)); toast("Added to cart"); }
      catch (err) { toast(err.message || "Couldn't add to cart"); }
      draw();
    };
    const rel = $("#related");
    try { const r = await api.products({ first: 8 }); renderProducts(rel, r.products.filter((x) => x.handle !== p.handle).slice(0, 8), "No other products yet."); } catch (e) { rel.closest("section").hidden = true; }
  }

  shell();
  cart.load();
  if (page === "home") home();
  else if (page === "shop") shop();
  else if (page === "product") product();
})();
