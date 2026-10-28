/* =========================================================
   مدرسة الجديدة النموذجية بنين — إعدادات الموقع ومحتواه
   1) عدّل بيانات المدرسة في SCHOOL_CONFIG.
   2) أضف الكتب داخل LIBRARY_ITEMS أو عدّل العناصر الجاهزة.
   3) غيّر الصور في ACTIVITIES، وأسماء الطلاب في HONOR_STUDENTS.
   كل الروابط والملفات اختيارية حتى تتم إضافتها فعلياً.
========================================================= */

const SCHOOL_CONFIG = {
  name: 'مدرسة الجديدة النموذجية بنين',
  shortName: 'الجديدة النموذجية',
  phone: '0999498099',                 // مثال: 2499XXXXXXXX
  whatsapp: '0999498099',              // مثال: 2499XXXXXXXX — أرقام فقط مع مفتاح الدولة
  email: 'info.@gmail.com',                 // البريد الرسمي لاستقبال الاستفسارات
  facebook: '',              // رابط صفحة فيسبوك
  tiktok: '',                // رابط حساب تيك توك
  mapUrl: 'https://maps.app.goo.gl/nnQWoAyM3yQpdVzS7?g_st=ac',
  // الأرقام التالية معروضة كحقول قابلة للتعديل، لا تُترك أرقاماً تقديرية على الموقع المنشور.
  stats: [
    { number: '—', label: 'طالب وطموح', note: 'أضف العدد المعتمد من الإدارة', icon: 'fa-user-graduate' },
    { number: '3', label: 'مسارات للشهادة السودانية', note: 'هندسي • علوم • أدبي', icon: 'fa-route' },
    { number: '—', label: 'عاماً من العطاء', note: 'أضف تاريخ تأسيس المدرسة', icon: 'fa-award' },
    { number: '100%', label: 'طموح نحو التميز', note: 'رؤية تعليمية متجددة', icon: 'fa-bullseye' }
  ]
};

// الإعلانات تتحكم بها من هنا. احذف أو أضف عناصر حسب الحاجة.
const ANNOUNCEMENTS = [
  { icon: 'fa-bullhorn', text: 'ستقام الامتحانات الشهرية الاولى في تاريخ /29/11/2026.' },
  { icon: 'fa-book-open', text: 'المكتبة الرقمية جاهزة للاستخدام.' },
  { icon: 'fa-calendar-check', text: 'يجب على قرشي تعويض الطلاب عبدالله بكوب قهوة كبييير جدا.' }
];

// عناصر المكتبة: املأ title وdescription وfile لكل كتاب.
// مثال للملف: file: 'assets/pdfs/grade-one-math.pdf'
// أضف عناصر جديدة إلى هذه المصفوفة متى احتجت؛ لا يوجد حد برمجي لعدد الملفات.
const LIBRARY_ITEMS = [];
function addLibrarySlots({ count, idPrefix, grade, stream = '', kind = 'كتاب دراسي', subject = 'منهج دراسي', titlePrefix = 'أضف اسم الكتاب' }) {
  for (let i = 1; i <= count; i++) {
    LIBRARY_ITEMS.push({
      id: `${idPrefix}-${String(i).padStart(2, '0')}`,
      title: `${titlePrefix} (${String(i).padStart(2, '0')})`,
      description: 'مساحة مخصصة لإضافة بيانات الملف من داخل assets/js/app.js.',
      grade,
      stream,
      kind,
      subject,
      file: ''
    });
  }
}

