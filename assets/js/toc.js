document.addEventListener("DOMContentLoaded", () => {
// Оглавление страницы. Пункты помечены data-target, цели — data-toc; всё
// остальное общее, поэтому один скрипт обслуживает и закладки, и логи.
// В разделах панель написана в разметке, в статьях её собирает эта функция:
// заголовки там генерирует kramdown, а в двуязычных постах их вдвое больше —
// половина спрятана переключателем языка, и в оглавление она попадать не должна.
const buildArticleToc = () => {
    const prose = document.querySelector(".prose");
    if (!prose) return null;

    const visible = Array.from(prose.querySelectorAll("h2"))
        .filter(h => h.offsetParent !== null && h.id);
    const old = document.querySelector(".toc--article");
    if (visible.length < 2) {
        if (old) old.remove();
        return null;
    }

    const panel = old || document.createElement("aside");
    panel.className = "toc toc--article";
    panel.setAttribute("aria-label", "Sections");
    panel.innerHTML =
        '<span class="toc-title">Sections</span><ol class="toc-list">' +
        visible.map(h =>
            `<li><a class="toc-link" href="#${h.id}" data-target="${h.id}">${h.textContent.trim()}</a></li>`
        ).join("") +
        "</ol>";
    if (!old) prose.parentNode.insertBefore(panel, prose);
    return panel;
};

const toc = document.querySelector(".toc") || buildArticleToc();
if (!toc) return;

let links = Array.from(toc.querySelectorAll(".toc-link"));

// Цель помечена data-toc в разделах, где разметку пишем мы. В статьях
// заголовки генерирует kramdown, и там опознавать приходится по id.
const sectionByName = name =>
    document.querySelector(`[data-toc="${name}"]`) || document.getElementById(name);

const setActive = name => {
    links.forEach(link => link.classList.toggle("active", link.dataset.target === name));
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const bindLinks = () => links.forEach(link => {
    link.addEventListener("click", event => {
        const section = sectionByName(link.dataset.target);
        if (!section) return;   // якорь в href доведёт сам

        event.preventDefault();
        section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        setActive(link.dataset.target);
    });
});

bindLinks();

// Активный пункт — последний раздел, чей верх уже ушёл под кромку меню.
// Наблюдатель здесь не годился: его полоса не пересекает первый раздел, пока
// страницу не прокрутят, и до первой прокрутки не подсвечено ничего.
const collectSections = () => {
    const marked = Array.from(document.querySelectorAll("[data-toc]"));
    if (marked.length) return marked;
    // в статьях целями служат сами заголовки, на которые указывает оглавление
    return links.map(link => document.getElementById(link.dataset.target)).filter(Boolean);
};

let sections = collectSections();

const syncActive = () => {
    if (!sections.length) return;

    let current = sections[0];
    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= 90) current = section;
    });
    setActive(current.dataset.toc || current.id);
};

// Скролл сыплет событиями чаще, чем перерисовывается кадр; ticking сводит
// пересчёт к одному разу на кадр.
let ticking = false;
const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        syncActive();
        ticking = false;
    });
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });

syncActive();
});
