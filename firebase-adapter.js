// محوّل Firebase (نسخة compat بدون أدوات بناء): Firestore للمنتجات والطلبات، وAuth لدخول الأدمن.
// الزبون لا يحتاج أي تسجيل دخول. إذا كان enabled=false لا يفعل شيئاً.
window.FirebaseAdapter = (function () {
  const cfg = window.FIREBASE_CONFIG || {};
  const V = "10.12.2", BASE = "https://www.gstatic.com/firebasejs/" + V + "/";
  const loaded = {};

  function loadScript(name) {
    if (!loaded[name]) {
      loaded[name] = new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = BASE + name; s.onload = res; s.onerror = () => { delete loaded[name]; rej(new Error("load " + name)); };
        document.head.appendChild(s);
      });
    }
    return loaded[name];
  }

  let coreP = null;
  function core() {
    if (!cfg.enabled) return Promise.resolve(null);
    if (!coreP) {
      coreP = (async () => {
        await loadScript("firebase-app-compat.js");
        await loadScript("firebase-firestore-compat.js");
        if (!firebase.apps.length) {
          const { enabled, ...fb } = cfg;
          firebase.initializeApp(fb);
        }
        return firebase;
      })().catch(e => { console.warn("Firebase غير متاح:", e); coreP = null; return null; });
    }
    return coreP;
  }

  async function init() { const f = await core(); return f ? f.firestore() : null; }

  async function authInit() {
    const f = await core(); if (!f) return null;
    await loadScript("firebase-auth-compat.js");
    return f.auth();
  }

  // إحصاءات اختيارية للموقع العام (لا تؤثر إن فشلت)
  async function analytics() {
    try {
      if (!cfg.measurementId) return;
      const f = await core(); if (!f) return;
      await loadScript("firebase-analytics-compat.js");
      f.analytics();
    } catch (e) {}
  }

  async function saveOrder(order) {
    try {
      const f = await core(); if (!f) return false;
      await f.firestore().collection("orders").add({
        items: order.items, total: order.total, status: "new",
        createdAt: f.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch (e) { console.warn("تعذر حفظ الطلب:", e); return false; }
  }

  // يرجع مصفوفة المنتجات من Firestore، أو null إن لم تتوفر/كانت فارغة
  async function getProducts() {
    try {
      const d = await init(); if (!d) return null;
      const snap = await d.collection("products").get();
      const list = snap.docs.map(x => ({ ...x.data(), id: x.id }));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return list.length ? list : null;
    } catch (e) { console.warn("تعذر تحميل المنتجات:", e); return null; }
  }

  return { init, authInit, analytics, saveOrder, getProducts, enabled: !!cfg.enabled };
})();
