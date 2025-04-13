// Load Cart Items from localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartDiv = document.getElementById('cart-items');
    let total = 0;
    cartDiv.innerHTML = '';

    if (cart.length === 0) {
        cartDiv.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById('total-price').innerText = "0RM";
        return;
    }

    cart.forEach((item, index) => {
        const priceValue = parseFloat(item.price.replace('RM', ''));
        total += item.quantity * priceValue;

        cartDiv.innerHTML += `
            <div class="cart-item">
                <div class="item-left">
                    <img src="${item.image || 'images/default-product.jpg'}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>${item.weight} | ${item.price}</p>
                    </div>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">−</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="manualUpdate(${index}, this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    <span class="remove-icon" onclick="removeItem(${index})">&#128465;</span>
                </div>
            </div>
        `;
    });

    document.getElementById('total-price').innerText = `${total}RM`;
}

// Update Quantity (using buttons)
function updateQuantity(index, newValue) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    newValue = parseInt(newValue);

    if (newValue < 1) return;

    cart[index].quantity = newValue;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Manual Quantity Input
function manualUpdate(index, value) {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity >= 1) {
        updateQuantity(index, quantity);
    } else {
        loadCart();
    }
}

// Remove Item
function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// 🚫 Deprecated (you now use openCheckout())
function checkout() {
    alert("Proceeding to checkout...");
}

// Load cart on page ready
document.addEventListener("DOMContentLoaded", loadCart);
