function openModal(imageSrc) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    modalImg.src = imageSrc;
    modal.classList.add("show");
}

function closeModal(event) {
    const modal = document.getElementById("image-modal");
    if (event.target === modal || event.target.classList.contains("close")) {
        modal.classList.remove("show");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img[data-modal-src]").forEach(function (img) {
        img.addEventListener("click", function () {
            openModal(img.dataset.modalSrc);
        });
    });
});
