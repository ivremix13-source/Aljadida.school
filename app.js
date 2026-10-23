/* =========================================================
   المدرسة الجديدة الثانوية النموذجية بنين
   APP.JS — SCHOOL PORTAL
   Books • Notes • Navigation • Contacts • Interactions
========================================================= */

'use strict';


// =========================================================
// 1. بيانات الكتب الدراسية
// =========================================================
// ضع ملفات الكتب داخل مجلد books في مستودع GitHub.
// استخدم المسارات النسبية التي تبدأ بـ ./books/.
// اترك url فارغاً إذا لم ترفع الكتاب بعد.
//
// مثال:
// ./books/mathematics-basic.pdf

const BOOKS = [
    {
        title: 'الرياضيات المتخصصة',
        category: 'الرياضيات',
        icon: 'fa-square-root-variable',
        color: '#b18a37',
        light: '#fbf2d9',
        url: './books/mathematics-specialized.pdf'
    },
    {
        title: 'الرياضيات الأساسية',
        category: 'الرياضيات',
        icon: 'fa-calculator',
        color: '#5277af',
        light: '#e9effb',
        url: './books/mathematics-basic.pdf'
    },
    {
        title: 'التربية الإسلامية',
        category: 'التربية',
        icon: 'fa-moon',
        color: '#42876f',
        light: '#e2f3eb',
        url: ''
    },
    {
        title: 'العلوم الهندسية',
        category: 'العلوم',
        icon: 'fa-compass-drafting',
        color: '#9564a8',
        light: '#f0e7f7',
        url: './books/engineering.pdf'
    },
    {
        title: 'الأحياء',
        category: 'العلوم',
        icon: 'fa-leaf',
        color: '#418c70',
        light: '#e2f3e9',
        url: ''
    },
    {
        title: 'الكيمياء',
        category: 'العلوم',
        icon: 'fa-flask',
        color: '#438ca1',
        light: '#e1f3f7',
        url: ''
    },
    {
        title: 'الفيزياء',
        category: 'العلوم',
        icon: 'fa-atom',
        color: '#b97943',
        light: '#faebdd',
        url: './books/physics.pdf'
    },
    {
        title: 'اللغة الإنجليزية',
        category: 'اللغات',
        icon: 'fa-language',
        color: '#a65e70',
        light: '#f9e9ee',
        url: './books/English.pdf'
    }
];


// =========================================================
// 2. بيانات المذكرات الدراسية
// =========================================================
// المذكرات منفصلة تماماً عن الكتب.
//
// ارفع ملفات PDF إلى مجلد notes في GitHub.
// ثم ضع المسار الصحيح لكل ملف هنا.
//
// مثال:
// ./notes/physics-revision.pdf
//
// لإضافة مذكرة جديدة:
// انسخ أحد العناصر، وعدّل بياناته ومسار الملف.
// لا تحتاج إلى تعديل بقية وظائف الموقع.

const NOTES = [
    {
        title: 'مذكرة الرياضيات المتخصصة',
        subject: 'الرياضيات المتخصصة',
        description: 'مذكرة مساعدة للمراجعة والاستعداد للامتحانات.',
        icon: 'fa-square-root-variable',
        color: '#b18a37',
        light: '#fbf2d9',
        url: './notes/mathematics-specialized.pdf'
    },
    {
        title: 'مراجعة الفيزياء',
        subject: 'الفيزياء',
        description: 'مذكرة للمراجعة والتدريب على المادة.',
        icon: 'fa-atom',
        color: '#5277af',
        light: '#e9effb',
        url: './notes/physics-revision.pdf'
    },
    {
        title: 'ملخص الكيمياء',
        subject: 'الكيمياء',
        description: 'ملخص دراسي للمساعدة في المراجعة.',
        icon: 'fa-flask',
        color: '#438ca1',
        light: '#e1f3f7',
        url: './notes/chemistry-summary.pdf'
    },
    {
        title: 'مذكرة الأحياء',
        subject: 'الأحياء',
        description: 'مادة مساعدة للمذاكرة والمراجعة.',
        icon: 'fa-leaf',
        color: '#418c70',
        light: '#e2f3e9',
        url: './notes/biology.pdf'
    },
    {
        title: 'مراجعة اللغة الإنجليزية',
        subject: 'اللغة الإنجليزية',
        description: 'مذكرة للمراجعة والتدريب.',
        icon: 'fa-language',
        color: '#a65e70',
        light: '#f9e9ee',
        url: './notes/grammar.pdf'
    }
];


// =========================================================
// 3. بيانات التواصل
// =========================================================

const CONTACT_ITEMS = [
    {
        title: 'إدارة المدرسة',
        description: 'للاستفسارات العامة',
        type: 'phone',
        value: '0999498099'
    },
    {
        title: 'شؤون الطلاب',
        description: 'للمتابعة والاستفسارات الطلابية',
        type: 'phone',
        value: '0120578078'
    },
    {
        title: 'البريد الإلكتروني',
        description: 'للمراسلات الرسمية',
        type: 'email',
        value: 'blackft846@gmail.com'
    }
];


// =========================================================
// 4. إعدادات الموقع العامة
// =========================================================

const PAGE_NAMES = [
    'home',
    'books',
    'notes',
    'guidelines',
    'schedule',
    'contact',
    'about'
];

let toastTimer = null;

const $ = (selector, root = document) =>
    root.querySelector(selector);

const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];


// =========================================================
// 5. حماية النصوص المعروضة داخل HTML
// =========================================================

function safeText(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}


// =========================================================
// 6. رسائل التنبيه
// =========================================================

function showToast(message) {
    const toast = $('#toast');
    const messageNode = $('#toastMessage');

    if (!toast || !messageNode) {
        console.info('[School Portal]', message);
        return;
    }

    messageNode.textContent = message;

    toast.classList.add('is-visible');

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 3600);
}


// =========================================================
// 7. إدارة الصفحات
// =========================================================

function normalizePage(hash) {
    const candidate = String(hash || '')
        .replace(/^#/, '')
        .trim();

    return PAGE_NAMES.includes(candidate)
        ? candidate
        : 'home';
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
    const page = PAGE_NAMES.includes(pageName)
        ? pageName
        : 'home';

    $$('.page-view').forEach(view => {
        const active = view.dataset.page === page;

        view.classList.toggle('is-visible', active);
        view.hidden = !active;
    });

    $$('[data-nav]').forEach(link => {
        const href = link.getAttribute('href');

        if (!href || !href.startsWith('#')) {
            return;
        }

        const linkPage = normalizePage(href);

        if (link.classList.contains('nav-link')) {
            link.classList.toggle(
                'is-active',
                linkPage === page
            );

            if (linkPage === page) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        }
    });

    closeMobileMenu();

    if (
        updateHistory &&
        window.location.hash !== `#${page}`
    ) {
        window.history.pushState(
            { page },
            '',
            `#${page}`
        );
    }

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'auto' : 'smooth'
    });
}


// =========================================================
// 8. إعداد التنقل بين الأقسام
// =========================================================