// الصف الأول: 13 كتاباً.
addLibrarySlots({ count: 04, idPrefix: 'grade1', grade: 'الصف الأول', titlePrefix: 'كتاب الصف الأول' });
// الصف الثاني: 13 كتاباً.
addLibrarySlots({ count: 03, idPrefix: 'grade2', grade: 'الصف الثاني', titlePrefix: 'كتاب الصف الثاني' });
// الصف الثالث: 10 كتب لكل مسار، حتى تكون مواد كل مسار مستقلة ومنظمة.
addLibrarySlots({ count: 05, idPrefix: 'grade3-eng', grade: 'الصف الثالث', stream: 'المسار الهندسي', titlePrefix: 'كتاب المسار الهندسي' });
addLibrarySlots({ count: 10, idPrefix: 'grade3-science', grade: 'الصف الثالث', stream: 'مسار علوم الحاسوب / الأحياء', titlePrefix: 'كتاب مسار علوم الحاسوب / الأحياء' });
addLibrarySlots({ count: 10, idPrefix: 'grade3-literary', grade: 'الصف الثالث', stream: 'المسار الأدبي', titlePrefix: 'كتاب المسار الأدبي' });
// 20 خانة أولية للمراجع والملازم والامتحانات السابقة، ويمكن زيادة العدد بإضافة استدعاءات أو عناصر.
const referenceKinds = ['مرجع', 'مذكرة', 'امتحان سابق', 'ملخص'];
for (let i = 1; i <= 7; i++) {
  LIBRARY_ITEMS.push({
    id: `reference-${String(i).padStart(2, '0')}`,
    title: `أضف عنوان المرجع أو المذكرة (${String(i).padStart(2, '0')})`,
    description: 'خانة قابلة للتخصيص للمراجع والملازم والامتحانات السابقة.',
    grade: 'المراجع والملفات المساندة',
    stream: '',
    kind: referenceKinds[(i - 1) % referenceKinds.length],
    subject: 'مرجع ومادة مساندة',
    file: ''
  });
}

// تخصيص الخانات فردياً: أزل التعليق عن السطر الذي تريد استخدامه ثم عدّل بياناته.
// لا تحتاج إلى تعديل دالة إنشاء الخانات؛ أضف أي عدد من العناصر داخل هذا الكائن.
const LIBRARY_OVERRIDES = {
  'grade1-01': { title: 'الرياضيات — الصف الأول', subject: 'رياضيات', description: 'كتاب الرياضيات للصف الاول ثانوي مقرر جديد كليا.', file: 'Math1.pdf' },
  'grade1-02': { title: 'اللغة العربية — الصف الأول', subject: 'لغة عربية', description: 'كتاب اللغة العربية للصف الاول ثانوي مقرر جديد كليا.', file: 'Adab.pdf' },
  'grade1-03': { title: 'الكيمياء — الصف الأول', subject: 'كيمياء', description: 'كتاب الكيمياء للصف الاول ثانوي مقرر جديد كليا.', file: 'Chemistry.pdf' },
  'grade1-04': { title: 'الاحياء — الصف الأول', subject: 'احياء', description: 'كتاب الاحياء للصف الاول ثانوي مقرر جديد كليا.', file: 'Pio1.pdf' },
  
  'grade2-01': { title: 'العلوم الهندسية — الصف الثاني', subject: 'الهندسية', description: 'كتاب العلوم الهندسية للصف الثاني مقرر جديد كليا.', file: 'PDF8.pdf' },
  'grade2-02': { title: 'الرياضيات — الصف الثاني', subject: 'الرياضيات', description: 'كتاب العلوم الرياضيات للصف الثاني مقرر جديد كليا.', file: 'PDF9.pdf' },
  'grade2-03': { title: 'اللغة العربية — الصف الثاني', subject: 'اللغة العربية', description: 'كتاب اللغة العربية للصف الثاني مقرر جديد كليا.', file: 'PDF10.pdf' },

  'grade3-eng-01': {
    title: 'العلوم الهندسية',
    subject: 'الهندسية',
    description: 'العلوم الهندسية - كتاب مدرسي قومي',
    file: 'engineering.pdf'
  },

  'grade3-eng-02': {
    title: 'اللغة الانجليزية',
    subject: 'الهندسية',
    description: 'معظم الناس عندها عقدة من الانجليزي لكن هنا تجد الحل',
    file: 'English.pdf'
  },

  'grade3-eng-03': {
    title: 'الرياضيات المتخصصة',
    subject: 'مشترك',
    description: 'الرياضيات ممارسة وليست حفظ',
    file: 'mathematics-specialized.pdf'
  },

  'grade3-eng-04': {
    title: 'الرياضيات الاساسية',
    subject: 'مشترك',
    description: 'رياضيات اساسية ومتعة',
    file: 'mathematics-basic.pdf'
  },

  'grade3-eng-05': {
    title: 'الفيزياء',
    subject: 'مشترك',
    description: 'تعلم كيف تجري الحياة حولك بقوانينها',
    file: 'physics.pdf'
  },

  'reference-01': {
    title: 'grammar - اللغة الانجليزية',
    kind: 'مذكرة',
    subject: 'اللغة الانجليزية',
    description: 'اساسيات اللغة الانجليزية بين يديك وفي مكان واحد',
    file: 'grammar.pdf'
  },

  'reference-02': {
    title: 'التفاضل - الرياضيات المتخصصة',
    kind: 'مذكرة',
    subject: 'الرياضيات المتخصصة',
    description: 'تعلم اشتقاق الدوال بسهولة وسرعة',
    file: 'PDF6.pdf'
  },

  'reference-03': {
    title: 'التكامل - الرياضيات المتخصصة',
    kind: 'مذكرة',
    subject: 'الرياضيات المتخصص',
    description: 'التكامل هو عملية عكسية للتفاضل',
    file: 'PDF5.pdf'
  },

  'reference-04': {
    title: 'الدائرة - الرياضيات المتخصصة',
    kind: 'مذكرة',
    subject: 'الرياضيات المتخصصة',
    description: 'الدائرة بشرح مبسط وانيق',
    file: 'PDF2.pdf'
  },

  'reference-05': {
    title: 'التباديل والتوافيق - الرياضيات الاساسية',
    kind: 'مذكرة',
    subject: 'الرياضيات الاساسية',
    description: 'تعلم حيل التباديل والتوافيق باأدق صورها ',
    file: 'PDF1.pdf'
  },

  'reference-06': {
    title: 'الدوال والنهايات - الرياضيات المتخصصة',
    kind: 'مذكرة',
    subject: 'الرياضيات المتخصصة',
    description: 'الدوال والنهايات - شرح مثالي',
    file: 'PDF3.pdf'
  },

  'reference-07': {
    title: 'الاحصاء - الرياضيات الاساسية',
    kind: 'مذكرة',
    subject: 'الرياضيات الاساسية',
    description: 'تعرف على تاثير الاحصاء في حياتنا اليومية',
    file: 'PDF4.pdf'
  }
};
Object.entries(LIBRARY_OVERRIDES).forEach(([id, changes]) => {
  const item = LIBRARY_ITEMS.find(entry => entry.id === id);
  if (item) Object.assign(item, changes);
});

