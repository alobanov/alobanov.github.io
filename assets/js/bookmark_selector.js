document.addEventListener("DOMContentLoaded", () => {
    const tags = document.querySelectorAll(".tag");
    const bubbles = document.querySelectorAll(".bookmarks-bubble");

    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            const selectedTag = tag.textContent.trim().toLowerCase();

            bubbles.forEach(bubble => {
                const bubbleTags = bubble.getAttribute("data-tags").toLowerCase().split(",").map(t => t.trim());
                if (bubbleTags.includes(selectedTag)) {
                    bubble.classList.remove("hidden");
                } else {
                    bubble.classList.add("hidden");
                }
            });
        });
    });

    document.getElementById("reset").addEventListener("click", () => {
        bubbles.forEach(bubble => bubble.classList.remove("hidden"));
    });
});

// Reorder bookmarks into two columns with snake order
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".bookmarks-container");
    const items = Array.from(container.children);
    const columnCount = 2;

    const reordered = [];
    for (let i = 0; i < columnCount; i++) {
        for (let j = i; j < items.length; j += columnCount) {
            reordered.push(items[j]);
        }
    }

    container.innerHTML = "";
    reordered.forEach(item => container.appendChild(item));
});
