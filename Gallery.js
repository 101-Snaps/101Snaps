/**
 * gallery.js - Handles all gallery functionality with automatic thumbnail generation
 * Features:
 * - Automatic thumbnail creation from full-size images
 * - Lazy loading for better performance
 * - Lightbox for full-size viewing
 * - Filtering by category
 * - "Show more" functionality
 */

// ========== CONFIGURATION ==========
const GALLERY_CONFIG = {
    thumbnailSize: 300, // Thumbnail width in pixels
    itemsPerRow: 4,      // Number of items per row (for max-height calculation)
    rowHeight: 340,      // Approximate height of one row in pixels
};

// ========== IMAGE DATABASE ==========
// This object contains all image paths organized by category
// In production, this could be loaded from a JSON file or CMS
const IMAGES = {
    graduations: {
        count: 24,
        path: 'Images/Graduations/grad',
        alt: 'Graduation photo'
    },
    birthdays: {
        count: 16,
        path: 'Images/Birthdays/snap',
        alt: 'Birthday celebration'
    },
    maternity: {
        count: 8,
        path: 'Images/Maternity/snap',
        alt: 'Maternity session'
    },
    portraits: {
        count: 32,
        path: 'Images/Portraits/snap',
        alt: 'Studio portrait'
    },
    products: {
        count: 8,
        path: 'Images/Products/snap',
        alt: 'Product photography'
    }
};

// ========== PACKAGE DATA ==========
const PACKAGES = {
    graduations: [
        {
            name: 'Grad Mini',
            price: 'R1200',
            description: '30-45 min • 15 edited photos',
            features: ['1 location', '24 hour turnaround'],
            category: 'graduation'
        },
        {
            name: 'Grad Standard',
            price: 'R2000',
            description: '1-1.5 hour • 25 edited photos',
            features: ['2 outfits', '5 professionally retouched', 'Up to 10 family members', 'Studio or outdoor'],
            category: 'graduation'
        },
        {
            name: 'Grad Deluxe',
            price: 'R2800',
            description: '2 hours • Up to 40 edited photos',
            features: ['2 outfits', '20 professionally retouched', 'Up to 20 family members', 'Studio or outdoor'],
            category: 'graduation'
        }
        {
    name: 'TUT Graduate Special',
    price: 'R1000',
    description: '30-45 min • 15 professionally edited photos',
    features: [
        '1 location','Outdoor session','Valid for TUT graduates only','Student card required','24 hour turnaround','Limited offer (15 May – 15 June)'
    ],
    category: 'graduation',
    special: true
}
    ],
    birthdays: [
        {
            name: 'Birthday Mini',
            price: 'R1200',
            description: '45 min • 15 edited photos',
            features: ['Up to 5 friends/family', '24 hour turnaround'],
            category: 'birthday'
        },
        {
            name: 'Birthday Standard',
            price: 'R1800',
            description: '1 hour • 25 edited photos',
            features: ['5 retouched', 'Up to 12 people', '2 outfits', '24-48 hour turnaround'],
            category: 'birthday'
        },
        {
            name: 'Birthday Deluxe',
            price: 'R2800',
            description: '2 hours • Full event coverage',
            features: ['2 outfits', '10 professionally retouched', 'Up to 20 people', '2 x A4 framed prints'],
            category: 'birthday'
        }
    ],
    maternity: [
        {
            name: 'Mom Only',
            price: 'R1300',
            description: '45 min • 15 edited photos',
            features: ['Baby OR Maternity only', '48 hour turnaround'],
            category: 'maternity'
        },
        {
            name: 'Couple Session',
            price: 'R2200',
            description: '1-1.5 hour • 25 edited photos',
            features: ['Newborn + Partner', '5 professionally retouched', '2 outfits', 'Studio or outdoor'],
            category: 'maternity'
        },
        {
            name: 'Maternity & Newborn',
            price: 'R3200',
            description: '2 hours • 40 edited photos',
            features: ['10 professionally retouched', 'Partner + up to 5 family', '2 x A4 framed prints', 'In-home newborn shoot'],
            category: 'maternity'
        }
    ],
    portraits: [
        {
            name: 'Portraits',
            price: 'R1500',
            description: '30-45 min • 15 edited photos',
            features: ['1 outfit/look', 'Studio only', 'Solo shoot', '24 hour turnaround'],
            category: 'portrait'
        },
        {
            name: 'Models/Editorial',
            price: 'R2200',
            description: '1-1.5 hour • 25 edited photos',
            features: ['5 professionally retouched', 'Up to 2 outfits', 'Studio only', '24-48 hour turnaround'],
            category: 'portrait'
        },
        {
            name: 'Artistic Nude',
            price: 'R3000',
            description: '2 hours • 40 edited photos',
            features: ['10 professionally retouched', 'Up to 3 outfits', 'Studio/outdoor', '48 hour turnaround'],
            category: 'portrait'
        }
    ],
    products: [
        {
            name: 'Product Mini',
            price: 'R1500',
            description: '30-45 min • 10 edited photos',
            features: ['1 product', 'Clean background', 'Web & social ready', '24-48 hour turnaround'],
            category: 'product'
        },
        {
            name: 'Product Standard',
            price: 'R2500',
            description: '1-1.5 hour • 20 edited photos',
            features: ['Up to 3 products', 'Multiple angles', 'Advanced lighting', '24-48 hour turnaround'],
            category: 'product'
        },
        {
            name: 'Product Deluxe',
            price: 'R3800',
            description: '2-3 hours • 35+ edited photos',
            features: ['Up to 6 products', 'Creative concepts', 'High-end retouching', '48 hour turnaround'],
            category: 'product'
        }
    ]
};

