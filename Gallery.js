document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = document.querySelectorAll(".gallery-item");
    const filterButtons = document.querySelectorAll(".filters button");
    const lightbox = document.getElementById("lightbox");
    const lbContent = document.getElementById("lbContent");

    // 1. Click image to view
    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const fullImg = item.querySelector("img").src;
            lbContent.innerHTML = `<img src="${fullImg}" style="max-width:90%; max-height:80vh; border-radius:10px;">`;
            lightbox.classList.add("show");
        });
    });

    // 2. Filter Logic
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            const activeBtn = document.querySelector(".filters button.active");
            if (activeBtn) activeBtn.classList.remove("active");
            button.classList.add("active");

            document.querySelectorAll(".gallery-group").forEach(group => {
                const category = group.dataset.category;
                group.style.display = (filter === "all" || category === filter) ? "block" : "none";
            });
        });
    });

    // 3. COMBINED CLOSE LOGIC: Background, Close Button, and Image protection
    lightbox.addEventListener("click", (e) => {
        // Close if clicking the dark background (the lightbox itself) 
        // OR the close button (lbClose)
        if (e.target === lightbox || e.target.id === "lbClose" || e.target.closest("#lbClose")) {
            lightbox.classList.remove("show");
        }
    });

    // Prevent clicking the photo itself from closing the lightbox
    lbContent.addEventListener("click", (e) => {
        e.stopPropagation(); 
    });
});
