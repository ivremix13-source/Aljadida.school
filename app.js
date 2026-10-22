/* =========================================================
   المدرسة الجديدة الثانوية النموذجية بنين
   APP.JS — إدارة الصفحات والكتب والتواصل والتفاعلات
========================================================= */

// =========================================================
// 1. بيانات الكتب الدراسية
// =========================================================
// ضع ملفات PDF داخل مجلد books في مستودع GitHub.
// مثال:
// books/maths-basic.pdf
//
// استخدم مسارات نسبية تبدأ بـ ./books/
// اترك url فارغاً إذا لم ترفع الكتاب بعد.

const BOOKS = [
    {
        title: 'الرياضيات المتخصصة',
        category: 'الرياضيات',
        icon: 'fa-square-root-variable',
        color: '#b18a37',
        light: '#fbf2d9',
        url: ''
    },
    {
        title: 'الرياضيات الأساسية',
        category: 'الرياضيات',
        icon: 'fa-calculator',
        color: '#5277af',
        light: '#e9effb',
        url: './books/maths-basic.pdf'
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
        url: ''
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
        url: ''
    },
    {
        title: 'اللغة الإنجليزية',
        category: 'اللغات',
        icon: 'fa-language',
        color: '#a65e70',
        light: '#f9e9ee',
        url: ''
    }
];


// =========================================================
// 2. بيانات التواصل
// =========================================================
// يمكنك تعديل الأرقام والبريد الإلكتروني من هنا.
// الأنواع المدعومة:
// phone, whatsapp, email, location, website

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
// 3. الإعدادات العامة
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
// 4. حماية النصوص المعروضة داخل HTML
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
// 5. رسائل التنبيه
// =========================================================