// ========== AUTOMATIC THUMBNAIL GENERATION ==========

/**
 * Creates a thumbnail URL from a full-size image URL
 * In a production environment, this would use a CDN or server-side thumbnails
 * For now, we use a smart approach: if thumbnails exist, use them; otherwise use full-size
 * 
 * @param {string} fullSizeUrl - Path to full-size image
 * @returns {string} - Path to thumbnail (or full-size if thumbnails don't exist)
 */
function getThumbnailUrl(fullSizeUrl) {
    // Check if we're in development mode (using placeholder SVGs)
    if (fullSizeUrl.includes('data:image/svg+xml')) {
        return fullSizeUrl; // SVGs don't need thumbnails
    }
    
    // Try to use thumbnail path first (Images/Category/thumbnails/filename.jpg)
    const thumbnailPath = fullSizeUrl.replace(/\/([^/]+)\.(jpg|jpeg|png|gif)$/, '/thumbnails/$1.$2');
    
    // Note: In a real implementation, you'd check if the thumbnail exists
    // For now, we'll return the thumbnail path and let the error handler fall back to full-size
    return thumbnailPath;
}

/**
 * Handles image loading errors - falls back to full-size image
 * @param {HTMLImageElement} img - The image element that failed to load
 */
function handleImageError(img) {
    console.log('Thumbnail not found, loading full-size image:', img.dataset.full);
    if (img.dataset.full && img.src !== img.dataset.full) {
        img.src = img.dataset.full; // Fall back to full-size
    }
}

/**
 * Creates an image element with automatic thumbnail support
 * @param {string} fullPath - Path to full-size image
 * @param {string} altText - Alt text for accessibility
 * @returns {HTMLDivElement} - Gallery item div containing the image
 */
function createGalleryItem(fullPath, altText) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'gallery-item';
    
    const img = document.createElement('img');
    
    // Store full-size path for lightbox
    img.dataset.full = fullPath;
    
    // Try to load thumbnail first
    img.src = getThumbnailUrl(fullPath);
    img.alt = altText;
    img.loading = 'lazy'; // Enable native lazy loading
    
    // Add loading class for animation
    img.classList.add('loading');
    
    // Handle successful load
    img.onload = () => {
        img.classList.remove('loading');
    };
    
    // Handle thumbnail error - fall back to full-size
    img.onerror = () => {
        if (img.src !== img.dataset.full) {
            img.src = img.dataset.full; // Try full-size
        } else {
            // If full-size also fails, use placeholder
            img.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Crect width=\'300\' height=\'300\' fill=\'%23334455\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23ffffff\' font-size=\'18\' text-anchor=\'middle\' dy=\'.3em\'%3EImage not found%3C/text%3E%3C/svg%3E';
        }
        img.classList.remove('loading');
    };
    
    itemDiv.appendChild(img);
    return itemDiv;
}

// ========== GALLERY POPULATION ==========

/**
 * Populates all galleries with images
 */
