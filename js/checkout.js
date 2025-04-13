function openCheckout() {
  fetch('../checkout.html')
    .then(res => res.text())
    .then(html => {
      console.log("✅ Fetched checkout.html content");
      const modal = document.getElementById('checkout-modal');
      modal.innerHTML = html;

      console.log("✅ Injected HTML into checkout-modal:", modal.innerHTML);

      // Load checkout.css once
      if (!document.getElementById('checkout-css')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../checkout.css';
        link.id = 'checkout-css';
        document.head.appendChild(link);
      }

      // Bind submit event after DOM loads
      setTimeout(() => {
        const form = document.getElementById('order-form');
        console.log("🔍 Found form:", form);
        if (form) {
          form.addEventListener('submit', handleCheckout);
        } else {
          console.error("❌ order-form not found after injection.");
        }
      }, 500);
    })
    .catch(err => {
      console.error("❌ Failed to load checkout.html:", err);
    });
}

function closeCheckout() {
  document.getElementById('checkout-modal').innerHTML = '';
}

function handleCheckout(e) {
  e.preventDefault();

  const form = e.target;
  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const contact = form.contact.value.trim();
  const address = form.address.value.trim();
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const timestamp = new Date().toISOString();

  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  console.log("🛒 Submitting order for:", cart.length, "items");

  let submissionCount = 0;

  cart.forEach((item, index) => {
    const payload = {
      name: `${firstName} ${lastName}`,
      contact,
      address,
      item: item.name,
      quantity: item.quantity,
      price: item.price,
      timestamp
    };

    console.log(`📦 Sending item ${index + 1}:`, payload);

    fetch('https://script.google.com/macros/s/AKfycbx1X9xv7R4mXVcn4HyYkUAULlDUSK3tS-5gLmTKIjT3BzrhiRuz4WwamQaK0XsCG2mU/exec', {
      method: 'POST',
      mode: "no-cors",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => {
      submissionCount++;
      console.log(`✅ Submitted item ${index + 1}/${cart.length}`);

      // Final cleanup after all items submitted
      if (submissionCount === cart.length) {
        localStorage.removeItem('cart');
        alert("✅ Order placed successfully!");
        closeCheckout();
        location.reload();
      }
    })
    .catch(error => {
      console.error("❌ Failed to submit item:", payload, error);
    });
  });
}
