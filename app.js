/* =========================================================
   المدرسة الجديدة الثانوية النموذجية بنين
   إعداد الكتب وأرقام التواصل من هذا الملف — لا يحتاج الأمر لتعديل تصميم الصفحة.
========================================================= */

// ضع رابط PDF الحقيقي في url عند رفع الكتاب. اتركه فارغاً إلى أن يتوفر الملف.
const BOOKS = [
  { title: 'الرياضيات المتخصصة', category: 'الرياضيات', icon: 'fa-square-root-variable', color: '#b18a37', light: '#fbf2d9', url: '' },
  { title: 'الرياضيات الأساسية', category: 'الرياضيات', icon: 'fa-calculator', color: '#5277af', light: '#e9effb', url: '' },
  { title: 'التربية الإسلامية', category: 'التربية', icon: 'fa-moon', color: '#42876f', light: '#e2f3eb', url: '' },
  { title: 'العلوم الهندسية', category: 'العلوم', icon: 'fa-compass-drafting', color: '#9564a8', light: '#f0e7f7', url: '' },
  { title: 'الأحياء', category: 'العلوم', icon: 'fa-leaf', color: '#418c70', light: '#e2f3e9', url: '' },
  { title: 'الكيمياء', category: 'العلوم', icon: 'fa-flask', color: '#438ca1', light: '#e1f3f7', url: '' },
  { title: 'الفيزياء', category: 'العلوم', icon: 'fa-atom', color: '#b97943', light: '#faebdd', url: '' },
  { title: 'اللغة الإنجليزية', category: 'اللغات', icon: 'fa-language', color: '#a65e70', light: '#f9e9ee', url: '' }
];

// أضف بيانات التواصل هنا. اترك value فارغاً إذا لم يتم تحديد الرقم أو البريد بعد.
// الأنواع المدعومة: phone، whatsapp، email، location، website.
const CONTACT_ITEMS = [
  { title: 'إدارة المدرسة', description: 'للاستفسارات العامة', type: 'phone', value: '0999498099' },
  { title: 'شؤون الطلاب', description: 'للمتابعة والاستفسارات الطلابية', type: 'phone', value: '0120578078' },
  { title: 'البريد الإلكتروني', description: 'للمراسلات الرسمية', type: 'email', value: 'blackft846@gmail.com' },
];

