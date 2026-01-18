document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = document.querySelectorAll(".gallery-item");
    const filterButtons = document.querySelectorAll(".filters button");
    const lightbox = document.getElementById("lightbox");
    const lbContent = document.getElementById("lbContent");
    const lbClose = document.getElementById("lbClose");

    // 1. Open Lightbox
    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const imgSrc = item.querySelector("img").src;
            const imgAlt = item.querySelector("img").alt;
            
            // Set image with basic responsive styles
            lbContent.innerHTML = `<img src="${imgSrc}" alt="${imgAlt}">`;
            lightbox.classList.add("show");
            document.body.style.overflow = 'hidden'; // Prevent scrolling when open
        });
    });

    // 2. Filter Logic
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");
            
            document.querySelector(".filters button.active")?.classList.remove("active");
            button.classList.add("active");

            document.querySelectorAll(".gallery-group").forEach(group => {
                const category = group.dataset.category;
                group.style.display = (filter === "all" || category === filter) ? "block" : "none";
            });
        });
    });

    // 3. Close Logic
    const closeLightbox = () => {
        lightbox.classList.remove("show");
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => { lbContent.innerHTML = ''; }, 200); // Clear content after fade
    };

    lightbox.addEventListener("click", (e) => {
        // Close if clicking the background OR the close button
        if (e.target === lightbox || e.target === lbClose) {
            closeLightbox();
        }
    });

    // Escape key to close
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("show")) closeLightbox();
    });
});
