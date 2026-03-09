const buttons = document.querySelectorAll('.btn-add');
const cartBody = document.getElementById('cart-body');
const totalPriceDisplay = document.getElementById('total-price');


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
            // --- ADD LOGIC ---
            if (cartBody.querySelector('#empty-row')) cartBody.innerHTML = '';

            btn.innerHTML = 'Remove <ion-icon name="remove-circle-outline"></ion-icon>';

            // Keep TR on one line to avoid extra whitespace/rows
            const rowId = `row-${name.replace(/\s+/g, '')}`;
            cartBody.insertAdjacentHTML('beforeend', `<tr id="${rowId}"><td>${cartBody.children.length + 1}</td><td>${name}</td><td>₹${priceValue}</td></tr>`);

            totalAmount += priceValue;
            if(errorDisplay) errorDisplay.style.display = 'none';

        } else {
            // --- REMOVE LOGIC ---
            btn.innerHTML = 'Add Item <ion-icon name="add-circle-outline"></ion-icon>';

            const rowToRemove = document.getElementById(`row-${name.replace(/\s+/g, '')}`);
            if (rowToRemove) {
                rowToRemove.remove();
                totalAmount -= priceValue;
            }

            updateSerialNumbers();

            // Restore "Empty" state
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

// --- BOOKING LOGIC ---
// 1. Update the selectors to match my new IDs
const bookBtn = document.querySelector('.btn-book');
const errorDisplay = document.getElementById('error-mssg');

bookBtn.addEventListener('click', () => {
    // 2. Get Input Values using my NEW IDs
    const name = document.getElementById('full-name').value.trim();
    const email = document.getElementById('the-email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // 3. Check if cart is empty (using my existing cartBody variable)
    const isCartEmpty = cartBody.querySelector('#empty-row') || cartBody.children.length === 0;

    // 4. Validation Logic
    // 4. Validation Logic
const emailInput = document.getElementById('the-email');
const phoneInput = document.getElementById('phone');

// Check if HTML patterns/required rules are met
const isEmailValid = emailInput.checkValidity();
const isPhoneValid = phoneInput.checkValidity();

if (isCartEmpty || name === "" || !isEmailValid || !isPhoneValid) {
    errorDisplay.style.display = 'block';
    
    // Provide specific feedback
    if (isCartEmpty) {
        errorDisplay.innerText = "ⓘ Please add items to the cart first.";
    } else if (name === "") {
        errorDisplay.innerText = "ⓘ Please enter your full name.";
    } else if (!isEmailValid) {
        errorDisplay.innerText = "ⓘ Please use a valid @gmail.com address.";
    } else if (!isPhoneValid) {
        errorDisplay.innerText = "ⓘ Phone number must be digits only.";
    }
    
    // Scroll to the error so the user sees it
    errorDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });

        }
            else {
        // 1. Clear any old errors
        errorDisplay.style.display = 'none';
        
        // 2. Change button state to show progress
        bookBtn.innerText = "Sending Confirmation...";
        bookBtn.disabled = true;
    
        // First Timeout: Simulate the 1.5s "Email Sending" process
        setTimeout(() => {
            const displayEmail = document.getElementById('display-email');
            const successDisplay = document.getElementById('success-mssg'); 
    
            if (displayEmail) displayEmail.innerText = email;
            if (successDisplay) successDisplay.style.display = 'block';
            
            bookBtn.innerText = "Booked!";
            bookBtn.style.backgroundColor = "#28a745"; // Success green
            console.log(`Booking Confirmed for: ${name}`);
    
            // Second Timeout: Wait 3 seconds, then refresh the page
            setTimeout(() => {
                window.location.reload();
            }, 3000);
    
        }, 1500);
    
    
    }
});