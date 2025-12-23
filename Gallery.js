document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = document.querySelectorAll(".gallery-item");
    const filterButtons = document.querySelectorAll(".filters button");
    const lightbox = document.getElementById("lightbox");
    const lbContent = document.getElementById("lbContent");

    // Click image to view
    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const fullImg = item.querySelector("img").src;
            lbContent.innerHTML = `<img src="${fullImg}" style="max-width:90%; max-height:80vh; border-radius:10px;">`;
            lightbox.classList.add("show");
        });
    });

    // Filter Logic
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            document.querySelector(".filters button.active").classList.remove("active");
            button.classList.add("active");

            document.querySelectorAll(".gallery-group").forEach(group => {
                const category = group.dataset.category;
                if (filter === "all" || category === filter) {
                    group.style.display = "block";
                } else {
                    group.style.display = "none";
                }
            });
        });
    });

    // Close Lightbox
    document.getElementById("lbClose").onclick = () => lightbox.classList.remove("show");
});