function populateGalleries() {
    Object.entries(IMAGES).forEach(([category, data]) => {
        const gridId = `${category}-grid`;
        const grid = document.getElementById(gridId);
        
        if (!grid) {
            console.warn(`Grid not found: ${gridId}`);
            return;
        }
        
        // Clear loading placeholder
        grid.innerHTML = '';
        
        // Generate image elements
        for (let i = 1; i <= data.count; i++) {
            const fullPath = `${data.path}${i}.jpg`;
            const altText = `${data.alt} ${i}`;
            const item = createGalleryItem(fullPath, altText);
            grid.appendChild(item);
        }
    });
}

/**
 * Populates all package sections
 */
function populatePackages() {
    Object.entries(PACKAGES).forEach(([category, packages]) => {
        const containerId = `${category}-packages`;
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn(`Package container not found: ${containerId}`);
            return;
        }
        
        container.innerHTML = '';
        
        packages.forEach(pkg => {
            const card = document.createElement('div');
            card.className = 'package-card';
            card.dataset.category = pkg.category;
            
            card.innerHTML = `
                <h3>${pkg.name}</h3>
                <div class="package-price">${pkg.price}</div>
                <p class="package-details">${pkg.description}</p>
                <ul class="package-features">
                    ${pkg.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <a href="#booking" class="btn btn-primary" data-package="${pkg.name} — ${pkg.price}">Book Now</a>
            `;
            
            container.appendChild(card);
        });
    });
}

// ========== LIGHTBOX FUNCTIONALITY ==========

/**
 * Initializes lightbox functionality
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lbContent = document.getElementById('lbContent');
    const lbClose = document.getElementById('lbClose');
    
    if (!lightbox || !lbContent || !lbClose) return;
    
    // Open lightbox when clicking gallery items
    document.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (!galleryItem) return;
        
        const img = galleryItem.querySelector('img');
        if (!img) return;
        
        // Use full-size image for lightbox
        const fullSizeSrc = img.dataset.full || img.src;
        
        const fullImg = document.createElement('img');
        fullImg.src = fullSizeSrc;
        fullImg.alt = img.alt;
        
        lbContent.innerHTML = '';
        lbContent.appendChild(fullImg);
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    };
    
    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            closeLightbox();
        }
    });
}

// ========== FILTER FUNCTIONALITY ==========

/**
 * Initializes gallery filter buttons
 */
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryGroups = document.querySelectorAll('.gallery-group');
    const packageSections = document.querySelectorAll('.packages-section');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter gallery groups
            galleryGroups.forEach(group => {
                const category = group.dataset.category;
                if (filter === 'all' || category === filter) {
                    group.style.display = 'block';
                } else {
                    group.style.display = 'none';
                }
            });
            
            // Filter package sections
            packageSections.forEach(section => {
                const category = section.dataset.category;
                if (filter === 'all' || category === filter) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

// ========== SHOW MORE FUNCTIONALITY ==========

/**
 * Initializes "Show more" buttons
 */
function initShowMoreButtons() {
    document.querySelectorAll('.show-more-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const gridId = btn.dataset.grid;
            const grid = document.getElementById(gridId);
            
            if (!grid) return;
            
            grid.classList.toggle('expanded');
            btn.textContent = grid.classList.contains('expanded') ? 'Show less' : 'Show more';
        });
    });
}

// ========== PACKAGE TO BOOKING FILL ==========

/**
 * Sets up package buttons to pre-fill booking form
 */
function initPackageButtons() {
    document.addEventListener('click', (e) => {
        const bookBtn = e.target.closest('[data-package]');
        if (!bookBtn) return;
        
        e.preventDefault();
        
        const packageName = bookBtn.dataset.package;
        const select = document.getElementById('packageSelect');
        
        if (select) {
            // Find and select matching option
            for (let opt of select.options) {
                if (opt.text.includes(packageName) || packageName.includes(opt.text)) {
                    opt.selected = true;
                    break;
                }
            }
        }
        
        // Scroll to booking section
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
}

// ========== INITIALIZATION ==========

/**
 * Main initialization function
 */
function initGallery() {
    console.log('Initializing gallery with automatic thumbnail support...');
    
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    // Populate content
    populateGalleries();
    populatePackages();
    
    // Initialize functionality
    initLightbox();
    initFilters();
    initShowMoreButtons();
    initPackageButtons();
}

// Run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGallery);