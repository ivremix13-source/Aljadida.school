/* =========================================================
   المدرسة الجديدة النموذجية بنين — بوابة تجريبية
   الكتب تحفظ في IndexedDB على المتصفح الحالي فقط.
   لا تستخدم هذا النموذج بوصفه نظام إنتاج قبل إضافة خادم آمن.
========================================================= */
'use strict';

const STORAGE_KEY = 'jadida_students_v2';
const DATABASE_NAME = 'jadida_school_portal_db';
const DATABASE_VERSION = 1;
const MAX_PDF_SIZE = 25 * 1024 * 1024;
const CURRENT_YEAR = new Date().getFullYear();

const BOOK_SLOTS = [
  { slot: 1, title: 'الرياضيات المتخصصة', track: 'علمي هندسي' },
  { slot: 2, title: 'الرياضيات الأساسية', track: 'علمي أحياء' },
  { slot: 3, title: 'الفيزياء', track: 'all' },
  { slot: 4, title: 'الكيمياء', track: 'all' },
  { slot: 5, title: 'الأحياء', track: 'علمي أحياء' },
  { slot: 6, title: 'الهندسة', track: 'علمي هندسي' },
  { slot: 7, title: 'اللغة العربية', track: 'all' },
  { slot: 8, title: 'مقرر إضافي — يحدده المشرف', track: 'all' }
];

const TRACK_OPTIONS = [
  { value: 'all', label: 'كافة الطلاب' },
  { value: 'علمي هندسي', label: 'علمي هندسي' },
  { value: 'علمي أحياء', label: 'علمي أحياء' }
];

let currentStudent = null;
let databasePromise = null;
let activeObjectUrls = [];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function normalizePhone(value) {
  return String(value || '').replace(/[^\d+]/g, '').trim();
}

function formatFileSize(size) {
  if (!Number.isFinite(size) || size <= 0) return 'حجم غير معروف';
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} كيلوبايت`;
  return `${(size / (1024 * 1024)).toFixed(1)} ميجابايت`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('ar-SD', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

function showToast(message, type = 'info', duration = 3800) {
  const region = $('#toastRegion');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : ''}`;
  const icon = document.createElement('i');
  icon.className = type === 'error' ? 'fa-solid fa-circle-exclamation' : type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info';
  const text = document.createElement('span');
  text.textContent = message;
  toast.append(icon, text);
  region.append(toast);
  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-8px)';
    window.setTimeout(() => toast.remove(), 260);
  }, duration);
}

function getStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('تعذر قراءة طلبات الطلاب من المتصفح:', error);
    return [];
  }
}

function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return true;
  } catch (error) {
    console.error('تعذر حفظ طلبات الطلاب:', error);
    showToast('تعذر حفظ الطلب في المتصفح. قد تكون مساحة التخزين غير متاحة.', 'error');
    return false;
  }
}

async function hashPassword(password) {
  if (!window.crypto?.subtle || !window.TextEncoder) {
    throw new Error('تعذر تشغيل التشفير في هذا السياق. افتح المشروع عبر خادم محلي مثل Live Server في VS Code.');
  }
  const encoded = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', encoded);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function makeStudentId(track, existingStudents) {
  const tag = track === 'علمي هندسي' ? 'ENG' : 'BIO';
  let id = '';
  do {
    const randomPart = window.crypto?.getRandomValues
      ? window.crypto.getRandomValues(new Uint32Array(1))[0].toString(10).slice(0, 6).padStart(6, '0')
      : Math.floor(100000 + Math.random() * 900000).toString();
    id = `JAD-${CURRENT_YEAR}-G3-${tag}-${randomPart}`;
  } while (existingStudents.some((student) => student.id === id));
  return id;
}

function openDatabase() {
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('المتصفح لا يدعم مساحة حفظ ملفات الكتب. جرّب متصفحًا أحدث.'));
  }
  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('books')) {
        database.createObjectStore('books', { keyPath: 'slot' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      databasePromise = null;
      reject(request.error || new Error('تعذر فتح مخزن الكتب.'));
    };
    request.onblocked = () => {
      databasePromise = null;
      reject(new Error('تعذر فتح مخزن الكتب بسبب تبويب آخر. أغلق النسخ الأخرى من البوابة وحاول مجددًا.'));
    };
  });
  return databasePromise;
}

