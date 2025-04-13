function openCheckout() {
    fetch('../checkout.html') // ✅ because checkout.html is in root
      .then(res => res.text())
      .then(html => {
        console.log("✅ fetched checkout.html content"); // ADD THIS LINE
        const modal = document.getElementById('checkout-modal');
        modal.innerHTML = html;
        
        console.log("✅ Injected HTML into checkout-modal:", modal.innerHTML); // <-- ADD THIS

        // ✅ Load checkout.css from root
        if (!document.getElementById('checkout-css')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = '../checkout.css'; // NOT inside /js
          link.id = 'checkout-css';
          document.head.appendChild(link);
        }
  
        // ✅ Delay listener binding until DOM update completes
        setTimeout(() => {
          const form = document.getElementById('order-form');
          console.log("🔍 order-form found:", form); // <-- ADD THIS
          if (form) {
            form.addEventListener('submit', handleCheckout);
          } else {
            console.error("❌ order-form not found after DOM injection.");
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
  
    cart.forEach(item => {
      const payload = {
        name: `${firstName} ${lastName}`,
        contact,
        address,
        item: item.name,
        quantity: item.quantity,
        price: item.price,
        timestamp
      };
  
      fetch('https://script.google.com/macros/s/AKfycbxFKEyS6Z0SKvvv1vzcPwMzFbJdi6OinEK_XyKqRYehP1UqdcFL-2pyTOR89-9J8F0S/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    });
  
    localStorage.removeItem('cart');
    alert("Order placed successfully!");
    closeCheckout();
    location.reload();
  }
  