function setupNavigation() {
    $$('[data-nav]').forEach(link => {
        link.addEventListener('click', event => {
            const href = link.getAttribute('href');

            if (!href || !href.startsWith('#')) {
                return;
            }

            event.preventDefault();

            showPage(normalizePage(href), true);
        });
    });

    window.addEventListener('popstate', () => {
        showPage(
            normalizePage(window.location.hash),
            false
        );
    });

    window.addEventListener('hashchange', () => {
        const current = normalizePage(
            window.location.hash
        );

        const visible = $('.page-view.is-visible')
            ?.dataset.page;

        if (current !== visible) {
            showPage(current, false);
        }
    });

    $('#menuToggle')?.addEventListener('click', () => {
        const nav = $('#mainNav');
        const toggle = $('#menuToggle');

        if (!nav || !toggle) {
            return;
        }

        const open = !nav.classList.contains('is-open');

        nav.classList.toggle('is-open', open);
        toggle.classList.toggle('is-open', open);

        toggle.setAttribute(
            'aria-expanded',
            String(open)
        );

        document.body.classList.toggle(
            'menu-open',
            open
        );
    });

    document.addEventListener('click', event => {
        const nav = $('#mainNav');
        const toggle = $('#menuToggle');

        if (
            nav?.classList.contains('is-open') &&
            !nav.contains(event.target) &&
            !toggle?.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });
}


// =========================================================
// 9. إنشاء اسم مناسب لملف PDF
// =========================================================

function createBookFileName(title) {
    const normalized = String(title || '')
        .trim()
        .replace(/[\\/:*?"<>|]/g, '-')
        .replace(/\s+/g, '-');

    return `${normalized || 'document'}.pdf`;
}


// =========================================================
// 10. تنزيل ملف PDF
// =========================================================
// تستخدم هذه الدالة للكتب والمذكرات.
// تحاول تنزيل الملف أولاً، ثم تعرض رابط الملف
// مباشرة إذا فشلت محاولة التنزيل.

async function downloadPDF(item, button, type = 'الملف') {
    if (!item || !item.url || !item.url.trim()) {
        showToast(`ملف ${type} غير متوفر حالياً.`);
        return;
    }

    const url = item.url.trim();
    const originalContent = button.innerHTML;

    button.disabled = true;

    button.classList.add('is-downloading');

    button.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        جارٍ التجهيز...
    `;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const blob = await response.blob();

        // التأكد من عدم تنزيل صفحة HTML على أنها PDF.
        if (
            blob.type &&
            !blob.type.toLowerCase().includes('pdf') &&
            blob.type !== 'application/octet-stream' &&
            blob.type !== 'application/force-download'
        ) {
            throw new Error('الملف المستلم ليس PDF صالحاً.');
        }

        const objectURL = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = objectURL;
        link.download = createBookFileName(item.title);
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.setTimeout(() => {
            URL.revokeObjectURL(objectURL);
        }, 3000);

        showToast(`بدأ تنزيل «${item.title}».`);

    } catch (error) {
        console.error(
            `PDF download error (${type}):`,
            error
        );

        // فتح الملف مباشرة كحل احتياطي.
        const directLink = document.createElement('a');

        directLink.href = url;
        directLink.target = '_blank';
        directLink.rel = 'noopener noreferrer';

        document.body.appendChild(directLink);
        directLink.click();
        directLink.remove();

        showToast(
            'تعذر التنزيل التلقائي. تحقق من وجود الملف وحاول مرة أخرى.'
        );

    } finally {
        button.disabled = false;

        button.classList.remove('is-downloading');

        button.innerHTML = originalContent;
    }
}


// =========================================================
// 11. عرض الكتب الدراسية
// =========================================================

function renderBooks(filter = '') {
    const container = $('#booksGrid');

    if (!container) {
        return;
    }

    const query = String(filter)
        .trim()
        .toLocaleLowerCase('ar');

    const filtered = BOOKS.filter(book => {
        const searchableText =
            `${book.title} ${book.category}`
                .toLocaleLowerCase('ar');

        return searchableText.includes(query);
    });

    if (!filtered.length) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>لا توجد كتب تطابق عبارة البحث.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = filtered.map(book => {
        const originalIndex = BOOKS.indexOf(book);
        const ready = Boolean(book.url?.trim());

        return `
            <article
                class="book-item"
                style="
                    --book-color:${safeText(book.color)};
                    --book-light:${safeText(book.light)};
                "
            >
                <div class="book-item-top">
                    <span class="book-number">
                        BOOK / ${String(originalIndex + 1).padStart(2, '0')}
                    </span>

                    <span class="book-symbol">
                        <i class="fa-solid ${safeText(book.icon)}"></i>
                    </span>
                </div>

                <h3>${safeText(book.title)}</h3>

                <p>
                    ${safeText(book.category)}
                    · الصف الثالث الثانوي
                </p>

                <div class="book-item-bottom">
                    <span class="book-type">
                        <i class="fa-regular fa-file-pdf"></i>
                        ${ready ? 'ملف مضاف' : 'لم يُضف الملف بعد'}
                    </span>

                    <button
                        type="button"
                        class="book-open-button ${ready ? 'is-ready' : ''}"
                        data-book-index="${originalIndex}"
                        ${ready ? '' : 'disabled'}
                    >
                        ${
                            ready
                                ? '<i class="fa-solid fa-download"></i> تحميل الكتاب'
                                : 'قريباً'
                        }
                    </button>
                </div>
            </article>
        `;
    }).join('');

    $$('.book-open-button', container).forEach(button => {
        button.addEventListener('click', async () => {
            const book = BOOKS[
                Number(button.dataset.bookIndex)
            ];

            if (!book) {
                showToast('تعذر العثور على بيانات الكتاب.');
                return;
            }

            await downloadPDF(book, button, 'الكتاب');
        });
    });
}


// =========================================================
// 12. مكتبة المذكرات الدراسية
// =========================================================
// مستقلة تماماً عن الكتب.
// تتطلب وجود العنصر #notesGrid داخل صفحة المذكرات.

function renderNotes(filter = '') {
    const container = $('#notesGrid');

    if (!container) {
        // عدم إظهار أخطاء إذا كان HTML لم يُربط بعد.
        return;
    }

    const query = String(filter)
        .trim()
        .toLocaleLowerCase('ar');

    const filtered = NOTES.filter(note => {
        const searchableText = [
            note.title,
            note.subject,
            note.description
        ]
            .join(' ')
            .toLocaleLowerCase('ar');

        return searchableText.includes(query);
    });

    if (!filtered.length) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-magnifying-glass"></i>

                <p>
                    لا توجد مذكرات تطابق بحثك.
                    جرّب كلمة أخرى.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = filtered.map(note => {
        const index = NOTES.indexOf(note);
        const ready = Boolean(note.url?.trim());

        return `
            <article
                class="note-item"
                style="
                    --note-color:${safeText(note.color || '#b18a37')};
                    --note-light:${safeText(note.light || '#fbf2d9')};
                "
            >
                <div class="note-item-top">
                    <span class="note-number">
                        NOTE / ${String(index + 1).padStart(2, '0')}
                    </span>

                    <span class="note-item-icon">
                        <i class="fa-solid ${safeText(note.icon || 'fa-file-pdf')}"></i>
                    </span>
                </div>

                <div class="note-item-content">
                    <span class="note-subject">
                        ${safeText(note.subject || 'مذكرة دراسية')}
                    </span>

                    <h3>${safeText(note.title)}</h3>

                    <p>
                        ${safeText(note.description || '')}
                    </p>
                </div>

                <div class="note-item-bottom">
                    <span class="note-file-type">
                        <i class="fa-regular fa-file-pdf"></i>
                        ${ready ? 'ملف PDF مضاف' : 'الملف غير متاح'}
                    </span>

                    <button
                        type="button"
                        class="note-download-button ${ready ? 'is-ready' : ''}"
                        data-note-index="${index}"
                        ${ready ? '' : 'disabled'}
                    >
                        ${
                            ready
                                ? '<i class="fa-solid fa-download"></i> تحميل المذكرة'
                                : 'قريباً'
                        }
                    </button>
                </div>
            </article>
        `;
    }).join('');

    $$('.note-download-button', container).forEach(button => {
        button.addEventListener('click', async () => {
            const note = NOTES[
                Number(button.dataset.noteIndex)
            ];

            if (!note) {
                showToast('تعذر العثور على بيانات المذكرة.');
                return;
            }

            await downloadPDF(note, button, 'المذكرة');
        });
    });
}


// =========================================================
// 13. البحث في الكتب والمذكرات
// =========================================================

function setupLibrarySearch() {
    $('#bookSearch')?.addEventListener(
        'input',
        event => {
            renderBooks(event.target.value);
        }
    );

    $('#notesSearch')?.addEventListener(
        'input',
        event => {
            renderNotes(event.target.value);
        }
    );
}


// =========================================================
// 14. تحديث إحصائيات الكتب
// =========================================================

function renderFeaturedBooks() {
    const statBook = $('.stat-card strong');

    if (statBook) {
        statBook.textContent = String(
            BOOKS.length
        ).padStart(2, '0');
    }
}


// =========================================================
// 15. أيقونات التواصل
// =========================================================

const CONTACT_ICONS = {
    phone: 'fa-phone',
    whatsapp: 'fa-brands fa-whatsapp',
    email: 'fa-envelope',
    location: 'fa-location-dot',
    website: 'fa-globe'
};


// =========================================================
// 16. إنشاء روابط التواصل
// =========================================================

function contactHref(item) {
    const value = String(item.value || '').trim();

    if (!value) {
        return '';
    }

    if (item.type === 'phone') {
        return `tel:${value.replace(/[^+\d]/g, '')}`;
    }

    if (item.type === 'whatsapp') {
        return `https://wa.me/${value.replace(/\D/g, '')}`;
    }

    if (item.type === 'email') {
        return `mailto:${value}`;
    }

    if (item.type === 'website') {
        return /^https?:\/\//i.test(value)
            ? value
            : `https://${value}`;
    }

    if (item.type === 'location') {
        return (
            'https://www.google.com/maps/search/?api=1&query=' +
            encodeURIComponent(value)
        );
    }

    return '';
}


// =========================================================
// 17. عرض معلومات التواصل
// =========================================================

function renderContacts() {
    const container = $('#contactGrid');

    if (!container) {
        return;
    }

    container.innerHTML = CONTACT_ITEMS.map(item => {
        const value = String(item.value || '').trim();
        const href = contactHref(item);

        const iconClass =
            CONTACT_ICONS[item.type] ||
            'fa-circle-info';

        const iconMarkup = iconClass.includes('fa-brands')
            ? `<i class="${safeText(iconClass)}"></i>`
            : `<i class="fa-solid ${safeText(iconClass)}"></i>`;

        let button = '';

        if (value && href) {
            let buttonText = 'فتح الرابط';

            if (item.type === 'phone') {
                buttonText = 'اتصل الآن';
            } else if (item.type === 'email') {
                buttonText = 'إرسال بريد';
            } else if (item.type === 'whatsapp') {
                buttonText = 'تواصل عبر واتساب';
            } else if (item.type === 'location') {
                buttonText = 'عرض الموقع';
            }

            const external = [
                'website',
                'whatsapp',
                'location'
            ].includes(item.type);

            button = `
                <a
                    href="${safeText(href)}"
                    ${
                        external
                            ? 'target="_blank" rel="noopener noreferrer"'
                            : ''
                    }
                >
                    ${buttonText}
                    <i class="fa-solid fa-arrow-left"></i>
                </a>
            `;
        }

        return `
            <article class="contact-card">
                <div class="contact-card-head">
                    <span class="contact-card-icon">
                        ${iconMarkup}
                    </span>

                    <div>
                        <h3>${safeText(item.title)}</h3>

                        <p>
                            ${safeText(item.description || '')}
                        </p>
                    </div>
                </div>

                <div class="contact-placeholder">
                    <i class="fa-solid ${
                        value
                            ? 'fa-circle-check'
                            : 'fa-hourglass-half'
                    }"></i>

                    <span>
                        ${
                            value
                                ? safeText(value)
                                : 'سيتم إضافة البيانات لاحقاً'
                        }
                    </span>
                </div>

                ${button}
            </article>
        `;
    }).join('');
}


// =========================================================
// 18. التفاعلات العامة
// =========================================================

function setupInteractions() {
    setupLibrarySearch();

    const backToTop = $('#backToTop');
    const header = $('#siteHeader');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 140;

        backToTop?.classList.toggle(
            'is-visible',
            scrolled
        );

        header?.classList.toggle(
            'scrolled',
            scrolled
        );
    }, {
        passive: true
    });

    backToTop?.addEventListener('click', () => {
        const reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: reducedMotion ? 'auto' : 'smooth'
        });
    });
}