// أضف صور الأنشطة بإدخال مسار الصورة في image، مثل: assets/images/science-day.jpg
// اترك image فارغاً ليظهر مكان الصورة الفارغ دون صور افتراضية.
const ACTIVITIES = [
  { title: 'الفعاليات المدرسية', description: 'أضف صور مناسبات المدرسة وفعالياتها.', image: '1792596527395.jpg', alt: 'صور الفعاليات المدرسية' },
  { title: 'الأنشطة العلمية', description: 'أضف صور المعارض والتجارب والأنشطة العلمية.', image: '1792596527395.jpg', alt: 'صور الأنشطة العلمية' },
  { title: 'الأنشطة الرياضية', description: 'أضف صور المنافسات والفرق الرياضية.', image: '1792596527395.jpg', alt: 'صور الأنشطة الرياضية' },
  { title: 'الرحلات المدرسية', description: 'أضف صور الرحلات والزيارات التعليمية.', image: '1792596527395.jpg', alt: 'صور الرحلات المدرسية' },
  { title: 'المبادرات الطلابية', description: 'أضف صور المبادرات والعمل الجماعي.', image: '1792596527395.jpg', alt: 'صور المبادرات الطلابية' },
  { title: 'المناسبات الوطنية', description: 'أضف صور الاحتفالات والمشاركات الوطنية.', image: '1792596527395.jpg', alt: 'صور المناسبات الوطنية' }
];

