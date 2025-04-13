const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxFKEyS6Z0SKvvv1vzcPwMzFbJdi6OinEK_XyKqRYehP1UqdcFL-2pyTOR89-9J8F0S/exec';

let allItems = [];

// Show Toast Message
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 2500);
}

// Add to Cart
function addToCart(itemName, weight, price, imageUrl) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let existingItem = cart.find(c => c.name === itemName && c.weight === weight);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: itemName, weight, price, quantity: 1, image: imageUrl });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${itemName} (${weight}) added to cart!`);
}

// Load and display items by category
function loadMenu(category) {
  const menuItemsDiv = document.getElementById('menu-items');
  menuItemsDiv.innerHTML = '';

  const items = allItems.filter(item =>
    item["Category "]?.trim().toLowerCase() === category.toLowerCase()
  );

  if (items.length === 0) {
    menuItemsDiv.innerHTML = '<p>No items available in this category.</p>';
    return;
  }

  items.forEach((item, index) => {
    const weights = {
      "250G": item["Price 250G"],
      "500G": item["Price 500G"],
      "1000G": item["Price 1000G"]
    };

    let weightOptions = Object.keys(weights).map(w =>
      `<option value="${w}">${w}</option>`
    ).join('');

    const priceInitial = weights["250G"] || '';

    menuItemsDiv.innerHTML += `
      <div class="menu-item">
        <img src="${item["Image URL"]}" alt="${item["Item Name"]}">
        <p>${item["Item Name"]}</p>
        <select class="weight-select" id="weight-${index}" onchange="updatePrice(this, ${index}, ${JSON.stringify(weights).replace(/"/g, '&quot;')})">
          ${weightOptions}
        </select>
        <p class="price" id="price-${index}">${priceInitial}</p>
        <button onclick="addToCart('${item["Item Name"]}', document.getElementById('weight-${index}').value, document.getElementById('price-${index}').innerText, '${item["Image URL"]}')">Add To Cart</button>
      </div>
    `;
  });
}

// Update price on weight change
function updatePrice(selectElem, index, weights) {
  const selectedWeight = selectElem.value;
  document.getElementById(`price-${index}`).innerText = weights[selectedWeight] || '';
}

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').innerText = count;
}

// Fetch menu data on load
window.onload = async function () {
  try {
    const res = await fetch(GOOGLE_SHEET_URL);
    allItems = await res.json();
    updateCartCount();
    loadMenu('Snacks'); // default category
  } catch (err) {
    document.getElementById('menu-items').innerHTML = '<p>Failed to load menu: ' + err.message + '</p>';
    console.error('Failed to fetch menu items:', err);
  }
}