const PAGE_NAMES = ['home', 'books', 'notes', 'guidelines', 'schedule', 'contact', 'about'];
let toastTimer;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function safeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function showToast(message) {
  const toast = $('#toast');
  const messageNode = $('#toastMessage');
  if (!toast || !messageNode) return;
  messageNode.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

function normalizePage(hash) {
  const candidate = (hash || '').replace(/^#/, '').trim();
  return PAGE_NAMES.includes(candidate) ? candidate : 'home';
}

function closeMobileMenu() {
  const nav = $('#mainNav');
  const toggle = $('#menuToggle');
  nav?.classList.remove('is-open');
  toggle?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

function showPage(pageName, updateHistory = false) {
  const page = PAGE_NAMES.includes(pageName) ? pageName : 'home';
  $$('.page-view').forEach(view => {
    const active = view.dataset.page === page;
    view.classList.toggle('is-visible', active);
    view.hidden = !active;
  });

  $$('[data-nav]').forEach(link => {
    const linkPage = normalizePage(link.getAttribute('href'));
    if (link.classList.contains('nav-link')) {
      link.classList.toggle('is-active', linkPage === page);
      if (linkPage === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  });

  closeMobileMenu();
  if (updateHistory && window.location.hash !== `#${page}`) {
    window.history.pushState({ page }, '', `#${page}`);
  }
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

function setupNavigation() {
  $$('[data-nav]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      event.preventDefault();
      const page = normalizePage(href);
      showPage(page, true);
    });
  });

  window.addEventListener('popstate', () => showPage(normalizePage(window.location.hash), false));
  window.addEventListener('hashchange', () => {
    const current = normalizePage(window.location.hash);
    const visible = $('.page-view.is-visible')?.dataset.page;
    if (current !== visible) showPage(current, false);
  });

  $('#menuToggle')?.addEventListener('click', () => {
    const nav = $('#mainNav');
    const toggle = $('#menuToggle');
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  document.addEventListener('click', event => {
    const nav = $('#mainNav');
    const toggle = $('#menuToggle');
    if (nav?.classList.contains('is-open') && !nav.contains(event.target) && !toggle?.contains(event.target)) closeMobileMenu();
  });
}

function renderBooks(filter = '') {
  const container = $('#booksGrid');
  if (!container) return;
  const query = filter.trim().toLocaleLowerCase('ar');
  const filtered = BOOKS.filter(book => `${book.title} ${book.category}`.toLocaleLowerCase('ar').includes(query));

  if (!filtered.length) {
    container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i>لا توجد كتب تطابق عبارة البحث. جرّب كلمة أخرى.</div>';
    return;
  }

  container.innerHTML = filtered.map((book, index) => {
    const originalIndex = BOOKS.indexOf(book) + 1;
    const ready = Boolean(book.url.trim());
    return `
      <article class="book-item" style="--book-color:${safeText(book.color)};--book-light:${safeText(book.light)}">
        <div class="book-item-top"><span class="book-number">BOOK / ${String(originalIndex).padStart(2, '0')}</span><span class="book-symbol"><i class="fa-solid ${safeText(book.icon)}"></i></span></div>
        <h3>${safeText(book.title)}</h3>
        <p>${safeText(book.category)} · الصف الثالث الثانوي</p>
        <div class="book-item-bottom"><span class="book-type"><i class="fa-regular fa-file-pdf"></i>${ready ? 'ملف متاح' : 'ملف قيد الإضافة'}</span><button type="button" class="book-open-button ${ready ? 'is-ready' : ''}" data-book-index="${originalIndex - 1}">${ready ? 'فتح الكتاب' : 'قريباً'}</button></div>
      </article>`;
  }).join('');

  $$('.book-open-button', container).forEach(button => {
    button.addEventListener('click', () => {
      const book = BOOKS[Number(button.dataset.bookIndex)];
      if (!book) return;
      if (book.url && book.url.trim()) {
        window.open(book.url.trim(), '_blank', 'noopener,noreferrer');
      } else {
        showToast(`لم يُرفع ملف «${book.title}» بعد. أضف رابط PDF في مصفوفة BOOKS داخل app.js.`);
      }
    });
  });
}

function renderFeaturedBooks() {
  // الأسماء هنا بمثابة روابط مختصرة للكتب داخل الصفحة الرئيسية، وتحوّل المستخدم إلى المكتبة.
  const statBook = $('.stat-card strong');
  if (statBook) statBook.textContent = String(BOOKS.length).padStart(2, '0');
}

const CONTACT_ICONS = {
  phone: 'fa-phone', whatsapp: 'fa-brands fa-whatsapp', email: 'fa-envelope',
  location: 'fa-location-dot', website: 'fa-globe'
};

function contactHref(item) {
  const value = String(item.value || '').trim();
  if (!value) return '';
  if (item.type === 'phone') return `tel:${value.replace(/[^+\d]/g, '')}`;
  if (item.type === 'whatsapp') return `https://wa.me/${value.replace(/\D/g, '')}`;
  if (item.type === 'email') return `mailto:${value}`;
  if (item.type === 'website') return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  if (item.type === 'location') return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
  return '';
}

function renderContacts() {
  const container = $('#contactGrid');
  if (!container) return;
  container.innerHTML = CONTACT_ITEMS.map(item => {
    const value = String(item.value || '').trim();
    const href = contactHref(item);
    const iconClass = CONTACT_ICONS[item.type] || 'fa-circle-info';
    const button = value && href
      ? `<a href="${safeText(href)}" ${item.type === 'website' || item.type === 'whatsapp' || item.type === 'location' ? 'target="_blank" rel="noopener noreferrer"' : ''}>${item.type === 'phone' ? 'اتصل الآن' : item.type === 'email' ? 'إرسال بريد' : 'فتح الرابط'} <i class="fa-solid fa-arrow-left"></i></a>`
      : '';
    return `<article class="contact-card"><div class="contact-card-head"><span class="contact-card-icon"><i class="${safeText(iconClass.includes('fa-brands') ? iconClass : `fa-solid ${iconClass}`)}"></i></span><div><h3>${safeText(item.title)}</h3><p>${safeText(item.description || '')}</p></div></div><div class="contact-placeholder"><i class="fa-solid ${value ? 'fa-circle-check' : 'fa-hourglass-half'}"></i><span>${value ? safeText(value) : 'سيتم إضافة البيانات لاحقاً'}</span></div>${button}</article>`;
  }).join('');
}

function setupInteractions() {
  $('#bookSearch')?.addEventListener('input', event => renderBooks(event.target.value));

  const backToTop = $('#backToTop');
  const header = $('#siteHeader');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 140;
    backToTop?.classList.toggle('is-visible', scrolled);
    header?.classList.toggle('scrolled', scrolled);
  }, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function setupSchoolLogos() {
  $$('[data-school-logo]').forEach(image => {
    image.addEventListener('load', () => {
      image.classList.add('logo-loaded');
      const fallback = image.parentElement?.querySelector('.logo-fallback');
      if (fallback) fallback.style.display = 'none';
    });
    image.addEventListener('error', () => {
      image.classList.remove('logo-loaded');
      image.style.display = 'none';
    });
    // إذا كان المتصفح قد أنهى التحميل سريعاً قبل تسجيل الحدث.
    if (image.complete && image.naturalWidth > 0) {
      image.classList.add('logo-loaded');
      const fallback = image.parentElement?.querySelector('.logo-fallback');
      if (fallback) fallback.style.display = 'none';
    }
  });
}

function startPreloader() {
  const preloader = $('#preloader');
  const shell = $('#siteShell');
  const hide = () => {
    preloader?.classList.add('is-done');
    shell?.classList.add('is-ready');
    window.setTimeout(() => preloader?.remove(), 800);
  };
  // حد أقصى قصير حتى لا تبقى الصفحة عالقة إذا تأخر اتصال الإنترنت.
  window.setTimeout(hide, 1250);
  window.addEventListener('load', () => window.setTimeout(hide, 350), { once: true });
}

function initPortal() {
  setupSchoolLogos();
  setupNavigation();
  renderBooks();
  renderFeaturedBooks();
  renderContacts();
  setupInteractions();
  $('#currentYear').textContent = String(new Date().getFullYear());
  showPage(normalizePage(window.location.hash), false);
  startPreloader();
}

document.addEventListener('DOMContentLoaded', initPortal);