// لوحة الشرف: غيّر الاسم والصف والإنجاز، وأضف عناصر جديدة عند الحاجة.
const HONOR_STUDENTS = [
  { name: 'اسم الطالب المتفوق', grade: 'الصف / الفصل', achievement: 'أضف نوع التفوق أو الإنجاز' },
  { name: 'اسم الطالب المتفوق', grade: 'الصف / الفصل', achievement: 'أضف نوع التفوق أو الإنجاز' },
  { name: 'اسم الطالب المتفوق', grade: 'الصف / الفصل', achievement: 'أضف نوع التفوق أو الإنجاز' },
  { name: 'اسم الطالب المتفوق', grade: 'الصف / الفصل', achievement: 'أضف نوع التفوق أو الإنجاز' },
  { name: 'اسم الطالب المتفوق', grade: 'الصف / الفصل', achievement: 'أضف نوع التفوق أو الإنجاز' },
  { name: 'اسم الطالب المتفوق', grade: 'الصف / الفصل', achievement: 'أضف نوع التفوق أو الإنجاز' },
  { name: 'اسم الطالب المتفوق', grade: 'الصف / الفصل', achievement: 'أضف نوع التفوق أو الإنجاز' },
  { name: 'اسم الطالب المتفوق', grade: 'الصف / الفصل', achievement: 'أضف نوع التفوق أو الإنجاز' }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function showToast(title, message, icon = 'fa-circle-info') {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i><div><strong>${escapeHTML(title)}</strong><p>${escapeHTML(message)}</p></div>`;
  container.appendChild(toast);
  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    window.setTimeout(() => toast.remove(), 260);
  }, 4200);
}

function configureTheme() {
  const saved = localStorage.getItem('jadida-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
  const updateIcon = () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    $$('.theme-toggle').forEach(button => {
      button.innerHTML = `<i class="fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>`;
      button.setAttribute('aria-label', isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع المظلم');
      button.title = isDark ? 'الوضع الفاتح' : 'الوضع المظلم';
    });
  };
  updateIcon();
  $$('.theme-toggle').forEach(button => button.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('jadida-theme', document.documentElement.dataset.theme);
    updateIcon();
  }));
}

function configureNavigation() {
  const currentPage = document.body.dataset.page || 'home';
  $$('[data-nav]').forEach(link => {
    if (link.dataset.nav === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
  const toggle = $('.menu-toggle');
  const menu = $('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.innerHTML = `<i class="fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}" aria-hidden="true"></i>`;
    });
    $$('.mobile-menu a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    }));
    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      }
    });
  }
}

