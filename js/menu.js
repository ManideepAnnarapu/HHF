let allItems = [];

// Show Toast Message
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 2500);
}

// Add to Cart
function addToCart(itemName, weight, price, imageUrl) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existingItem = cart.find(c => c.name === itemName && c.weight === weight);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: itemName, weight, price, quantity: 1, image: imageUrl });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast(`${itemName} (${weight}) added to cart!`);
}

// Update displayed price on weight change
function updatePrice(selectElem, index, weights) {
  const selectedWeight = selectElem.value;
  document.getElementById(`price-${index}`).innerText = weights[selectedWeight] || '';
}

// Render items of selected category
function loadMenu(category) {
  const menuItemsDiv = document.getElementById("menu-items");
  menuItemsDiv.innerHTML = "";

  const items = allItems.filter(item => item.category.toLowerCase() === category.toLowerCase());

  if (items.length === 0) {
    menuItemsDiv.innerHTML = "<p>No items available in this category.</p>";
    return;
  }

  items.forEach((item, index) => {
    const weights = item.weights;
    const priceInitial = weights["250G"] || Object.values(weights)[0] || '';

    let weightOptions = Object.keys(weights).map(weight =>
      `<option value="${weight}">${weight}</option>`
    ).join("");

    menuItemsDiv.innerHTML += `
      <div class="menu-item">
        <img src="${item.image}" alt="${item.name}">
        <p>${item.name}</p>
        <select class="weight-select" id="weight-${index}" onchange="updatePrice(this, ${index}, ${JSON.stringify(weights).replace(/"/g, '&quot;')})">
          ${weightOptions}
        </select>
        <p class="price" id="price-${index}">${priceInitial}</p>
        <button onclick="addToCart('${item.name}', document.getElementById('weight-${index}').value, document.getElementById('price-${index}').innerText, '${item.image}')">Add To Cart</button>
      </div>
    `;
  });
}

// Update cart count on top icon
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").innerText = totalCount;
}

// On page load
window.onload = async function () {
  try {
    const res = await fetch("../items.json");
    allItems = await res.json();
    updateCartCount();
    loadMenu("snacks"); // default
  } catch (err) {
    document.getElementById("menu-items").innerHTML = `<p>Failed to load menu: ${err.message}</p>`;
    console.error("Error fetching items.json:", err);
  }
};
