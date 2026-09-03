document.addEventListener("DOMContentLoaded", () => {
// Оглавление страницы. Пункты помечены data-target, цели — data-toc; всё
// остальное общее, поэтому один скрипт обслуживает и закладки, и логи.
const toc = document.querySelector(".toc");
if (!toc) return;

const links = Array.from(toc.querySelectorAll(".toc-link"));

const sectionByName = name => document.querySelector(`[data-toc="${name}"]`);

const setActive = name => {
    links.forEach(link => link.classList.toggle("active", link.dataset.target === name));
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

links.forEach(link => {
    link.addEventListener("click", event => {
        const section = sectionByName(link.dataset.target);
        if (!section) return;   // якорь в href доведёт сам

        event.preventDefault();
        section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        setActive(link.dataset.target);
    });
});

// Активный пункт — последний раздел, чей верх уже ушёл под кромку меню.
// Наблюдатель здесь не годился: его полоса не пересекает первый раздел, пока
// страницу не прокрутят, и до первой прокрутки не подсвечено ничего.
const sections = Array.from(document.querySelectorAll("[data-toc]"));

const syncActive = () => {
    if (!sections.length) return;

    let current = sections[0];
    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= 90) current = section;
    });
    setActive(current.dataset.toc);
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