function configureScrollEffects() {
  const progress = $('.page-progress span');
  const backTop = $('.back-top');
  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0}%`;
    if (backTop) backTop.classList.toggle('visible', scrollTop > 450);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    $$('.reveal').forEach(element => observer.observe(element));
  } else {
    $$('.reveal').forEach(element => element.classList.add('is-visible'));
  }
}

function renderAnnouncements() {
  const track = $('.ticker-track');
  if (!track) return;
  const make = item => `<span class="ticker-item"><i class="fa-solid ${escapeHTML(item.icon)}" aria-hidden="true"></i>${escapeHTML(item.text)}</span>`;
  track.innerHTML = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map(make).join('');
}

function renderStats() {
  const grid = $('#statsGrid');
  if (!grid) return;
  grid.innerHTML = SCHOOL_CONFIG.stats.map(stat => `
    <article class="stat-card reveal">
      <div class="card-icon"><i class="fa-solid ${escapeHTML(stat.icon)}" aria-hidden="true"></i></div>
      <div class="stat-number">${escapeHTML(stat.number)}</div>
      <div class="stat-label">${escapeHTML(stat.label)}</div>
      <div class="stat-note">${escapeHTML(stat.note)}</div>
    </article>`).join('');
  observeNewReveals(grid);
}

function observeNewReveals(root = document) {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal', root).forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
  $$('.reveal:not(.is-visible)', root).forEach(el => observer.observe(el));
}

function renderLibrary() {
  const grid = $('#libraryGrid');
  if (!grid) return;
  const pills = $$('.filter-pill[data-filter]');
  const search = $('#librarySearch');
  const typeSelect = $('#libraryType');
  const countLabel = $('#libraryCount');
  const streamSelect = $('#streamFilter');
  let currentFilter = 'grade1';

  const filterGroups = {
    grade1: item => item.id.startsWith('grade1-'),
    grade2: item => item.id.startsWith('grade2-'),
    'third-engineering': item => item.id.startsWith('grade3-eng-'),
    'third-science': item => item.id.startsWith('grade3-science-'),
    'third-literary': item => item.id.startsWith('grade3-literary-'),
    references: item => item.id.startsWith('reference-')
  };
  const iconFor = item => {
    if (item.kind === 'امتحان سابق') return 'fa-file-circle-check';
    if (item.kind === 'مذكرة') return 'fa-file-lines';
    if (item.kind === 'مرجع') return 'fa-book-bookmark';
    if (item.kind === 'ملخص') return 'fa-note-sticky';
    return 'fa-book-open';
  };
  const renderCard = item => {
    const hasFile = Boolean(item.file && item.file.trim());
    const fileAttr = hasFile ? `href="${escapeHTML(item.file)}"` : 'href="#"';
    const download = hasFile
      ? `<a class="btn btn-primary btn-small" href="${escapeHTML(item.file)}" download><i class="fa-solid fa-download"></i> تحميل PDF</a>`
      : `<button class="btn btn-primary btn-small" type="button" data-needs-file="${escapeHTML(item.id)}"><i class="fa-solid fa-download"></i> تحميل PDF</button>`;
    const preview = `<button class="btn btn-outline btn-small" type="button" data-preview-id="${escapeHTML(item.id)}" ${hasFile ? `data-file="${escapeHTML(item.file)}"` : ''}><i class="fa-regular fa-eye"></i> معاينة</button>`;
    return `<article class="book-card glass-card reveal">
      <div class="book-cover"><span class="book-num">${escapeHTML(item.id.split('-').slice(-1)[0])}</span><span class="book-kind">${escapeHTML(item.kind)}</span><i class="fa-solid ${iconFor(item)}" aria-hidden="true"></i></div>
      <div class="book-info">
        <h3>${escapeHTML(item.title)}</h3>
        <div class="book-meta"><span class="meta-tag">${escapeHTML(item.grade)}</span>${item.stream ? `<span class="meta-tag">${escapeHTML(item.stream)}</span>` : ''}</div>
        <p>${escapeHTML(item.description)}</p>
        <div class="book-actions">${download}${preview}</div>
      </div>
    </article>`;
  };
  const update = () => {
    const query = (search?.value || '').trim().toLocaleLowerCase('ar');
    const kind = typeSelect?.value || 'all';
    const filtered = LIBRARY_ITEMS.filter(item => {
      const inGroup = (filterGroups[currentFilter] || (() => true))(item);
      const matchesType = kind === 'all' || item.kind === kind || (kind === 'book' && item.id.startsWith('grade'));
      const haystack = `${item.title} ${item.description} ${item.grade} ${item.stream} ${item.subject} ${item.kind}`.toLocaleLowerCase('ar');
      const matchesSearch = !query || haystack.includes(query);
      return inGroup && matchesType && matchesSearch;
    });
    grid.innerHTML = filtered.length ? filtered.map(renderCard).join('') : `<div class="empty-state glass-card"><div class="card-icon"><i class="fa-solid fa-magnifying-glass"></i></div><h3>لا توجد نتائج مطابقة</h3><p>جرّب كلمة أخرى أو غيّر تصنيف المكتبة.</p></div>`;
    if (countLabel) countLabel.textContent = `عرض ${filtered.length} من ${LIBRARY_ITEMS.length} ملفاً وخانة`; 
    observeNewReveals(grid);
  };
  pills.forEach(pill => pill.addEventListener('click', () => {
    pills.forEach(other => other.classList.toggle('active', other === pill));
    currentFilter = pill.dataset.filter;
    if (streamSelect) {
      const isThird = currentFilter.startsWith('third-');
      streamSelect.value = isThird ? currentFilter : 'all';
      streamSelect.disabled = !isThird;
    }
    update();
  }));
  streamSelect?.addEventListener('change', () => {
    const value = streamSelect.value;
    if (value !== 'all') {
      currentFilter = value;
      pills.forEach(pill => pill.classList.toggle('active', pill.dataset.filter === value));
    } else if (currentFilter.startsWith('third-')) {
      currentFilter = 'grade1';
      pills.forEach(pill => pill.classList.toggle('active', pill.dataset.filter === currentFilter));
    }
    update();
  });
  search?.addEventListener('input', update);
  typeSelect?.addEventListener('change', update);

  grid.addEventListener('click', event => {
    const downloadBtn = event.target.closest('[data-needs-file]');
    if (downloadBtn) {
      const item = LIBRARY_ITEMS.find(entry => entry.id === downloadBtn.dataset.needsFile);
      showToast('الملف غير مضاف بعد', `أضف رابط PDF لخانة «${item?.title || 'الملف'}» في assets/js/app.js، ثم ضع ملف PDF داخل مجلد assets/pdfs.`, 'fa-file-circle-exclamation');
      return;
    }
    const previewBtn = event.target.closest('[data-preview-id]');
    if (previewBtn) {
      const item = LIBRARY_ITEMS.find(entry => entry.id === previewBtn.dataset.previewId);
      if (previewBtn.dataset.file) openPreview(previewBtn.dataset.file, item?.title || 'معاينة الملف');
      else showToast('المعاينة غير متاحة بعد', 'أضف رابط ملف PDF في بيانات هذا العنصر داخل app.js لتفعيل المعاينة والتحميل.', 'fa-eye-slash');
    }
  });
  update();
}

function openPreview(file, title) {
  let modal = $('#documentModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'documentModal';
    modal.className = 'document-modal';
    modal.innerHTML = `<div class="document-modal-backdrop" data-close-modal></div><section class="document-modal-panel" role="dialog" aria-modal="true" aria-labelledby="documentModalTitle"><header><h2 id="documentModalTitle"></h2><button class="icon-btn" type="button" data-close-modal aria-label="إغلاق المعاينة"><i class="fa-solid fa-xmark"></i></button></header><iframe title="معاينة مستند PDF" src="about:blank"></iframe><footer><a class="btn btn-primary btn-small" target="_blank" rel="noopener" data-modal-open><i class="fa-solid fa-arrow-up-right-from-square"></i> فتح الملف</a><button class="btn btn-outline btn-small" type="button" data-close-modal>إغلاق</button></footer></section>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', event => {
      if (event.target.closest('[data-close-modal]')) {
        modal.classList.remove('open');
        $('iframe', modal).src = 'about:blank';
        document.body.classList.remove('modal-open');
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open'); $('iframe', modal).src = 'about:blank'; document.body.classList.remove('modal-open');
      }
    });
  }
  $('#documentModalTitle', modal).textContent = title;
  $('iframe', modal).src = file;
  $('[data-modal-open]', modal).href = file;
  modal.classList.add('open');
  document.body.classList.add('modal-open');
}

