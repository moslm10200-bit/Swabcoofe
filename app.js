(function () {
  // تنبيه واضح إذا لم يُحمَّل products.js (غير مرفوع أو في مجلد آخر)
  if (!window.SHOP_CONFIG || !window.PRODUCTS) {
    document.body.innerHTML = '<div style="padding:40px 20px;text-align:center;font-family:sans-serif;color:#b91c1c;direction:rtl">' +
      '<h2>تعذّر تحميل ملف products.js</h2><p>تأكد أنه مرفوع بجانب index.html في نفس المجلد.</p></div>';
    return;
  }
  const CFG = window.SHOP_CONFIG;
  let PRODUCTS = window.PRODUCTS;
  const $ = id => document.getElementById(id);
  const fmt = n => n.toLocaleString("en-US") + " " + CFG.currency;

  // ---------- رسم كوب المشروب ----------
  function shade(hex, amt) { // amt > 0 أغمق ، amt < 0 أفتح
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 255 : 0, p = Math.abs(amt);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function cupSvg(c, uid) {
    const dk = shade(c, .28), lt = shade(c, -.4);
    return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 240'>
      <defs>
        <linearGradient id='b${uid}' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${lt}'/><stop offset='.5' stop-color='${c}'/><stop offset='1' stop-color='${dk}'/></linearGradient>
        <linearGradient id='l${uid}' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#fff' stop-opacity='.6'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></linearGradient>
      </defs>
      <ellipse cx='100' cy='229' rx='44' ry='6' fill='#000' opacity='.22'/>
      <rect x='103' y='2' width='9' height='100' rx='4.5' fill='#fff' opacity='.92'/>
      <path d='M57 96 L143 96 L132 214 Q100 225 68 214 Z' fill='url(#b${uid})'/>
      <path d='M57 96 L143 96 L140 134 Q100 142 60 134 Z' fill='#fff' opacity='.38'/>
      <g fill='#2b1b17'><circle cx='80' cy='204' r='5.5'/><circle cx='94' cy='208' r='5.5'/><circle cx='108' cy='208' r='5.5'/><circle cx='122' cy='204' r='5.5'/><circle cx='87' cy='194' r='5.5'/><circle cx='101' cy='197' r='5.5'/><circle cx='115' cy='194' r='5.5'/></g>
      <path d='M63 102 L74 102 L82 206 L75 205 Z' fill='url(#l${uid})'/>
      <path d='M55 97 C55 50 145 50 145 97 Z' fill='#fff' fill-opacity='.26' stroke='#fff' stroke-opacity='.75' stroke-width='2'/>
      <g fill='#fff' stroke='#000' stroke-opacity='.07'>
        <ellipse cx='100' cy='76' rx='33' ry='15'/><ellipse cx='100' cy='62' rx='25' ry='12'/><ellipse cx='100' cy='50' rx='16' ry='10'/>
      </g>
      <g fill='none' stroke='${dk}' stroke-linecap='round'>
        <path d='M72 70 q-3 16 2 28' stroke-width='5'/><path d='M129 68 q5 14 -1 26' stroke-width='5'/>
        <path d='M78 60 q22 9 44 0' stroke-width='4' opacity='.9'/>
      </g>
      <g><circle cx='94' cy='44' r='2.4' fill='${dk}'/><circle cx='106' cy='48' r='2.4' fill='#fb7185'/><circle cx='100' cy='40' r='2.4' fill='#fbbf24'/></g>
      <rect x='51' y='94' width='98' height='8' rx='4' fill='#fff' opacity='.95'/>
    </svg>`;
  }
  const cupUri = c => `url("data:image/svg+xml;utf8,${encodeURIComponent(cupSvg(c, "x"))}")`;
  function setArt(el, p) {
    if (p.image) { el.classList.add("photo"); el.style.backgroundImage = `url("${p.image}")`; }
    else {
      el.classList.add("gen");
      el.style.backgroundImage = `${cupUri(p.color)}, radial-gradient(circle at 50% 45%, ${p.color}70, ${p.color}18 72%)`;
    }
  }

  // ---------- البانر ----------
  function renderHero() {
    const hero = $("hero");
    const slides = window.HERO_SLIDES || [];
    hero.innerHTML = "";
    slides.forEach((s, i) => {
      const d = document.createElement("div");
      d.className = "slide" + (i === 0 ? " active" : "") + (s.image ? " photo" : "");
      d.style.color = "#fff";
      d.style.backgroundImage = s.image
        ? `url("${s.image}")`
        : `linear-gradient(135deg, ${(s.colors || ["#ec4899", "#8b5cf6"]).join(",")})`;
      d.innerHTML = `<div class="txt"><h1>${s.title || ""}</h1><p>${s.subtitle || ""}</p><button class="cta">تسوّق الآن</button></div>` +
        (s.image ? "" : (s.cupSvg
          ? `<div class="art">${s.cupSvg}</div>`
          : s.cupImage
          ? `<div class="art img" style="width:auto;max-width:none"><img src="${s.cupImage}" alt="" style="height:125px;width:auto;max-width:none;display:block;transform:rotate(-8deg)"></div>`
          : `<div class="art">${cupSvg(s.cup || "#f9a8d4", "h" + i)}</div>`));
      // ضبط ثابت من الكود (يعمل حتى لو كان styles.css قديماً): لون أبيض + حجم وميلان كوب الصورة
      d.style.color = "#fff";
      const ci = d.querySelector(".art.img");
      if (ci) {
        ci.style.width = "auto"; ci.style.maxWidth = "none";
        ci.querySelector("img").style.cssText = "height:125px;width:auto;display:block;transform:rotate(-8deg)";
        d.querySelector(".txt").style.maxWidth = "58%";
      }
      d.querySelector(".cta").onclick = () => $("menu").scrollIntoView({ behavior: "smooth" });
      hero.appendChild(d);
    });
    if (slides.length > 1) {
      const dots = document.createElement("div");
      dots.className = "dots";
      slides.forEach((_, i) => { const x = document.createElement("i"); if (!i) x.className = "on"; dots.appendChild(x); });
      hero.appendChild(dots);
      let cur = 0;
      setInterval(() => {
        const els = hero.querySelectorAll(".slide"), ds = dots.children;
        els[cur].classList.remove("active"); ds[cur].classList.remove("on");
        cur = (cur + 1) % els.length;
        els[cur].classList.add("active"); ds[cur].classList.add("on");
      }, window.HERO_INTERVAL || 4000);
    }
  }

  // ---------- السلة ----------
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("cart") || "[]"); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {} };

  function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1500);
  }
  function addToCart(id) {
    const found = cart.find(i => i.id === id);
    if (found) found.qty++; else cart.push({ id, qty: 1 });
    save(); renderCart();
    const b = $("cartBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    toast("تمت الإضافة إلى السلة ✓");
  }
  function changeQty(id, d) {
    const it = cart.find(i => i.id === id); if (!it) return;
    it.qty += d;
    if (it.qty <= 0) cart = cart.filter(i => i.id !== id);
    save(); renderCart();
  }
  function renderCart() {
    const box = $("cartItems");
    let total = 0, count = 0;
    box.innerHTML = "";
    if (!cart.length) box.innerHTML = '<div class="cart-empty">🛒<br>السلة فارغة</div>';
    cart.forEach(it => {
      const p = PRODUCTS.find(x => x.id === it.id); if (!p) return;
      total += p.price * it.qty; count += it.qty;
      const row = document.createElement("div");
      row.className = "item";
      row.innerHTML = `<div class="thumb"></div>
        <div class="meta"><b>${p.name}</b><span>${fmt(p.price)}</span></div>
        <div class="qty"><button data-d="1">+</button><span>${it.qty}</span><button data-d="-1">−</button></div>`;
      setArt(row.querySelector(".thumb"), p);
      row.querySelectorAll("button").forEach(b => b.onclick = () => changeQty(p.id, +b.dataset.d));
      box.appendChild(row);
    });
    $("cartTotal").textContent = fmt(total);
    $("cartCount").textContent = count; $("cartCount").dataset.n = count;
    $("waBtn").disabled = !cart.length;
  }
  const openCart = () => { $("drawer").classList.add("show"); $("overlay").classList.add("show"); };
  const closeCart = () => { $("drawer").classList.remove("show"); $("overlay").classList.remove("show"); };

  // ---------- الشراء عبر واتس اب ----------
  function checkout() {
    if (!cart.length) return;
    cart = cart.filter(it => PRODUCTS.some(x => x.id === it.id)); save();
    if (!cart.length) { renderCart(); return; }
    let total = 0;
    const lines = cart.map(it => {
      const p = PRODUCTS.find(x => x.id === it.id);
      total += p.price * it.qty;
      return `• ${p.name} × ${it.qty} = ${fmt(p.price * it.qty)}`;
    });
    const msg = "مرحباً، أريد طلب:\n" + lines.join("\n") + "\nالمجموع: " + fmt(total);
    if (window.FirebaseAdapter) {
      window.FirebaseAdapter.saveOrder({
        items: cart.map(it => { const p = PRODUCTS.find(x => x.id === it.id); return { id: p.id, name: p.name, price: p.price, qty: it.qty }; }),
        total
      });
    }
    const url = "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(msg);
    // يفتح واتس اب في نافذة/تبويب جديد (يعمل أيضاً داخل المعاينة)، وإن مُنع يفتح في نفس الصفحة
    const w = window.open(url, "_blank");
    if (!w) window.location.href = url;
  }

  // ---------- المنتجات والتصنيفات ----------
  let activeCat = "الكل";
  function renderChips() {
    const cats = ["الكل"].concat([...new Set(PRODUCTS.map(p => p.category).filter(Boolean))]);
    const box = $("chips"); box.innerHTML = "";
    if (cats.length < 3) { box.style.display = "none"; return; }
    cats.forEach(c => {
      const b = document.createElement("button");
      b.className = "chip" + (c === activeCat ? " on" : ""); b.textContent = c;
      b.onclick = () => { activeCat = c; renderChips(); renderProducts(); };
      box.appendChild(b);
    });
  }
  function renderProducts() {
    const grid = $("products");
    const q = $("search").value.trim();
    const list = PRODUCTS.filter(p => (activeCat === "الكل" || p.category === activeCat) && p.name.includes(q));
    grid.innerHTML = "";
    if (!list.length) { grid.innerHTML = '<div class="empty">لا توجد نتائج</div>'; return; }
    list.forEach(p => {
      const c = document.createElement("div");
      c.className = "card";
      c.innerHTML = `<div class="img"></div>
        <div class="info"><div class="name">${p.name}</div><div class="price">${fmt(p.price)}</div><button class="buy">شراء</button></div>`;
      setArt(c.querySelector(".img"), p);
      c.querySelector(".buy").onclick = () => addToCart(p.id);
      grid.appendChild(c);
    });
  }

  // ---------- تشغيل ----------
  $("logoText").textContent = CFG.storeName;
  if (CFG.logoImage) $("logoBadge").innerHTML = `<img src="${CFG.logoImage}" alt="${CFG.storeName}">`;
  document.title = CFG.storeName;
  $("cartBtn").onclick = openCart;
  $("closeCart").onclick = closeCart;
  $("overlay").onclick = closeCart;
  $("waBtn").onclick = checkout;
  $("clearBtn").onclick = () => { cart = []; save(); renderCart(); };
  $("search").oninput = renderProducts;

  // ---------- رمز QR ----------
  $("qrImg").src = CFG.qrImage || "";
  // رمز QR يُولَّد تلقائياً لعنوان الموقع الحالي (يتغير مع تغيّر الدومين)، وإن تعذّر يبقى الرمز الاحتياطي
  (function makeQr() {
    if (!/^https?:$/.test(location.protocol)) return;
    const srcs = ["https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js", "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"];
    const draw = () => {
      const q = window.qrcode(0, "M"); q.addData(location.origin + "/"); q.make();
      const n = q.getModuleCount(), m = 4; let d = "";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c + m} ${r + m}h1v1h-1z`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n + 2 * m} ${n + 2 * m}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#3a2216"/></svg>`;
      $("qrImg").src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    };
    const load = i => {
      if (window.qrcode) return draw();
      if (i >= srcs.length) return;
      const sc = document.createElement("script"); sc.src = srcs[i]; sc.onload = () => { try { draw(); } catch (e) {} }; sc.onerror = () => load(i + 1);
      document.head.appendChild(sc);
    };
    load(0);
  })();
  $("qrSupportLabel").textContent = CFG.supportLabel || "";
  $("qrPhone").textContent = CFG.supportPhone || "";
  const openQr = () => { $("qrModal").classList.add("show"); $("qrOverlay").classList.add("show"); };
  const closeQr = () => { $("qrModal").classList.remove("show"); $("qrOverlay").classList.remove("show"); };
  $("qrBtn").onclick = openQr; $("qrClose").onclick = closeQr; $("qrOverlay").onclick = closeQr;

  renderHero(); renderChips(); renderProducts(); renderCart();

  // ---------- المنتجات من Firestore (إن وُجدت) وإلا تبقى منتجات products.js ----------
  if (window.FirebaseAdapter && window.FirebaseAdapter.enabled) {
    window.FirebaseAdapter.getProducts().then(list => {
      if (!list) return;
      PRODUCTS = list; window.PRODUCTS = list;
      cart = cart.filter(it => PRODUCTS.some(x => x.id === it.id)); save();
      activeCat = "الكل"; renderChips(); renderProducts(); renderCart();
    });
    window.FirebaseAdapter.analytics();
  }
})();
