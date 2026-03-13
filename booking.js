/**
 * booking.js - Handles booking form submission and validation
 * Features:
 * - Form validation
 * - EmailJS integration for sending booking requests
 * - Auto-reply to customers
 * - Loading states
 */

// ========== CONFIGURATION ==========
const BOOKING_CONFIG = {
    publicKey: 'dSEQQy7YWVOfpffAY', // Replace with your actual EmailJS public key
    serviceId: 'service_ake97m1',    // Replace with your EmailJS service ID
    templateId: 'template_uqxe8ka',  // Template for admin notification
    autoReplyTemplateId: 'template_83kcztn', // Template for customer auto-reply
};

// ========== VALIDATION FUNCTIONS ==========

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/**
 * Validates phone number (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
function isValidPhone(phone) {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone.replace(/\D/g, ''));
}

/**
 * Validates date (not in past)
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {boolean} - True if date is today or in future
 */
function isValidDate(dateString) {
    if (!dateString) return true; // Date is optional
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

// ========== FORM HANDLING ==========

/**
 * Gets form data as an object
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} - Form data object
 */
function getFormData(form) {
    return {
        name: form.querySelector('#name')?.value || '',
        email: form.querySelector('#email')?.value || '',
        phone: form.querySelector('#phone')?.value || '',
        package: form.querySelector('#packageSelect')?.value || '',
        date: form.querySelector('#date')?.value || '',
        time: form.querySelector('#time')?.value || '',
        message: form.querySelector('#message')?.value || ''
    };
}

/**
 * Validates the booking form
 * @param {Object} data - Form data object
 * @returns {Object} - Validation result {isValid: boolean, errors: string[]}
 */
function validateBookingForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim()) errors.push('Email is required');
    else if (!isValidEmail(data.email)) errors.push('Please enter a valid email address');
    
    if (!data.phone.trim()) errors.push('Phone number is required');
    else if (!isValidPhone(data.phone)) errors.push('Please enter a valid 10-digit phone number');
    
    if (!data.package) errors.push('Please select a package');
    
    if (data.date && !isValidDate(data.date)) {
        errors.push('Preferred date cannot be in the past');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Shows validation errors to user
 * @param {string[]} errors - Array of error messages
 */
function showErrors(errors) {
    alert('Please fix the following errors:\n• ' + errors.join('\n• '));
}

// ========== EMAIL SENDING ==========

/**
 * Sends booking notification email
 * @param {Object} data - Form data
 * @returns {Promise} - EmailJS promise
 */
async function sendBookingEmail(data) {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not loaded - simulating email send');
        return simulateEmailSend(data);
    }
    
    try {
        // Send to admin
        await emailjs.send(
            BOOKING_CONFIG.serviceId,
            BOOKING_CONFIG.templateId,
            data,
            BOOKING_CONFIG.publicKey
        );
        
        // Send auto-reply to customer
        await emailjs.send(
            BOOKING_CONFIG.serviceId,
            BOOKING_CONFIG.autoReplyTemplateId,
            {
                to_email: data.email,
                to_name: data.name,
                package: data.package,
                date: data.date,
                time: data.time
            },
            BOOKING_CONFIG.publicKey
        );
        
        return { success: true };
    } catch (error) {
        console.error('EmailJS error:', error);
        return { 
            success: false, 
            error: error.text || 'Failed to send email. Please try again.'
        };
    }
}

/**
 * Simulates email sending for development
 * @param {Object} data - Form data
 * @returns {Promise} - Simulated response
 */
function simulateEmailSend(data) {
    return new Promise((resolve) => {
        console.log('📧 SIMULATED EMAIL SEND:');
        console.log('To Admin:', data);
        console.log('Auto-reply to:', data.email);
        
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });
}

// ========== UI STATE MANAGEMENT ==========

/**
 * Sets loading state on submit button
 * @param {HTMLButtonElement} button - Submit button
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;
    } else {
        button.textContent = button.dataset.originalText || 'Submit Booking';
        button.disabled = false;
    }
}

/**
 * Shows success message
 */
function showSuccessMessage() {
    alert('✅ Booking request sent successfully! You\'ll receive a confirmation within 24 hours.');
}

/**
 * Shows error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    alert('❌ ' + message);
}

// ========== FORM RESET ==========

/**
 * Resets the booking form
 * @param {HTMLFormElement} form - The form to reset
 */
