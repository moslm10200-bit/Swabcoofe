// ============ صورة الكوب الطائف (مدمجة داخل الملف، لا تحتاج مجلد صور) ============
// لتغيير الكوب: استبدل النص الطويل بين علامتي الاقتباس بصورة جديدة محوّلة إلى base64،
// أو اكتب مسار صورة مرفوعة مثل "images/cup2.png" بدل النص الطويل.

// ============ صورة رمز QR (مدمجة داخل الملف) ============
// الرمز الحالي يفتح الموقع: https://fjr16.vercel.app
// لتغيير الرمز: ولّد QR جديداً من أي موقع، ثم استبدل النص الطويل بين علامتي الاقتباس بالصورة محوّلة إلى base64،
// أو اكتب مسار صورة مرفوعة مثل "images/qr.png" بدل النص الطويل.
const QR_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYwAAAGMCAIAAABGWwIdAAAFxElEQVR42u3d640TQRCFUYwmCBIgC8InCxIgiyaCtby4t3RvzzkB7M5Ln9o/SvVYa30DSPXdIwBECkCkAJECECkAkQJECkCkAJECECkAkQJECkCkAJECECkAkQJECkCkAJECECkAkQJECkCkAJECECkAkQJECkCkAEQKECkAkQJECkCkAEQKECkAkQJECkCkAEQKECkAkQJECkCkAEQKECkAkQJECiDXlXZBv37+uO3L+P3n79gz3PW/Gr+fV+7dd+gkBSBSgEgBiBQgUgAiBSBSgEgBiBSASAEiBfCGq/GiG+fOds2CTc6UTf6vXfN0k9/Gnb9DJykAkQJECkCkAJECECkAkQJECkCkAJECECmAp65Tbyxt7mzyf71y77uej12B9/wOnaQARAoQKQCRAkQKQKQARAoQKQCRAkQKQKQAnro8gi6TM3dpuwLT5g1xkgIQKUCkAEQKECkAkQIQKUCkAEQKECkAkQL4gNm9Mml77tL25U3uucNJCkCkAJECEClApABECkCkAJECEClApABECuADx87unbpbLW1WbnKW0HfoJAUgUgAiBYgUgEgBIuURACIFIFKASAGIFIBIASUqZ/fsVut6F7vm13btAfQdOkkBiBQgUgAiBSBSgEgBiBQgUgAiBSBSgEgBfLHHWstT4L/tmt2bnIOzC89JCkCkAJECECkAkQJECkCkAJECECkAkQJECuCLxe3da9xlljabNnlfae9017u4899xkgIQKUCkAEQKECkAkQIQKUCkAEQKQKQAkQJ4W9zs3uQc3ORsWtoc3K7rSZspa5xfswfQSQoQKQCRAkQKQKQARAoQKQCRAkQKQKQARAo4zmOtVXfRjTvsXpE2vzY5J5g2k5j2rd75GTpJAX7uAYgUIFIAIgUgUoBIAYgUIFIAIgUgUkChuNm9xrmzNJOzjY2zcnfe8dd4zU5SgJ97ACIFiBSASAGIFCBSACIFiBSASAGIFFDoarzoyfm+tFnCXSavOe0Zpu3Ca/x+nKQARAoQKQCRAkQKQKQARAoQKQCRAkQKQKQAnro8gvc17nprnClL27fY+C4a90g6SQEiBSBSgEgBiBSASAEiBSBSgEgBiBSASAGFHmutqAuyp+x9afNZafN9ade8674m5xadpABEChApAJECRApApABEChApAJECRApApACeuvXevcYdZLucuutt1/U0zsqdOtPqJAWIFIBIASIFIFIAIgWIFIBIASIFIFIAIgUUqpzda5w7S9snmDZPN3nNjfNrkzOJTlIAIgWIFIBIASIFIFIAIgWIFIBIAYgUIFIAb3ustTyFIml77tLu/RV3nlt0kgIQKUCkAEQKQKQAkQIQKUCkAEQKQKQAkQIYEbd3r3En2i52/OVc8+SM5OR9Tb4vJynAzz0AkQIQKUCkAEQKECkAkQIQKUCkAEQKuLGr8aIbd5ClzcGdej2N39jknGDjbKyTFCBSACIFiBSASAGIFCBSACIFiBSASAGIFFDoOvXGTt1TljZ71TgL1jgnuGu+r3Hu1UkKECkAkQJECkCkAEQKECkAkQJECkCkAEQKKHR5BHxkcqYsbdZy8r523XvaLkUnKcDPPQCRAhApQKQARAoQKQCRAhApQKQARAq4MbN7B0qbldt1zbvsmstLexeN791JCvBzD0CkAJECECkAkQJECkCkAEQKECkAkQIOdezsXtruMGY07gH0PTtJASIFIFKASAGIFIBIASIFIFKASAGIFIBIAcepnN1r3B2W9nwa98o1Xo9v3kkKECkAkQIQKUCkAEQKECkAkQIQKUCkAEQKuKXHWstTAJykAEQKECkAkQIQKUCkAEQKECkAkQIQKUCkAEQKECkAkQIQKUCkAEQKECkAkQIQKUCkAEQKECkAkQIQKUCkAEQKQKQAkQIQKUCkAEQKQKQAkQIQKUCkAEQKQKQAkQIQKUCkAEQKQKQAkQIQKUCkAEQK4PP+ATt3hJ+lgs40AAAAAElFTkSuQmCC";

