document.addEventListener("DOMContentLoaded", () => {
    const tags = document.querySelectorAll(".tag");
    const bubbles = document.querySelectorAll(".bookmarks-bubble");

    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            const selectedTag = tag.textContent.trim().toLowerCase();

            // Перебираем баблы и меняем прозрачность
            bubbles.forEach(bubble => {
                const bubbleTags = bubble.getAttribute("data-tags").toLowerCase().split(",").map(tag => tag.trim());
                if (bubbleTags.includes(selectedTag)) {
                    bubble.classList.remove("dimmed");
                } else {
                    bubble.classList.add("dimmed");
                }
            });
        });
    });

    document.getElementById("reset").addEventListener("click", () => {
        bubbles.forEach(bubble => {
            bubble.classList.remove("dimmed");
        });
    });
});

// Reorder bookmarks into two columns with snake order
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".bookmarks-container");
    const items = Array.from(container.children);
    const columnCount = 2; // Количество колонок

    const reordered = [];
    for (let i = 0; i < columnCount; i++) {
        for (let j = i; j < items.length; j += columnCount) {
            reordered.push(items[j]);
        }
    }

    // Очищаем контейнер и добавляем элементы в новом порядке
    container.innerHTML = "";
    reordered.forEach(item => container.appendChild(item));
});