function resetForm(form) {
    form.reset();
    
    // Clear any custom styling
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// ========== MAIN FORM HANDLER ==========

/**
 * Handles booking form submission
 * @param {Event} e - Submit event
 */
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Get and validate form data
    const formData = getFormData(form);
    const validation = validateBookingForm(formData);
    
    if (!validation.isValid) {
        showErrors(validation.errors);
        return;
    }
    
    // Set loading state
    setLoadingState(submitBtn, true);
    
    try {
        // Send emails
        const result = await sendBookingEmail(formData);
        
        if (result.success) {
            showSuccessMessage();
            resetForm(form);
        } else {
            showErrorMessage(result.error);
        }
    } catch (error) {
        showErrorMessage('An unexpected error occurred. Please try again.');
        console.error('Booking error:', error);
    } finally {
        // Reset loading state
        setLoadingState(submitBtn, false);
    }
}

// ========== REAL-TIME VALIDATION ==========

/**
 * Adds real-time validation to form fields
 * @param {HTMLFormElement} form - The form to enhance
 */
function addRealTimeValidation(form) {
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Auto-format: remove non-digits
            e.target.value = e.target.value.replace(/\D/g, '');
        });
        
        phoneInput.addEventListener('blur', (e) => {
            if (e.target.value && !isValidPhone(e.target.value)) {
                e.target.style.borderColor = '#ff4444';
            } else {
                e.target.style.borderColor = '';
            }
        });
    }
    
    const emailInput = form.querySelector('#email');
    if (emailInput) {
        emailInput.addEventListener('blur', (e) => {
            if (e.target.value && !isValidEmail(e.target.value)) {
                e.target.style.borderColor = '#ff4444';
            } else {
                e.target.style.borderColor = '';
            }
        });
    }
    
    const dateInput = form.querySelector('#date');
    if (dateInput) {
        dateInput.addEventListener('blur', (e) => {
            if (e.target.value && !isValidDate(e.target.value)) {
                e.target.style.borderColor = '#ff4444';
            } else {
                e.target.style.borderColor = '';
            }
        });
    }
}

// ========== POPULATE PACKAGE DROPDOWN ==========

/**
 * Populates the package select dropdown from PACKAGES data
 * Note: This function accesses the global PACKAGES object from gallery.js
 */
function populatePackageDropdown() {
    const select = document.getElementById('packageSelect');
    if (!select) return;
    
    // Clear existing options (except first)
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Check if PACKAGES is available (from gallery.js)
    if (typeof PACKAGES === 'undefined') {
        console.warn('PACKAGES not found - using fallback options');
        // Add fallback options
        const fallbackPackages = [
           // Graduations
    'Grad Mini — R1200',
    'Grad Standard — R2000',
    'Grad Deluxe — R2800',
    'TUT Graduate Special — R750',

    // Birthdays
    'Birthday Mini — R1200',
    'Birthday Standard — R1800',
    'Birthday Deluxe — R2800',

    // Maternity
    'Mom Only — R1300',
    'Couple Session — R2200',
    'Maternity & Newborn — R3200',

    // Portraits
    'Portraits — R1500',
    'Models/Editorial — R2200',
    'Artistic Nude — R3000',

    // Products
    'Product Mini — R1500',
    'Product Standard — R2500',
    'Product Deluxe — R3800'
        ];
        
        fallbackPackages.forEach(pkg => {
            const option = document.createElement('option');
            option.textContent = pkg;
            select.appendChild(option);
        });
        return;
    }
    
    // Populate from PACKAGES object
    Object.values(PACKAGES).forEach(categoryPackages => {
        categoryPackages.forEach(pkg => {
            const option = document.createElement('option');
            option.textContent = `${pkg.name} — ${pkg.price}`;
            select.appendChild(option);
        });
    });
}

// ========== INITIALIZATION ==========

/**
 * Initializes booking functionality
 */
function initBooking() {
    console.log('Initializing booking form...');
    
    // Get booking form
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) {
        console.warn('Booking form not found');
        return;
    }
    
    // Initialize EmailJS if available
    if (typeof emailjs !== 'undefined') {
        emailjs.init(BOOKING_CONFIG.publicKey);
        console.log('EmailJS initialized');
    } else {
        console.warn('EmailJS not loaded - running in development mode');
    }
    
    // Populate package dropdown
    populatePackageDropdown();
    
    // Add real-time validation
    addRealTimeValidation(bookingForm);
    
    // Add submit handler
    bookingForm.addEventListener('submit', handleBookingSubmit);
    
    // Add input cleanup for phone
    const phoneInput = bookingForm.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initBooking);