// ============ إعدادات المتجر ============
window.SHOP_CONFIG = {
  storeName: "صواب",          // اسم المتجر (يظهر في الشعار بخط الديواني)
  logoImage: "",              // اختياري: مسار صورة شعارك مثل "images/logo.png" لتستبدل الأيقونة الدائرية
  whatsapp: "963992147669",   // رقم الواتس اب (بدون + أو أصفار)
  currency: "د.ل",            // رمز العملة
  qrImage: QR_IMAGE,          // صورة رمز QR التي تظهر عند الضغط على أيقونة QR بجانب اسم المتجر
  supportLabel: "الدعم الفني :",       // الجملة التي تظهر تحت الرمز
  supportPhone: "+٩٦٣ ٩٩٢ ١٤٧ ٦٦٩"     // رقم الدعم الفني تحت الرمز
};

// ============ الصورة العلوية (البانر) ============
// غيّر الصورة والنص من هنا.
// image: رابط أو مسار صورة مثل "images/banner.jpg" (إذا وضعتها تظهر كخلفية كاملة)
// اتركها "" لاستخدام خلفية ملونة (colors) مع كوب مرسوم بلون cup.
// أضف أكثر من عنصر لتتحرك الصور تلقائياً.
// كوب قهوة طافٍ مكتوب عليه «صَواب» (SVG مضمّن، يستخدم خط الموقع)
const COFFEE_CUP_SVG = `<svg viewBox="0 0 210 230" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="cc-body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ecd9bd"/><stop offset=".35" stop-color="#fffaf2"/><stop offset="1" stop-color="#e3cba8"/></linearGradient>
    <linearGradient id="cc-cof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f4e37"/><stop offset="1" stop-color="#3a2216"/></linearGradient>
  </defs>
  <g fill="none" stroke="rgba(255,255,255,.75)" stroke-width="5" stroke-linecap="round">
    <path d="M76 52c-10-10 10-18 0-30"/><path d="M104 56c-10-10 10-18 0-32"/><path d="M132 52c-10-10 10-18 0-30"/>
  </g>
  <ellipse cx="100" cy="207" rx="84" ry="14" fill="#c9a77d"/>
  <ellipse cx="100" cy="203" rx="84" ry="14" fill="#f3e3cc"/>
  <path d="M166 100c42-4 42 62-8 60" fill="none" stroke="#e3cba8" stroke-width="16" stroke-linecap="round"/>
  <path d="M166 100c42-4 42 62-8 60" fill="none" stroke="#fffaf2" stroke-width="10" stroke-linecap="round"/>
  <path d="M32 82h136l-10 86c-3 22-14 34-36 34H78c-22 0-33-12-36-34z" fill="url(#cc-body)"/>
  <ellipse cx="100" cy="82" rx="68" ry="13" fill="#fffaf2" stroke="#e3cba8" stroke-width="2"/>
  <ellipse cx="100" cy="83" rx="58" ry="9" fill="url(#cc-cof)"/>
  <ellipse cx="86" cy="81" rx="20" ry="3" fill="#8a6244" opacity=".7"/>
  <text x="100" y="152" text-anchor="middle" direction="rtl" font-size="42" font-weight="700" fill="#4a2e1c" font-family="'Aref Ruqaa','Noto Naskh Arabic','Amiri',serif">صَواب</text>
</svg>`;

window.HERO_SLIDES = [
  {
    image: "",
    colors: ["#6f4e37", "#2f1b10"],
    cup: "#e8cfae",
    cupSvg: COFFEE_CUP_SVG,
    title: "مشروبات باردة منعشة",
    subtitle: "اطلب الآن واستمتع بأفضل نكهة"
  },
  {
    image: "",
    colors: ["#b5784a", "#4a2e1c"],
    cup: "#f3e3cc",
    cupSvg: COFFEE_CUP_SVG,
    title: "ماتشا طازج",
    subtitle: "نكهات جديدة كل يوم"
  }
];
window.HERO_INTERVAL = 4000; // مدة التبديل بالمللي ثانية

// ============ المنتجات ============
// category: التصنيف (تظهر أزرار التصنيفات تلقائياً)
// image: رابط/مسار صورة المنتج. إذا تركتها "" يُرسم كوب ملون تلقائياً حسب color.
window.PRODUCTS = [
  { id: 1, name: "ستراو ميلك",       price: 15000, category: "كريمي", color: "#f472b6", image: "" },
  { id: 2, name: "ستراو ميلك وسط",   price: 12000, category: "كريمي", color: "#fb7185", image: "" },
  { id: 3, name: "مانجو كريمي",      price: 16000, category: "كريمي", color: "#fbbf24", image: "" },
  { id: 4, name: "تارو كريمي",       price: 17000, category: "كريمي", color: "#a78bfa", image: "" },
  { id: 5, name: "بلو كريمي",        price: 17000, category: "كريمي", color: "#38bdf8", image: "" },
  { id: 6, name: "كراميل كريمي",     price: 18000, category: "كريمي", color: "#d97706", image: "" },
  { id: 7, name: "ماتشا فراولة",     price: 20000, category: "ماتشا", color: "#84cc16", image: "" },
  { id: 8, name: "ماتشا مانجو",      price: 20000, category: "ماتشا", color: "#eab308", image: "" },
  { id: 9, name: "ماتشا كراميل",     price: 21000, category: "ماتشا", color: "#65a30d", image: "" }
];