// =========================================================
// 19. تحميل شعار المدرسة
// =========================================================

function setupSchoolLogos() {
    $$('[data-school-logo]').forEach(image => {
        const handleSuccess = () => {
            image.classList.add('logo-loaded');

            const fallback = image.parentElement
                ?.querySelector('.logo-fallback');

            if (fallback) {
                fallback.style.display = 'none';
            }
        };

        const handleError = () => {
            image.classList.remove('logo-loaded');

            image.style.display = 'none';

            const fallback = image.parentElement
                ?.querySelector('.logo-fallback');

            if (fallback) {
                fallback.style.display = '';
            }
        };

        image.addEventListener('load', handleSuccess);
        image.addEventListener('error', handleError);

        if (image.complete) {
            if (image.naturalWidth > 0) {
                handleSuccess();
            } else {
                handleError();
            }
        }
    });
}


// =========================================================
// 20. شاشة التحميل الأولية
// =========================================================

function startPreloader() {
    const preloader = $('#preloader');
    const shell = $('#siteShell');

    let finished = false;

    const hide = () => {
        if (finished) {
            return;
        }

        finished = true;

        preloader?.classList.add('is-done');
        shell?.classList.add('is-ready');

        window.setTimeout(() => {
            preloader?.remove();
        }, 800);
    };

    // ضمان إخفاء شاشة التحميل حتى لو تأخر الإنترنت.
    window.setTimeout(hide, 1500);

    window.addEventListener('load', () => {
        window.setTimeout(hide, 350);
    }, {
        once: true
    });
}


// =========================================================
// 21. تشغيل الموقع
// =========================================================

function initPortal() {
    setupSchoolLogos();

    setupNavigation();

    renderBooks();

    renderNotes();

    renderFeaturedBooks();

    renderContacts();

    setupInteractions();

    const yearElement = $('#currentYear');

    if (yearElement) {
        yearElement.textContent = String(
            new Date().getFullYear()
        );
    }

    showPage(
        normalizePage(window.location.hash),
        false
    );

    startPreloader();
}


// =========================================================
// 22. بدء التنفيذ بعد تحميل HTML
// =========================================================

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        initPortal,
        { once: true }
    );
} else {
    initPortal();
}