function renderActivities() {
  const gallery = $('#activitiesGrid');
  if (gallery) {
    gallery.innerHTML = ACTIVITIES.map((item, index) => `
      <article class="gallery-card glass-card reveal">
        <div class="gallery-image-slot" ${item.image ? '' : 'aria-label="مساحة فارغة لإضافة صورة"'}>
          ${item.image ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.alt)}" loading="lazy">` : `<div class="slot-content"><i class="fa-regular fa-images" aria-hidden="true"></i><span>مساحة الصورة ${String(index + 1).padStart(2, '0')}</span></div>`}
        </div>
        <div class="gallery-card-body"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></div>
      </article>`).join('');
    observeNewReveals(gallery);
  }
  const honor = $('#honorGrid');
  if (honor) {
    honor.innerHTML = HONOR_STUDENTS.map((student, index) => `
      <article class="honor-card glass-card reveal"><span class="honor-rank">${String(index + 1).padStart(2, '0')}</span><div class="honor-avatar"><i class="fa-solid fa-award" aria-hidden="true"></i></div><h3>${escapeHTML(student.name)}</h3><p>${escapeHTML(student.grade)}</p><p>${escapeHTML(student.achievement)}</p></article>`).join('');
    observeNewReveals(honor);
  }
}

function contactValue(value, fallback = 'يُضاف من ملف app.js') {
  return value && value.trim() ? escapeHTML(value.trim()) : fallback;
}
function configureContact() {
  const phoneText = $('#schoolPhoneText');
  if (phoneText) phoneText.textContent = SCHOOL_CONFIG.phone ? SCHOOL_CONFIG.phone : 'أضف رقم الهاتف في app.js';
  const emailText = $('#schoolEmailText');
  if (emailText) emailText.textContent = SCHOOL_CONFIG.email ? SCHOOL_CONFIG.email : 'أضف البريد الرسمي في app.js';
  const socialText = $('#socialAccountsText');
  if (socialText) socialText.textContent = (SCHOOL_CONFIG.facebook || SCHOOL_CONFIG.tiktok) ? 'تابعوا حسابات المدرسة الرسمية.' : 'روابط فيسبوك وتيك توك قابلة للإضافة في app.js.';

  // روابط الاتصال وواتساب؛ لا يظهر رابط وهمي إذا لم تتم إضافة الرقم.
  $$('[data-contact-link]').forEach(link => {
    const key = link.dataset.contactLink;
    const value = SCHOOL_CONFIG[key];
    if (value && value.trim()) {
      if (key === 'phone') link.href = `tel:${value.replace(/[^+\d]/g, '')}`;
      else if (key === 'whatsapp') link.href = `https://wa.me/${value.replace(/\D/g, '')}`;
      else if (key === 'email') link.href = `mailto:${value.trim()}`;
      else link.href = value;
      link.target = ['phone', 'whatsapp', 'email'].includes(key) ? '_self' : '_blank';
      link.rel = 'noopener';
      link.classList.remove('needs-config');
    } else {
      link.href = '#';
      link.classList.add('needs-config');
      link.addEventListener('click', event => {
        event.preventDefault();
        showToast('الرابط غير مضاف', 'أضف بيانات وسيلة التواصل في SCHOOL_CONFIG أعلى ملف assets/js/app.js.', 'fa-gear');
      });
    }
  });

  $$('[data-map-link]').forEach(link => {
    link.href = SCHOOL_CONFIG.mapUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const form = $('#contactForm');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const topic = String(formData.get('topic') || 'استفسار عام').trim();
    const message = String(formData.get('message') || '').trim();
    if (!name || !message) {
      showToast('أكمل الحقول المطلوبة', 'الاسم والرسالة مطلوبان لإرسال الاستفسار.', 'fa-circle-exclamation');
      return;
    }
    if (!SCHOOL_CONFIG.email || !SCHOOL_CONFIG.email.trim()) {
      showToast('النموذج جاهز للربط', 'لإرسال الرسائل فعلياً، أضف البريد الرسمي داخل SCHOOL_CONFIG في app.js أو اربط النموذج بخدمة خلفية.', 'fa-envelope-open-text');
      return;
    }
    const subject = encodeURIComponent(`استفسار من موقع المدرسة: ${topic}`);
    const body = encodeURIComponent(`الاسم: ${name}\nرقم الهاتف: ${phone || 'غير مذكور'}\nالموضوع: ${topic}\n\nالرسالة:\n${message}`);
    window.location.href = `mailto:${SCHOOL_CONFIG.email}?subject=${subject}&body=${body}`;
    showToast('تم تجهيز الرسالة', 'سيفتح تطبيق البريد لديك لإرسال الاستفسار.', 'fa-paper-plane');
    form.reset();
  });
}

