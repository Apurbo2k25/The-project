const buttons = document.querySelectorAll('.btn-add');
const cartBody = document.getElementById('cart-body');
const totalPriceDisplay = document.getElementById('total-price');
const bookBtn = document.querySelector('.btn-book');
const errorDisplay = document.getElementById('error-mssg');
const successDisplay = document.getElementById('success-mssg');

let totalAmount = 0;

// Re-indexes the S.No column (1, 2, 3...)
function updateSerialNumbers() {
    const rows = cartBody.querySelectorAll('tr:not(#empty-row)');
    rows.forEach((row, index) => {
        row.querySelector('td:first-child').textContent = index + 1;
    });
}

buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const serviceLi = btn.closest('li');
        const name = serviceLi.getAttribute('data-name');
        const priceValue = parseInt(serviceLi.getAttribute('data-price'));

        btn.classList.toggle('active');

        if (btn.classList.contains('active')) {
            if (cartBody.querySelector('#empty-row')) cartBody.innerHTML = '';
            btn.innerHTML = 'Remove <ion-icon name="remove-circle-outline"></ion-icon>';

            const rowId = `row-${name.replace(/\s+/g, '')}`;
            cartBody.insertAdjacentHTML('beforeend', `<tr id="${rowId}"><td>${cartBody.children.length + 1}</td><td>${name}</td><td>₹${priceValue}</td></tr>`);

            totalAmount += priceValue;
            if(errorDisplay) errorDisplay.style.display = 'none';
        } else {
            btn.innerHTML = 'Add Item <ion-icon name="add-circle-outline"></ion-icon>';
            const rowToRemove = document.getElementById(`row-${name.replace(/\s+/g, '')}`);
            if (rowToRemove) {
                rowToRemove.remove();
                totalAmount -= priceValue;
            }
            updateSerialNumbers();

            if (cartBody.querySelectorAll('tr').length === 0) {
                totalAmount = 0; 
                cartBody.innerHTML = `
                    <tr id="empty-row">
                        <td colspan="3" style="text-align: center; padding: 20px;">
                            <img src="img/info.png" alt="info" style="width: 50px; margin-bottom: 10px;">
                            <h5>No items added yet</h5>
                            <p style="font-size: 0.9rem; color: #666;">Add items to the cart from the services bar.</p>
                        </td>
                    </tr>`;
            }
        }
        totalPriceDisplay.textContent = `₹${totalAmount}`;
    });
});

// --- BOOKING LOGIC WITH EMAILJS ---
bookBtn.addEventListener('click', () => {
    const name = document.getElementById('full-name').value.trim();
    const email = document.getElementById('the-email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const emailInput = document.getElementById('the-email');
    const phoneInput = document.getElementById('phone');

    const isEmailValid = emailInput.checkValidity();
    const isPhoneValid = phoneInput.checkValidity();
    const isCartEmpty = cartBody.querySelector('#empty-row') || cartBody.children.length === 0;

    if (isCartEmpty || name === "" || !isEmailValid || !isPhoneValid) {
        errorDisplay.style.display = 'block';
        if (isCartEmpty) {
            errorDisplay.innerText = "ⓘ Please add items to the cart first.";
        } else if (name === "") {
            errorDisplay.innerText = "ⓘ Please enter your full name.";
        } else if (!isEmailValid) {
            errorDisplay.innerText = "ⓘ Please use a valid @gmail.com address.";
        } else if (!isPhoneValid) {
            errorDisplay.innerText = "ⓘ Phone number must be digits only.";
        }
        errorDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        errorDisplay.style.display = 'none';
        bookBtn.innerText = "Sending...";
        bookBtn.disabled = true;

        // Prepare EmailJS Data
        const templateParams = {
            from_name: name,
            to_email: email,
            phone_number: phone,
            total_price: `₹${totalAmount}`
        };

        // Send actual email
        emailjs.send('service_wp3jx25', 'template_i7pz2gq', templateParams)
            .then(() => {
                // SUCCESS: Show the exact message the mentor requested
                successDisplay.innerText = "✔ Thank you For Booking the Service We will get back to you soon!";
                successDisplay.style.display = 'block';
                bookBtn.innerText = "Confirmed!";
                bookBtn.style.backgroundColor = "#28a745";

                // RESET LOGIC (NO RELOAD)
                setTimeout(() => {
                    // 1. Clear Form
                    document.getElementById('full-name').value = "";
                    document.getElementById('the-email').value = "";
                    document.getElementById('phone').value = "";
                    
                    // 2. Clear Cart & Total
                    cartBody.innerHTML = `
                        <tr id="empty-row">
                            <td colspan="3" style="text-align: center; padding: 20px;">
                                <img src="img/info.png" alt="info" style="width: 50px; margin-bottom: 10px;">
                                <h5>No items added yet</h5>
                            </td>
                        </tr>`;
                    totalAmount = 0;
                    totalPriceDisplay.textContent = "₹0";

                    // 3. Reset Add/Remove buttons
                    buttons.forEach(btn => {
                        btn.classList.remove('active');
                        btn.innerHTML = 'Add Item <ion-icon name="add-circle-outline"></ion-icon>';
                    });

                    // 4. Reset Booking Button and Messages
                    successDisplay.style.display = 'none';
                    bookBtn.disabled = false;
                    bookBtn.innerText = "Book Now";
                    bookBtn.style.backgroundColor = ""; 
                }, 5000);

            }, (error) => {
                console.error("EmailJS Error:", error);
                alert("Failed to send email. Check your Service/Template IDs.");
                bookBtn.disabled = false;
                bookBtn.innerText = "Try Again";
            });
    }
});