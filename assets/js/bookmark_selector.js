document.addEventListener("DOMContentLoaded", () => {
    // Фильтр по тегам живёт на главной. На закладках теги ушли в заголовки
    // разделов, поэтому здесь ни .tag, ни #reset может не быть — отсюда проверки.
    const tags    = document.querySelectorAll(".tag");
    const bubbles = document.querySelectorAll(".bookmarks-bubble");
    const reset   = document.getElementById("reset");

    if (reset) {
        tags.forEach(tag => {
            tag.addEventListener("click", () => {
                if (tag.id === "reset") return;
                const selectedTag = tag.textContent.trim().toLowerCase();
                bubbles.forEach(bubble => {
                    const bubbleTags = (bubble.getAttribute("data-tags") || "").toLowerCase().split(",").map(t => t.trim());
                    bubble.classList.toggle("hidden", !bubbleTags.includes(selectedTag));
                });
            });
        });

        reset.addEventListener("click", () => {
            bubbles.forEach(bubble => bubble.classList.remove("hidden"));
        });
    }
});
