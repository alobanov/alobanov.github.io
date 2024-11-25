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