async function getAllBooks() {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('books', 'readonly');
    const request = transaction.objectStore('books').getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error || new Error('تعذر قراءة ملفات الكتب.'));
  });
}

async function getBook(slot) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('books', 'readonly');
    const request = transaction.objectStore('books').get(Number(slot));
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error || new Error('تعذر قراءة بيانات الكتاب.'));
  });
}

async function putBook(book) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('books', 'readwrite');
    transaction.objectStore('books').put(book);
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error || new Error('تعذر حفظ الكتاب.'));
    transaction.onabort = () => reject(transaction.error || new Error('أُلغي حفظ الكتاب. قد تكون مساحة التخزين غير كافية.'));
  });
}

async function removeBook(slot) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('books', 'readwrite');
    transaction.objectStore('books').delete(Number(slot));
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error || new Error('تعذر حذف الكتاب.'));
  });
}

function revokeBookUrls() {
  activeObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  activeObjectUrls = [];
}

function createBookUrl(blob) {
  const url = URL.createObjectURL(blob);
  activeObjectUrls.push(url);
  return url;
}

function switchRoute(route) {
  const allowedRoutes = ['home', 'schedule', 'guide', 'register', 'login', 'dashboard', 'admin'];
  if (!allowedRoutes.includes(route)) route = 'home';
  if (route === 'dashboard' && !currentStudent) route = 'login';

  $$('.page-section').forEach((section) => { section.hidden = section.id !== `section-${route}`; });
  $$('.main-nav [data-route]').forEach((button) => {
    button.classList.toggle('active', button.dataset.route === route);
  });

  $('#mobileNav').hidden = true;
  $('#mobileMenuToggle').setAttribute('aria-expanded', 'false');
  $('#mobileMenuToggle').innerHTML = '<i class="fa-solid fa-bars"></i>';
  document.body.classList.remove('menu-open');
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  if (route === 'dashboard') renderStudentDashboard();
  if (route === 'admin') renderAdminDashboard();
  if (route === 'register') {
    $('#registrationForm').hidden = false;
    $('#registerResponseCard').hidden = true;
  }
  if (route === 'login') $('#loginError').hidden = true;
}

function updateDate() {
  const dateElement = $('#todayDate');
  if (dateElement) {
    dateElement.textContent = new Intl.DateTimeFormat('ar-SD', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
  }
  $('#copyrightYear').textContent = CURRENT_YEAR;
}

function createElement(tag, className, textContent) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent !== undefined && textContent !== null) element.textContent = textContent;
  return element;
}

