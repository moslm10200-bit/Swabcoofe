(function () {
  const $ = id => document.getElementById(id);
  const A = window.FirebaseAdapter;
  const CFG = window.SHOP_CONFIG || {};
  const cur = CFG.currency || "";
  const fmt = n => Number(n || 0).toLocaleString("en-US") + " " + cur;
  const STATUS = { new: "جديد", prep: "قيد التحضير", done: "تم التسليم", cancel: "ملغي" };

  let db = null, auth = null, products = [], unsubOrders = null;

  // يمنع التعليق الصامت: إن لم تصل الكتابة للخادم خلال 12 ثانية نُظهر الخطأ
  const NOCONN = "لا يوجد اتصال بقاعدة البيانات. تأكد من إنشاء Firestore Database في Firebase Console ونشر القواعد.";
  const T = (p) => Promise.race([p, new Promise((_, r) => setTimeout(() => r({ code: "timeout" }), 12000))]);
  const toast = (m) => { const t = $("toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2000); };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  function authMsg(e) {
    const c = (e && e.code) || "";
    if (/invalid-credential|wrong-password|user-not-found|invalid-email/.test(c)) return "البريد أو كلمة السر غير صحيحة.";
    if (c.includes("too-many-requests")) return "محاولات كثيرة، انتظر قليلاً ثم حاول مجدداً.";
    if (c.includes("operation-not-allowed")) return "تسجيل الدخول بالبريد غير مفعّل بعد: فعّل Email/Password من Firebase > Authentication.";
    if (c.includes("network")) return "تحقق من اتصال الإنترنت.";
    if (c.includes("unauthorized-domain")) return "هذا الدومين غير مضاف في Authentication > Settings > Authorized domains.";
    return "تعذّر تسجيل الدخول (" + (c || "خطأ") + ").";
  }

  // ---------- الدخول ----------
  async function boot() {
    if (!A || !A.enabled) { $("loginErr").textContent = "Firebase غير مفعّل في firebase-config.js"; return; }
    try { auth = await A.authInit(); db = await A.init(); } catch (e) {}
    if (!auth || !db) { $("loginErr").textContent = "تعذّر تحميل Firebase. تحقق من الإنترنت."; return; }
    auth.onAuthStateChanged(u => u ? showApp(u) : showLogin());
  }
  function showLogin() {
    if (unsubOrders) { unsubOrders(); unsubOrders = null; }
    $("appView").hidden = true; $("loginView").hidden = false;
  }
  function showApp(user) {
    $("loginView").hidden = true; $("appView").hidden = false;
    $("whoEmail").textContent = user.email || "";
    loadProducts(); listenOrders();
  }
  $("loginForm").addEventListener("submit", async ev => {
    ev.preventDefault();
    if (!auth) return;
    $("loginErr").textContent = ""; $("loginBtn").disabled = true;
    try { await auth.signInWithEmailAndPassword($("email").value.trim(), $("password").value); }
    catch (e) { $("loginErr").textContent = authMsg(e); }
    $("loginBtn").disabled = false;
  });
  $("logoutBtn").onclick = () => auth && auth.signOut();

  // ---------- التبويبات ----------
  document.querySelectorAll(".tab").forEach(b => b.onclick = () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.toggle("on", x === b));
    $("tab-products").hidden = b.dataset.tab !== "products";
    $("tab-orders").hidden = b.dataset.tab !== "orders";
  });

  function showNotice(msg) { const n = $("notice"); n.textContent = msg || ""; n.hidden = !msg; }
  function denied(e) {
    if (e && e.code === "permission-denied") {
      showNotice("هذا الحساب لا يملك صلاحية الأدمن. أضف بريده في firestore.rules (دالة isAdmin) وانشر القواعد من Firebase Console.");
      return true;
    }
    return false;
  }

  // ---------- المنتجات ----------
  async function loadProducts() {
    try {
      const snap = await db.collection("products").get({ source: "server" });
      products = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      products.sort((a, b) => (a.order || 0) - (b.order || 0));
      showNotice("");
      renderProducts();
    } catch (e) { if (!denied(e)) showNotice(/unavailable|offline|timeout/.test(e.code + e.message) ? NOCONN : "تعذّر تحميل المنتجات: " + (e.code || e.message)); }
  }
  function thumb(p) {
    const t = el("div", "pthumb");
    if (p.image) t.style.backgroundImage = `url("${p.image.replace(/"/g, "%22")}")`;
    else { const i = el("i"); i.style.background = p.color || "#f472b6"; t.appendChild(i); }
    return t;
  }
  function renderProducts() {
    const box = $("plist"); box.innerHTML = "";
    $("importBtn").hidden = !!products.length || !(window.PRODUCTS && window.PRODUCTS.length);
    if (!products.length) { box.appendChild(el("div", "empty", "لا توجد منتجات في قاعدة البيانات بعد. الموقع يعرض الآن منتجات products.js.")); }
    products.forEach(p => {
      const row = el("div", "prow");
      const meta = el("div", "pmeta");
      meta.appendChild(el("b", "", p.name));
      meta.appendChild(el("span", "", fmt(p.price) + (p.category ? " · " + p.category : "")));
      const act = el("div", "pact");
      const e = el("button", "btn ghost sm", "تعديل"); e.onclick = () => openForm(p);
      const d = el("button", "btn danger sm", "حذف"); d.onclick = () => delProduct(p);
      act.append(e, d);
      row.append(thumb(p), meta, act);
      box.appendChild(row);
    });
    const dl = $("catList"); dl.innerHTML = "";
    [...new Set(products.map(p => p.category).filter(Boolean))].forEach(c => { const o = el("option"); o.value = c; dl.appendChild(o); });
  }
  async function delProduct(p) {
    if (!confirm("حذف «" + p.name + "» نهائياً؟")) return;
    try { await T(db.collection("products").doc(p.id).delete()); toast("تم الحذف"); loadProducts(); }
    catch (e) { if (!denied(e)) toast("فشل الحذف"); }
  }
  $("importBtn").onclick = async () => {
    const src = window.PRODUCTS || [];
    if (!src.length || !confirm("استيراد " + src.length + " منتج من products.js إلى قاعدة البيانات؟")) return;
    $("importBtn").disabled = true;
    try {
      for (let i = 0; i < src.length; i += 400) {
        const batch = db.batch();
        src.slice(i, i + 400).forEach((p, j) => {
          batch.set(db.collection("products").doc(String(p.id)), {
            name: p.name, price: Number(p.price) || 0, category: p.category || "",
            color: p.color || "#f472b6", image: p.image || "", order: i + j + 1
          });
        });
        await T(batch.commit());
      }
      toast("تم الاستيراد ✓"); loadProducts();
    } catch (e) { if (!denied(e)) { toast("فشل الاستيراد"); showNotice(e.code === "timeout" ? NOCONN : "فشل الاستيراد: " + (e.code || e.message)); } }
    $("importBtn").disabled = false;
  };

  // ---------- نافذة المنتج ----------
  let editing = null;
  function setPreview(src) { $("pPreview").style.backgroundImage = src ? `url("${src.replace(/"/g, "%22")}")` : "none"; }
  function openForm(p) {
    editing = p || null;
    $("pTitle").textContent = p ? "تعديل المنتج" : "منتج جديد";
    $("pName").value = p ? p.name : ""; $("pPrice").value = p ? p.price : "";
    $("pCat").value = p ? (p.category || "") : ""; $("pColor").value = (p && p.color) || "#f472b6";
    $("pOrder").value = p ? (p.order || "") : (products.length ? Math.max(...products.map(x => x.order || 0)) + 1 : 1);
    $("pImage").value = p ? (p.image || "") : ""; $("pFile").value = ""; $("pErr").textContent = "";
    setPreview($("pImage").value);
    $("overlay").hidden = false; $("pForm").hidden = false; $("pName").focus();
  }
  function closeForm() { $("overlay").hidden = true; $("pForm").hidden = true; }
  $("addBtn").onclick = () => openForm(null);
  $("pCancel").onclick = closeForm; $("overlay").onclick = closeForm;
  $("pImage").oninput = () => setPreview($("pImage").value.trim());

  // تصغير الصورة المرفوعة وحفظها داخل المستند (لا نحتاج Firebase Storage)
  $("pFile").onchange = () => {
    const f = $("pFile").files[0]; if (!f) return;
    const img = new Image(), url = URL.createObjectURL(f);
    img.onload = () => {
      const max = 600, k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
      const data = c.toDataURL("image/jpeg", .8); URL.revokeObjectURL(url);
      $("pImage").value = data; setPreview(data);
    };
    img.onerror = () => { $("pErr").textContent = "تعذّر قراءة الصورة."; };
    img.src = url;
  };
  $("pForm").addEventListener("submit", async ev => {
    ev.preventDefault();
    const data = {
      name: $("pName").value.trim(), price: Number($("pPrice").value), category: $("pCat").value.trim(),
      color: $("pColor").value, image: $("pImage").value.trim(), order: Number($("pOrder").value) || 0
    };
    if (!data.name || !(data.price >= 0)) { $("pErr").textContent = "أدخل الاسم والسعر."; return; }
    if (data.image.length > 700000) { $("pErr").textContent = "الصورة كبيرة جداً، استخدم صورة أصغر أو رابطاً."; return; }
    $("pSave").disabled = true; $("pErr").textContent = "";
    try {
      const col = db.collection("products");
      await T(editing ? col.doc(editing.id).set(data) : col.add(data));
      closeForm(); toast("تم الحفظ ✓"); loadProducts();
    } catch (e) { $("pErr").textContent = denied(e) ? "ليس لديك صلاحية الحفظ." : (e.code === "timeout" ? NOCONN : "فشل الحفظ: " + (e.code || e.message)); }
    $("pSave").disabled = false;
  });

  // ---------- الطلبات ----------
  function listenOrders() {
    if (unsubOrders) unsubOrders();
    unsubOrders = db.collection("orders").orderBy("createdAt", "desc").limit(100).onSnapshot(snap => {
      const box = $("olist"); box.innerHTML = "";
      let fresh = 0;
      if (snap.empty) box.appendChild(el("div", "empty", "لا توجد طلبات بعد."));
      snap.forEach(doc => {
        const o = doc.data(), st = o.status || "new";
        if (st === "new") fresh++;
        const card = el("div", "order " + st);
        const head = el("div", "order-head");
        head.append(el("span", "", o.createdAt ? o.createdAt.toDate().toLocaleString("ar") : "الآن"), el("span", "", "#" + doc.id.slice(0, 5)));
        const ul = el("ul");
        (o.items || []).forEach(i => ul.appendChild(el("li", "", `${i.name} × ${i.qty} — ${fmt(i.price * i.qty)}`)));
        const foot = el("div", "order-foot");
        const sel = el("select");
        Object.keys(STATUS).forEach(k => { const op = el("option", "", STATUS[k]); op.value = k; if (k === st) op.selected = true; sel.appendChild(op); });
        sel.onchange = () => db.collection("orders").doc(doc.id).update({ status: sel.value }).catch(() => toast("فشل التحديث"));
        const del = el("button", "btn danger sm", "حذف");
        del.onclick = () => { if (confirm("حذف الطلب؟")) db.collection("orders").doc(doc.id).delete().catch(() => toast("فشل الحذف")); };
        foot.append(el("span", "total", fmt(o.total)), sel, del);
        card.append(head, ul, foot); box.appendChild(card);
      });
      const b = $("newBadge"); b.textContent = fresh; b.hidden = !fresh;
    }, e => { denied(e); });
  }

  boot();
})();
