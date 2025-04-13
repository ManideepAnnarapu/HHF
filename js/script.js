const snackItems = [
    {
        name: "Freshly Home made Paneer",
        image: "images/items/paneer.png",
        weights: { "250G": "15RM", "500G": "28RM", "1000G": "53RM" }
    },
    {
        name: "Dry Fruit Laddus (0% Sugar)",
        image: "images/items/dryfruit.png",
        weights: { "250G": "35RM", "500G": "60RM", "1000G": "110RM" }
    },
    {
        name: "Peanut Chikki (0% Sugar)",
        image: "images/items/peanut.png",
        weights: { "250G": "10RM", "500G": "19RM", "1000G": "36RM" }
    },
    {
        name: "Sesame Chikki (0% Sugar)",
        image: "images/items/sesame.png",
        weights: { "250G": "12RM", "500G": "23RM", "1000G": "44RM" }
    },
    {
        name: "Cashew Chikki (0% Sugar)",
        image: "images/items/cashew.png",
        weights: { "250G": "22RM", "500G": "42RM", "1000G": "80RM" }
    },
    {
        name: "Ragi Flour Murukku",
        image: "images/items/murukku.png",
        weights: { "250G": "12RM", "500G": "23RM", "1000G": "44RM" }
    }
];

function loadMenu(category) {
    const menuItemsDiv = document.getElementById('menu-items');
    menuItemsDiv.innerHTML = '';

    let items = [];
    if (category === 'snacks') {
        items = snackItems;
    } 
    // Similarly, load biryani, cakes, etc. later.

    items.forEach(item => {
        let weightOptions = '';
        for (let weight in item.weights) {
            weightOptions += `<option value="${weight}">${weight}</option>`;
        }

        menuItemsDiv.innerHTML += `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}</p>
                <select class="weight-select" onchange="updatePrice(this, '${item.name}')">
                    ${weightOptions}
                </select>
                <p class="price" id="${item.name.replace(/\s+/g, '')}-price">${Object.values(item.weights)[0]}</p>
                <button onclick="addToCart('${item.name}', '${Object.values(item.weights)[0]}')">Add To Cart</button>
            </div>
        `;
    });
}

// Update price based on dropdown
function updatePrice(selectElem, itemName) {
    let selectedWeight = selectElem.value;
    let item = snackItems.find(i => i.name === itemName);
    let price = item.weights[selectedWeight];
    document.getElementById(itemName.replace(/\s+/g, '') + '-price').innerText = price;
}


function addToCart(itemName, weight, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if already added
    let existingItem = cart.find(item => item.name === itemName && item.weight === weight);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: itemName, weight: weight, price: price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(itemName + " added to cart!");
}


function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartDiv = document.getElementById('cart-items');
    let total = 0;
    cartDiv.innerHTML = '';

    cart.forEach((item, index) => {
        total += item.quantity * parseFloat(item.price.replace('RM', ''));
        cartDiv.innerHTML += `
            <div class="cart-item">
                <p>${item.name} - ${item.weight}</p>
                <p>Price: ${item.price}</p>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                <hr>
            </div>
        `;
    });

    document.getElementById('total-price').innerText = total + 'RM';
}

function updateQuantity(index, value) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity = parseInt(value);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

window.onload = function() {
    if (document.getElementById('cart-items')) {
        loadCart();
    }
}

function checkout() {
    document.getElementById('checkout-form').style.display = 'block';
}