function configureFooter() {
  const year = $('#currentYear');
  if (year) year.textContent = new Date().getFullYear();
  const footerSocial = $('#footerSocial');
  if (!footerSocial) return;
  const socials = [
    { key: 'facebook', icon: 'fa-facebook-f', label: 'فيسبوك' },
    { key: 'tiktok', icon: 'fa-tiktok', label: 'تيك توك' }
  ];
  footerSocial.innerHTML = socials.map(social => {
    const link = SCHOOL_CONFIG[social.key];
    return link && link.trim()
      ? `<a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer" aria-label="${social.label}"><i class="fa-brands ${social.icon}"></i></a>`
      : `<a href="#" data-social-placeholder="${social.key}" aria-label="إضافة رابط ${social.label}" title="أضف رابط ${social.label}"><i class="fa-brands ${social.icon}"></i></a>`;
  }).join('');
  footerSocial.addEventListener('click', event => {
    const link = event.target.closest('[data-social-placeholder]');
    if (!link) return;
    event.preventDefault();
    showToast('الحساب غير مضاف', 'أدخل رابط الحساب في SCHOOL_CONFIG داخل app.js.', 'fa-link');
  });
}

// عنوان المتصفح، إذا رغبت بتغييره لموقع مخصص باسم المدرسة.
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-ready');
  configureTheme();
  configureNavigation();
  configureScrollEffects();
  renderAnnouncements();
  renderStats();
  renderLibrary();
  renderActivities();
  configureContact();
  configureFooter();
});