function showToast(message) {
    const toast = $('#toast');
    const messageNode = $('#toastMessage');

    if (!toast || !messageNode) {
        alert(message);
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
// 6. إدارة الصفحات
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
// 7. إعداد التنقل بين الأقسام
// =========================================================

function setupNavigation() {
    $$('[data-nav]').forEach(link => {
        link.addEventListener('click', event => {
            const href = link.getAttribute('href');

            if (!href || !href.startsWith('#')) {
                return;
            }

            event.preventDefault();

            const page = normalizePage(href);

            showPage(page, true);
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
// 8. إنشاء اسم مناسب لملف الكتاب
// =========================================================

function createBookFileName(title) {
    const normalized = String(title || '')
        .trim()
        .replace(/[\\/:*?"<>|]/g, '-')
        .replace(/\s+/g, '-');

    return `${normalized}.pdf`;
}


// =========================================================
// 9. تنزيل الكتاب الدراسي
// =========================================================
// ملاحظة:
// ملفات PDF الموجودة داخل المستودع نفسه يمكن طلب تنزيلها
// باستخدام fetch ثم إنشاء رابط تنزيل.
//
// إذا كانت الاستضافة تمنع جلب الملف أو تعذّر تنزيله،
// نعرض رابطاً مباشراً للملف بدلاً من ترك الزر دون استجابة.

async function downloadBook(book, button) {
    if (!book || !book.url || !book.url.trim()) {
        showToast(
            `لم يُرفع ملف «${book?.title || 'الكتاب'}» بعد.`
        );

        return;
    }

    const url = book.url.trim();

    const originalContent = button.innerHTML;

    button.disabled = true;

    button.classList.add('is-downloading');

    button.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        جارٍ التجهيز...
    `;

    try {
        // محاولة تنزيل الملف مباشرة.
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `تعذر الوصول إلى الملف (${response.status})`
            );
        }

        const blob = await response.blob();

        if (
            blob.type &&
            !blob.type.includes('pdf') &&
            blob.type !== 'application/octet-stream'
        ) {
            throw new Error(
                'الرابط لا يعيد ملف PDF صالحاً.'
            );
        }

        const objectURL = URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');

        downloadLink.href = objectURL;

        downloadLink.download = createBookFileName(
            book.title
        );

        downloadLink.style.display = 'none';

        document.body.appendChild(downloadLink);

        downloadLink.click();

        downloadLink.remove();

        window.setTimeout(() => {
            URL.revokeObjectURL(objectURL);
        }, 1500);

        showToast(
            `بدأ تنزيل كتاب «${book.title}».`
        );

    } catch (error) {
        console.error(
            'Book download error:',
            error
        );

        // احتياط: فتح الملف مباشرة إذا منع المتصفح fetch.
        // يعمل هذا خصوصاً عندما تكون المشكلة متعلقة
        // بسياسات CORS أو بإعدادات الاستضافة.
        const directLink = document.createElement('a');

        directLink.href = url;

        directLink.target = '_blank';

        directLink.rel = 'noopener noreferrer';

        directLink.download = createBookFileName(
            book.title
        );

        document.body.appendChild(directLink);

        directLink.click();

        directLink.remove();

        showToast(
            'تعذر التنزيل المباشر. حاول من صفحة الملف التي فُتحت.'
        );

    } finally {
        button.disabled = false;

        button.classList.remove('is-downloading');

        button.innerHTML = originalContent;
    }
}


// =========================================================
// 10. عرض الكتب في المكتبة
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
                <p>
                    لا توجد كتب تطابق عبارة البحث.
                    جرّب كلمة أخرى.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = filtered.map(book => {
        const originalIndex = BOOKS.indexOf(book) + 1;

        const ready = Boolean(
            book.url && book.url.trim()
        );

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
                        BOOK / ${String(originalIndex).padStart(2, '0')}
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
                        ${ready ? 'ملف متاح' : 'ملف قيد الإضافة'}
                    </span>

                    <button
                        type="button"
                        class="book-open-button ${ready ? 'is-ready' : ''}"
                        data-book-index="${originalIndex - 1}"
                        ${ready ? '' : 'aria-label="الكتاب غير متاح حالياً"'}
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
            const index = Number(
                button.dataset.bookIndex
            );

            const book = BOOKS[index];

            if (!book) {
                showToast('تعذر العثور على بيانات الكتاب.');

                return;
            }

            if (!book.url || !book.url.trim()) {
                showToast(
                    `لم يُرفع ملف «${book.title}» بعد. أضف رابط PDF في مصفوفة BOOKS داخل app.js.`
                );

                return;
            }

            await downloadBook(book, button);
        });
    });
}


// =========================================================
// 11. تحديث إحصائيات الكتب
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
// 12. أيقونات التواصل
// =========================================================

const CONTACT_ICONS = {
    phone: 'fa-phone',
    whatsapp: 'fa-brands fa-whatsapp',
    email: 'fa-envelope',
    location: 'fa-location-dot',
    website: 'fa-globe'
};


// =========================================================
// 13. إنشاء روابط التواصل
// =========================================================

function contactHref(item) {
    const value = String(
        item.value || ''
    ).trim();

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
// 14. عرض معلومات التواصل
// =========================================================

function renderContacts() {
    const container = $('#contactGrid');

    if (!container) {
        return;
    }

    container.innerHTML = CONTACT_ITEMS.map(item => {
        const value = String(
            item.value || ''
        ).trim();

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

            const external =
                ['website', 'whatsapp', 'location']
                    .includes(item.type);

            button = `
                <a
                    href="${safeText(href)}"
                    ${external ? 'target="_blank" rel="noopener noreferrer"' : ''}
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
// 15. التفاعلات العامة
// =========================================================

function setupInteractions() {
    $('#bookSearch')?.addEventListener(
        'input',
        event => renderBooks(event.target.value)
    );

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
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches
                ? 'auto'
                : 'smooth'
        });
    });
}


// =========================================================
// 16. تحميل شعار المدرسة
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

        image.addEventListener(
            'load',
            handleSuccess
        );

        image.addEventListener(
            'error',
            handleError
        );

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
// 17. شاشة التحميل الأولية
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

    // إخفاء شاشة التحميل حتى لو تأخر الإنترنت.
    window.setTimeout(hide, 1250);

    window.addEventListener('load', () => {
        window.setTimeout(hide, 350);
    }, {
        once: true
    });
}


// =========================================================
// 18. تشغيل الموقع
// =========================================================

function initPortal() {
    setupSchoolLogos();

    setupNavigation();

    renderBooks();

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
// 19. بدء التنفيذ بعد تحميل HTML
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
