document.addEventListener("DOMContentLoaded", () => {
    if (typeof emailjs !== "undefined") {
        emailjs.init("dSEQQy7YWVOfpffAY");
    }

    const form = document.getElementById("bookingForm");
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById("email").value;
        const phoneInput = document.getElementById("phone").value;

        // ✅ Validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{10}$/;

        if (!emailPattern.test(emailInput)) {
            alert("⚠️ Please enter a valid email address.");
            return;
        }

        if (!phonePattern.test(phoneInput)) {
            alert("⚠️ Please enter a valid 10-digit phone number.");
            return;
        }

        submitBtn.textContent = "Sending Request...";
        submitBtn.disabled = true;

        const payload = {
            name: document.getElementById("name").value,
            email: emailInput,
            phone: phoneInput,
            package: document.getElementById("packageSelect").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            message: document.getElementById("message").value
        };

        // 1. Identify your Booking Public Key
        const BOOKING_PUBLIC_KEY = "dSEQQy7YWVOfpffAY";

        try {
            // 2. Add the key as the 4th parameter in the send() function
            await emailjs.send(
                "service_ake97m1",
                "template_uqxe8ka",
                payload,
                BOOKING_PUBLIC_KEY // <--- THIS IS THE FIX
            );

            // 3. Do the same for the auto-reply template
            await emailjs.send(
                "service_ake97m1",
                "template_83kcztn",
                {
                    to_email: payload.email,
                    to_name: payload.name,
                    package: payload.package,
                    date: payload.date,
                    time: payload.time
                },
                BOOKING_PUBLIC_KEY // <--- AND HERE
            );

            alert("✅ Booking request sent successfully!");
            form.reset();
        } catch (err) {
            console.error("Booking Error:", err);
            // err.text will now likely say "OK" or give a specific error
            alert("❌ Failed: " + (err.text || "Check console"));
        }finally {
            submitBtn.textContent = "Submit Booking";
            submitBtn.disabled = false;
        }
    });
});