async function handleRegistration(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = $('#appStudentName').value.trim().replace(/\s+/g, ' ');
  const track = $('#appStudentTrack').value;
  const phone = normalizePhone($('#appStudentPhone').value);
  const password = $('#appStudentPass').value;
  const consent = $('#registrationConsent').checked;

  if (name.split(' ').filter(Boolean).length < 4) {
    showToast('يرجى كتابة الاسم الرباعي كاملًا.', 'error');
    $('#appStudentName').focus();
    return;
  }
  if (phone.replace(/\D/g, '').length < 7) {
    showToast('يرجى إدخال رقم هاتف صحيح.', 'error');
    $('#appStudentPhone').focus();
    return;
  }
  if (password.length < 8) {
    showToast('كلمة المرور يجب ألا تقل عن 8 أحرف أو أرقام.', 'error');
    $('#appStudentPass').focus();
    return;
  }
  if (!consent) {
    showToast('يرجى تأكيد صحة البيانات وفهم طبيعة النسخة التجريبية.', 'error');
    return;
  }

  const students = getStudents();
  const duplicatePhone = students.some((student) => normalizePhone(student.phone) === phone);
  if (duplicatePhone) {
    showToast('رقم الهاتف مسجل من قبل في هذا المتصفح. استخدم رقمًا آخر أو انتقل إلى تسجيل الدخول.', 'error', 5000);
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalMarkup = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>جاري تجهيز الطلب...</span>';

  try {
    const passwordHash = await hashPassword(password);
    const id = makeStudentId(track, students);
    const newStudent = {
      id,
      name,
      track,
      phone,
      passwordHash,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    if (!saveStudents([...students, newStudent])) return;

    $('#appGeneratedId').textContent = id;
    $('#registrationForm').hidden = true;
    $('#registerResponseCard').hidden = false;
    $('#copyStudentId').dataset.copyValue = id;
    $('#appStudentPass').value = '';
    showToast('تم حفظ طلبك التجريبي. احتفظ برقم القيد.', 'success');
  } catch (error) {
    showToast(error.message || 'تعذر إنشاء الطلب. حاول مرة أخرى.', 'error', 5000);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalMarkup;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const idInput = $('#loginIdInput').value.trim();
  const password = $('#loginPassInput').value;
  const errorBox = $('#loginError');
  errorBox.hidden = true;

  if (!idInput || !password) {
    errorBox.textContent = 'أدخل رقم القيد أو الهاتف وكلمة المرور.';
    errorBox.hidden = false;
    return;
  }

  try {
    const passwordHash = await hashPassword(password);
    const normalizedId = idInput.toLocaleLowerCase();
    const normalizedPhone = normalizePhone(idInput);
    const student = getStudents().find((record) => {
      const matchesId = String(record.id || '').toLocaleLowerCase() === normalizedId;
      const matchesPhone = normalizePhone(record.phone) === normalizedPhone;
      return (matchesId || matchesPhone) && record.passwordHash === passwordHash;
    });

    if (!student) {
      errorBox.textContent = 'بيانات الدخول غير صحيحة، أو أن الطلب أُنشئ على متصفح آخر. تحقق من رقم القيد وكلمة المرور.';
      errorBox.hidden = false;
      return;
    }

    currentStudent = student;
    $('#loginPassInput').value = '';
    switchRoute('dashboard');
    showToast('تم تسجيل الدخول إلى البوابة المحلية بنجاح.', 'success');
  } catch (error) {
    errorBox.textContent = error.message || 'تعذر تسجيل الدخول. حاول مرة أخرى.';
    errorBox.hidden = false;
  }
}

async function renderStudentDashboard() {
  if (!currentStudent) return;
  // تحديث حالة الطالب بعد أي تغيير محلي من لوحة الإدارة.
  const latestStudent = getStudents().find((student) => student.id === currentStudent.id);
  if (latestStudent) currentStudent = latestStudent;

  $('#studentProfileName').textContent = currentStudent.name;
  $('#studentProfileId').textContent = currentStudent.id;
  $('#studentTrackBadge').textContent = currentStudent.track;
  const statusPanel = $('.student-status-panel');
  const statusIcon = $('#studentStatusIcon');
  const statusBadge = $('#studentStatusBadge');
  const statusDescription = $('#statusDescription');
  const approved = currentStudent.status === 'approved';
  statusPanel.classList.toggle('is-approved', approved);
  statusIcon.innerHTML = approved ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-regular fa-clock"></i>';
  statusBadge.textContent = approved ? 'مقبول ومفعل' : 'في انتظار المراجعة';
  statusDescription.textContent = approved
    ? 'تم اعتماد طلبك في سجل هذه النسخة المحلية.'
    : 'طلبك محفوظ في هذه النسخة المحلية بانتظار مراجعة الإدارة.';

  await renderStudentBooks(currentStudent.track);
}

async function renderStudentBooks(track) {
  const container = $('#studentBooksContainer');
  revokeBookUrls();
  container.replaceChildren();
  let savedBooks = [];
  try {
    savedBooks = await getAllBooks();
  } catch (error) {
    container.append(createEmptyState(error.message || 'تعذر تحميل الكتب من مساحة التخزين المحلية.'));
    $('#availableBooksCount').textContent = '0';
    return;
  }
  const bookMap = new Map(savedBooks.map((book) => [Number(book.slot), book]));
  let availableCount = 0;

  BOOK_SLOTS.forEach((slotInfo) => {
    const saved = bookMap.get(slotInfo.slot);
    const title = saved?.title || slotInfo.title;
    const assignedTrack = saved?.track || slotInfo.track;
    const allowed = assignedTrack === 'all' || assignedTrack === track;
    const hasFile = Boolean(saved?.blob && allowed);
    if (hasFile) availableCount += 1;

    const card = createElement('article', 'student-book-card');
    const top = createElement('div', 'book-card-top');
    const icon = createElement('span', 'pdf-icon');
    icon.innerHTML = '<i class="fa-solid fa-file-pdf"></i>';
    const slotLabel = createElement('span', 'book-slot-label', `BOOK / ${String(slotInfo.slot).padStart(2, '0')}`);
    top.append(icon, slotLabel);
    const heading = createElement('h3', '', title);
    const trackLabel = createElement('span', 'book-track-label', assignedTrack === 'all' ? 'مقرر مشترك' : assignedTrack);
    const footer = createElement('div', 'book-card-footer');
    const status = createElement('span', `file-status ${hasFile ? 'is-ready' : ''}`);
    status.innerHTML = hasFile ? '<i class="fa-solid fa-circle-check"></i><span>الملف متاح</span>' : allowed ? '<i class="fa-regular fa-circle"></i><span>لم يُرفع بعد</span>' : '<i class="fa-solid fa-lock"></i><span>لمسار آخر</span>';
    const actions = createElement('div', 'book-actions');

    if (hasFile) {
      const url = createBookUrl(saved.blob);
      const openLink = createElement('a', 'book-action');
      openLink.href = url;
      openLink.target = '_blank';
      openLink.rel = 'noopener noreferrer';
      openLink.title = 'قراءة ملف PDF';
      openLink.setAttribute('aria-label', `قراءة ${title}`);
      openLink.innerHTML = '<i class="fa-solid fa-eye"></i>';
      const downloadLink = createElement('a', 'book-action');
      downloadLink.href = url;
      downloadLink.download = saved.fileName || `${title}.pdf`;
      downloadLink.title = 'تنزيل الكتاب';
      downloadLink.setAttribute('aria-label', `تنزيل ${title}`);
      downloadLink.innerHTML = '<i class="fa-solid fa-download"></i>';
      actions.append(openLink, downloadLink);
    } else {
      const disabledOpen = createElement('span', 'book-action disabled');
      disabledOpen.title = 'لا يوجد ملف متاح';
      disabledOpen.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
      const disabledDownload = createElement('span', 'book-action disabled');
      disabledDownload.title = 'لا يوجد ملف متاح';
      disabledDownload.innerHTML = '<i class="fa-solid fa-download"></i>';
      actions.append(disabledOpen, disabledDownload);
    }

    footer.append(status, actions);
    card.append(top, heading, trackLabel, footer);
    container.append(card);
  });
  $('#availableBooksCount').textContent = String(availableCount);
}

function createEmptyState(message, icon = 'fa-folder-open') {
  const state = createElement('div', 'empty-state');
  state.innerHTML = `<i class="fa-solid ${icon}"></i>`;
  const text = createElement('span', '', message);
  state.append(text);
  return state;
}

function buildTrackSelect(selectedValue, id) {
  const select = createElement('select');
  select.id = id;
  TRACK_OPTIONS.forEach((option) => {
    const item = createElement('option', '', option.label);
    item.value = option.value;
    item.selected = option.value === selectedValue;
    select.append(item);
  });
  return select;
}

async function renderAdminBooks() {
  const container = $('#adminBooksContainer');
  container.replaceChildren();
  let savedBooks = [];
  try {
    savedBooks = await getAllBooks();
  } catch (error) {
    container.append(createEmptyState(error.message || 'تعذر فتح مخزن الكتب في هذا المتصفح.', 'fa-triangle-exclamation'));
    return;
  }
  const bookMap = new Map(savedBooks.map((book) => [Number(book.slot), book]));

  BOOK_SLOTS.forEach((slotInfo) => {
    const saved = bookMap.get(slotInfo.slot);
    const card = createElement('article', 'admin-book-card');
    card.dataset.bookSlot = String(slotInfo.slot);

    const top = createElement('div', 'admin-book-top');
    const pdfIcon = createElement('span', 'pdf-icon');
    pdfIcon.innerHTML = '<i class="fa-solid fa-file-pdf"></i>';
    const titleWrap = createElement('div', 'admin-book-title');
    titleWrap.append(createElement('span', 'book-slot-label', `UPLOAD SLOT / ${String(slotInfo.slot).padStart(2, '0')}`));
    const topTitle = createElement('h3', '', saved?.title || slotInfo.title);
    titleWrap.append(topTitle);
    const state = createElement('span', `admin-book-state ${saved?.blob ? 'is-ready' : ''}`, saved?.blob ? 'تم الرفع' : 'بانتظار الملف');
    top.append(pdfIcon, titleWrap, state);

    const fields = createElement('div', 'admin-book-fields');
    const titleField = createElement('div', 'admin-field');
    const titleLabel = createElement('label', '', 'اسم المقرر');
    titleLabel.htmlFor = `book-title-${slotInfo.slot}`;
    const titleInput = createElement('input');
    titleInput.type = 'text';
    titleInput.id = `book-title-${slotInfo.slot}`;
    titleInput.maxLength = 90;
    titleInput.value = saved?.title || slotInfo.title;
    titleInput.required = true;
    titleInput.autocomplete = 'off';
    titleField.append(titleLabel, titleInput);

    const trackField = createElement('div', 'admin-field');
    const trackLabel = createElement('label', '', 'الفئة المستهدفة');
    trackLabel.htmlFor = `book-track-${slotInfo.slot}`;
    const trackSelect = buildTrackSelect(saved?.track || slotInfo.track, `book-track-${slotInfo.slot}`);
    trackField.append(trackLabel, trackSelect);

    const fileField = createElement('div', 'admin-field file-picker');
    const fileLabel = createElement('label', '', 'اختر ملف PDF');
    fileLabel.htmlFor = `book-file-${slotInfo.slot}`;
    const fileInput = createElement('input');
    fileInput.type = 'file';
    fileInput.id = `book-file-${slotInfo.slot}`;
    fileInput.accept = 'application/pdf,.pdf';
    const selectedName = createElement('p', 'selected-file-name', saved?.fileName ? `الملف الحالي: ${saved.fileName} • ${formatFileSize(saved.size)}` : 'لم يتم اختيار ملف بعد.');
    selectedName.dataset.fileNameLabel = String(slotInfo.slot);
    fileField.append(fileLabel, fileInput, selectedName);
    fields.append(titleField, trackField, fileField);

    const actions = createElement('div', 'admin-book-actions');
    const saveButton = createElement('button', 'button button-navy button-save');
    saveButton.type = 'button';
    saveButton.dataset.saveBook = String(slotInfo.slot);
    saveButton.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i><span>حفظ المقرر والملف</span>';
    const deleteButton = createElement('button', 'button button-danger');
    deleteButton.type = 'button';
    deleteButton.dataset.deleteBook = String(slotInfo.slot);
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i><span>إزالة الملف</span>';
    actions.append(saveButton, deleteButton);

    const meta = createElement('p', 'file-meta', saved?.updatedAt ? `آخر تحديث: ${formatDate(saved.updatedAt)}` : 'لا يوجد ملف محفوظ في هذه الخانة.');
    card.append(top, fields, actions, meta);
    container.append(card);
  });
}

async function saveBookFromCard(slot) {
  const card = $(`[data-book-slot="${slot}"]`, $('#adminBooksContainer'));
  if (!card) return;
  const titleInput = $(`#book-title-${slot}`, card);
  const trackSelect = $(`#book-track-${slot}`, card);
  const fileInput = $(`#book-file-${slot}`, card);
  const saveButton = $(`[data-save-book="${slot}"]`, card);
  const title = titleInput.value.trim();
  const track = trackSelect.value;
  const selectedFile = fileInput.files?.[0] || null;

  if (!title) {
    showToast('اكتب اسم المقرر قبل الحفظ.', 'error');
    titleInput.focus();
    return;
  }
  if (selectedFile) {
    const looksLikePDF = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    if (!looksLikePDF) {
      showToast('الملف المحدد ليس بصيغة PDF. اختر ملفًا ينتهي امتداده بـ PDF.', 'error', 5000);
      fileInput.value = '';
      return;
    }
    if (selectedFile.size > MAX_PDF_SIZE) {
      showToast('حجم الملف يتجاوز 25 ميجابايت. اختر ملفًا أصغر.', 'error', 5000);
      fileInput.value = '';
      return;
    }
  }

  let existing = null;
  try {
    existing = await getBook(slot);
    if (!selectedFile && !existing?.blob) {
      showToast('اختر ملف PDF أولًا. يمكنك أيضًا حفظ اسم المقرر بعد رفع ملف له.', 'error');
      fileInput.focus();
      return;
    }
    const record = {
      slot: Number(slot),
      title,
      track,
      fileName: selectedFile?.name || existing?.fileName || '',
      mimeType: selectedFile?.type || existing?.mimeType || 'application/pdf',
      size: selectedFile?.size ?? existing?.size ?? 0,
      blob: selectedFile || existing?.blob || null,
      updatedAt: new Date().toISOString()
    };
    saveButton.disabled = true;
    saveButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>جاري الحفظ...</span>';
    await putBook(record);
    showToast(`تم حفظ محتوى الخانة ${String(slot).padStart(2, '0')} على هذا المتصفح.`, 'success');
    await renderAdminDashboard();
    if (currentStudent) await renderStudentBooks(currentStudent.track);
  } catch (error) {
    console.error(error);
    showToast(error.message || 'تعذر حفظ الملف. تحقق من مساحة التخزين وحاول مجددًا.', 'error', 5000);
  } finally {
    // إذا أعيد بناء البطاقة، الزر القديم غير متصل؛ لا يؤثر ذلك على الواجهة الجديدة.
    if (saveButton.isConnected) {
      saveButton.disabled = false;
      saveButton.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i><span>حفظ المقرر والملف</span>';
    }
  }
}

async function deleteBookFromSlot(slot) {
  try {
    const existing = await getBook(slot);
    if (!existing) {
      showToast('هذه الخانة لا تحتوي على ملف محفوظ.', 'info');
      return;
    }
    await removeBook(slot);
    showToast(`تمت إزالة الملف من الخانة ${String(slot).padStart(2, '0')}.`, 'success');
    await renderAdminDashboard();
    if (currentStudent) await renderStudentBooks(currentStudent.track);
  } catch (error) {
    showToast(error.message || 'تعذر إزالة الملف.', 'error');
  }
}

async function renderApplications() {
  const container = $('#applicationsContainer');
  container.replaceChildren();
  const students = getStudents().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  if (students.length === 0) {
    container.append(createEmptyState('لا توجد طلبات تسجيل محفوظة في هذا المتصفح حتى الآن.', 'fa-users'));
    return;
  }

  students.forEach((student) => {
    const row = createElement('article', 'application-row');
    const person = createElement('div', 'application-person');
    const avatar = createElement('span', 'application-avatar');
    avatar.innerHTML = '<i class="fa-solid fa-user-graduate"></i>';
    const personCopy = createElement('div');
    personCopy.append(createElement('strong', '', student.name || 'طالب'), createElement('small', '', student.id || '—'));
    person.append(avatar, personCopy);

    const meta = createElement('div', 'application-meta');
    meta.append(createElement('span', '', student.track || '—'), createElement('span', '', `الهاتف: ${student.phone || '—'} • ${formatDate(student.createdAt)}`));

    const actions = createElement('div', 'application-actions');
    const status = createElement('span', `admin-book-state ${student.status === 'approved' ? 'is-ready' : ''}`, student.status === 'approved' ? 'معتمد' : 'قيد المراجعة');
    const actionButton = createElement('button', `button ${student.status === 'approved' ? 'button-danger' : 'button-navy'}`);
    actionButton.type = 'button';
    actionButton.dataset.studentAction = student.status === 'approved' ? 'pending' : 'approve';
    actionButton.dataset.studentId = student.id;
    actionButton.innerHTML = student.status === 'approved' ? '<i class="fa-solid fa-rotate-left"></i><span>إعادة للمراجعة</span>' : '<i class="fa-solid fa-check"></i><span>اعتماد الطلب</span>';
    actions.append(status, actionButton);
    row.append(person, meta, actions);
    container.append(row);
  });
}

async function renderAdminDashboard() {
  try {
    const books = await getAllBooks();
    $('#adminBooksCount').textContent = `${books.filter((book) => Boolean(book.blob)).length} / 8`;
  } catch (error) {
    $('#adminBooksCount').textContent = '— / 8';
  }
  const students = getStudents();
  $('#adminStudentsCount').textContent = String(students.length);
  $('#adminPendingCount').textContent = String(students.filter((student) => student.status !== 'approved').length);
  await renderAdminBooks();
  await renderApplications();
}

function updateStudentStatus(studentId, action) {
  const students = getStudents();
  const student = students.find((record) => record.id === studentId);
  if (!student) {
    showToast('لم يتم العثور على الطلب. حدّث البيانات وحاول مجددًا.', 'error');
    return;
  }
  student.status = action === 'approve' ? 'approved' : 'pending';
  if (!saveStudents(students)) return;
  if (currentStudent?.id === studentId) currentStudent = student;
  showToast(action === 'approve' ? 'تم اعتماد الطلب في هذه النسخة المحلية.' : 'أعيد الطلب إلى حالة المراجعة.', 'success');
  renderAdminDashboard();
  if (currentStudent?.id === studentId) renderStudentDashboard();
}

function setPasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const shouldShow = input.type === 'password';
  input.type = shouldShow ? 'text' : 'password';
  button.setAttribute('aria-label', shouldShow ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
  button.innerHTML = shouldShow ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
}

async function copyStudentId() {
  const value = $('#copyStudentId').dataset.copyValue || $('#appGeneratedId').textContent;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const helper = document.createElement('textarea');
      helper.value = value;
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.append(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    showToast('تم نسخ رقم القيد.', 'success');
  } catch (error) {
    showToast(`رقم القيد: ${value}`, 'info', 6000);
  }
}

function toggleMobileMenu() {
  const menu = $('#mobileNav');
  const button = $('#mobileMenuToggle');
  const willOpen = menu.hidden;
  menu.hidden = !willOpen;
  button.setAttribute('aria-expanded', String(willOpen));
  button.innerHTML = willOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  document.body.classList.toggle('menu-open', willOpen);
}

function finishPreloader() {
  const preloader = $('#preloader');
  if (!preloader || preloader.classList.contains('is-finished')) return;
  preloader.classList.add('is-finished');
  window.setTimeout(() => preloader.remove(), 800);
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const routeButton = event.target.closest('[data-route]');
    if (routeButton) {
      switchRoute(routeButton.dataset.route);
      return;
    }

    const passwordButton = event.target.closest('[data-toggle-password]');
    if (passwordButton) {
      setPasswordVisibility(passwordButton.dataset.togglePassword, passwordButton);
      return;
    }

    const saveButton = event.target.closest('[data-save-book]');
    if (saveButton) {
      saveBookFromCard(Number(saveButton.dataset.saveBook));
      return;
    }

    const deleteButton = event.target.closest('[data-delete-book]');
    if (deleteButton) {
      deleteBookFromSlot(Number(deleteButton.dataset.deleteBook));
      return;
    }

    const studentActionButton = event.target.closest('[data-student-action]');
    if (studentActionButton) {
      updateStudentStatus(studentActionButton.dataset.studentId, studentActionButton.dataset.studentAction);
    }
  });

  $('#mobileMenuToggle').addEventListener('click', toggleMobileMenu);
  $('#registrationForm').addEventListener('submit', handleRegistration);
  $('#loginForm').addEventListener('submit', handleLogin);
  $('#studentLogout').addEventListener('click', () => {
    currentStudent = null;
    $('#loginIdInput').value = '';
    $('#loginPassInput').value = '';
    switchRoute('login');
    showToast('تم تسجيل الخروج.', 'info');
  });
  $('#copyStudentId').addEventListener('click', copyStudentId);
  $('#openAdminButton').addEventListener('click', () => switchRoute('admin'));
  $('#refreshAdminButton').addEventListener('click', async () => {
    await renderAdminDashboard();
    showToast('تم تحديث بيانات الإدارة المحلية.', 'success');
  });

  $('#adminBooksContainer').addEventListener('change', (event) => {
    const input = event.target.closest('input[type="file"][id^="book-file-"]');
    if (!input) return;
    const slot = input.id.split('-').pop();
    const label = $(`[data-file-name-label="${slot}"]`, $('#adminBooksContainer'));
    const file = input.files?.[0];
    if (!label) return;
    if (!file) {
      label.textContent = 'لم يتم اختيار ملف جديد.';
      return;
    }
    label.textContent = `${file.name} • ${formatFileSize(file.size)}`;
    if (!(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
      showToast('تأكد من اختيار ملف PDF صحيح.', 'error');
    } else if (file.size > MAX_PDF_SIZE) {
      showToast('حجم الملف يتجاوز 25 ميجابايت.', 'error');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !$('#mobileNav').hidden) toggleMobileMenu();
  });
}

function initializeApp() {
  updateDate();
  bindEvents();
  window.setTimeout(finishPreloader, 1050);
  window.addEventListener('load', () => window.setTimeout(finishPreloader, 200));
}

initializeApp();
