document.addEventListener("DOMContentLoaded", () => {
    const tags    = document.querySelectorAll(".tag");
    const bubbles = document.querySelectorAll(".bookmarks-bubble");

    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            const selectedTag = tag.textContent.trim().toLowerCase();
            bubbles.forEach(bubble => {
                const bubbleTags = bubble.getAttribute("data-tags").toLowerCase().split(",").map(t => t.trim());
                bubble.classList.toggle("hidden", !bubbleTags.includes(selectedTag));
            });
        });
    });

    document.getElementById("reset").addEventListener("click", () => {
        bubbles.forEach(bubble => bubble.classList.remove("hidden"));
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
