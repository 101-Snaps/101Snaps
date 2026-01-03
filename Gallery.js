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
    // ... existing gallery click and filter code ...

// NEW: Close Lightbox logic
lightbox.addEventListener("click", (e) => {
    // This checks if you clicked the dark background (the lightbox itself)
    // or the "close" button. 
    // It will NOT close if you click the actual image (lbContent).
    if (e.target === lightbox || e.target.closest('#lbClose')) {
        lightbox.classList.remove("show");
    }
});

// Optional: Prevent clicking the image from closing the lightbox 
// if your lbContent fills the whole screen.
lbContent.addEventListener("click", (e) => {
    e.stopPropagation(); 
});

    // UPDATED: Close Lightbox when clicking the close button...
    document.getElementById("lbClose").onclick = () => lightbox.classList.remove("show");

    // NEW: Close Lightbox when clicking anywhere on the dark background
    lightbox.addEventListener("click", (e) => {
        // If the user clicks the background (the lightbox div itself) 
        // and NOT the actual image inside it, close it.
        if (e.target === lightbox) {
            lightbox.classList.remove("show");
        }
    });
});
