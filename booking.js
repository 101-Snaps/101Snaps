document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize EmailJS with your Public Key
    emailjs.init("kGGjkqj7LR4HVOjcg");

    const form = document.getElementById("bookingForm");
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Change button state to show progress
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        // Collect form data
        const payload = {
            from_name: document.getElementById("name").value,
            from_email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            package: document.getElementById("packageSelect").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            message: document.getElementById("message").value
        };

        try {
            // 2. Send Email to YOU (the Photographer)
            await emailjs.send(
                "service_ake97m1",
                "template_uqxe8ka",
                payload
            );

            // 3. Send Confirmation Email to the CLIENT
            await emailjs.send(
                "service_ake97m1",
                "template_83kcztn",
                {
                    to_email: payload.from_email,
                    to_name: payload.from_name,
                    package: payload.package,
                    date: payload.date,
                    time: payload.time
                }
            );

            alert("✅ Booking request sent! Check your email for confirmation.");
            form.reset();

        } catch (error) {
            console.error("EmailJS Error:", error);
            alert("❌ Sorry, something went wrong. Please try again or contact me via WhatsApp.");
        } finally {
            // Restore button state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});