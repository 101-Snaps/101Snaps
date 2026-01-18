document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = document.querySelectorAll(".gallery-item");
    const filterButtons = document.querySelectorAll(".filters button");
    const lightbox = document.getElementById("lightbox");
    const lbContent = document.getElementById("lbContent");
    const lbClose = document.getElementById("lbClose");

    // --- 1. VIEW MORE / SHOW LESS LOGIC ---
    document.querySelectorAll('.view-more-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const grid = this.parentElement.querySelector('.gallery-grid');
            grid.classList.toggle('collapsed');
            
            if (grid.classList.contains('collapsed')) {
                this.textContent = 'View Full Gallery';
                // Scrolls user back to the top of the category when closing
                this.parentElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                this.textContent = 'Show Less';
            }
        });
    });

    // --- 2. LIGHTBOX LOGIC ---
    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const imgSrc = item.querySelector("img").src;
            const imgAlt = item.querySelector("img").alt;
            lbContent.innerHTML = `<img src="${imgSrc}" alt="${imgAlt}">`;
            lightbox.classList.add("show");
            document.body.style.overflow = 'hidden'; 
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove("show");
        document.body.style.overflow = ''; 
        setTimeout(() => { lbContent.innerHTML = ''; }, 200); 
    };

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target === lbClose) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("show")) closeLightbox();
    });

    // --- 3. FILTER LOGIC ---
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");
            
            document.querySelector(".filters button.active")?.classList.remove("active");
            button.classList.add("active");

            document.querySelectorAll(".gallery-group").forEach(group => {
                const category = group.dataset.category;
                const isMatch = filter === "all" || category === filter;
                group.style.display = isMatch ? "block" : "none";
                
                // Optional: If user filters for a specific category, 
                // expand it automatically for a better experience
                if(filter !== "all" && isMatch) {
                    const grid = group.querySelector('.gallery-grid');
                    const btn = group.querySelector('.view-more-btn');
                    grid.classList.remove('collapsed');
                    if(btn) btn.textContent = 'Show Less';
                }
            });
        });
    });
});
