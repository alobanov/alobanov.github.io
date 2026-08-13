document.addEventListener("DOMContentLoaded", () => {
    const tags    = document.querySelectorAll(".tag");
    const bubbles = document.querySelectorAll(".bookmarks-bubble");

    // Year headings are not posts and carry no data-tags, so filtering leaves
    // them behind — a year with every post hidden under it. After each filter
    // pass, hide any year that has no visible post left.
    function syncYearRows() {
        document.querySelectorAll(".post-year-row").forEach(yearRow => {
            let hasVisible = false;
            let row = yearRow.nextElementSibling;
            while (row && !row.classList.contains("post-year-row")) {
                if (!row.classList.contains("hidden")) hasVisible = true;
                row = row.nextElementSibling;
            }
            yearRow.classList.toggle("hidden", !hasVisible);
        });
    }

    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            if (tag.id === "reset") return;
            const selectedTag = tag.textContent.trim().toLowerCase();
            bubbles.forEach(bubble => {
                const bubbleTags = (bubble.getAttribute("data-tags") || "").toLowerCase().split(",").map(t => t.trim());
                bubble.classList.toggle("hidden", !bubbleTags.includes(selectedTag));
            });
            syncYearRows();
        });
    });

    document.getElementById("reset").addEventListener("click", () => {
        bubbles.forEach(bubble => bubble.classList.remove("hidden"));
        syncYearRows();
    });

    // Reorder cards into two snake-order columns
    const container = document.querySelector(".bookmarks-container");
    if (!container) return;

    const items    = Array.from(container.children);
    const cols     = 2;
    const reordered = [];

    for (let col = 0; col < cols; col++) {
        for (let i = col; i < items.length; i += cols) {
            reordered.push(items[i]);
        }
    }

    container.innerHTML = "";
    reordered.forEach(item => container.appendChild(item));
});
