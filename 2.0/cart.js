let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadCart() {
    let container = document.getElementById("cart-items-list");
    let total = 0;
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<h3 style='text-align:center; padding:20px;'>Your cart is empty.</h3>";
    }

    cart.forEach((item, index) => {
        let itemQty = item.qty || 1;
        let itemPrice = parseFloat(item.price);
        total += itemPrice * itemQty;

        container.innerHTML += `
            <div class="cart-item-row">
                <img src="${item.image}" onerror="this.src='https://via.placeholder.com/100'">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price">₹${itemPrice.toFixed(2)}</p>
                    <div class="item-controls">
                        <div class="qty-box">
                            <button onclick="changeQty(${index}, -1)">-</button>
                            <span>${itemQty}</span>
                            <button onclick="changeQty(${index}, 1)">+</button>
                        </div>
                        <button class="btn-remove" onclick="removeItem(${index})">🗑 Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    // Update Sidebar and Header
    document.getElementById("cart-item-count").innerText = cart.length;
    document.getElementById("summary-subtotal").innerText = "₹" + total.toFixed(2);
    document.getElementById("summary-total").innerText = "₹" + total.toFixed(2);
    document.getElementById("footer-subtotal").innerText = "₹" + total.toFixed(2);
}

function changeQty(index, amount) {
    if (!cart[index].qty) cart[index].qty = 1;
    cart[index].qty += amount;
    
    if (cart[index].qty <= 0) {
        removeItem(index);
    } else {
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function orderAll() {
    if (cart.length === 0) return alert("Cart is empty!");
    
    let msg = "Hello Krishna Collection, I want to order:%0A%0A";
    let total = 0;

    cart.forEach(item => {
        let q = item.qty || 1;
        let p = parseFloat(item.price);
        msg += `• ${item.name} (x${q}) - ₹${(p * q).toFixed(2)}%0A`;
        total += p * q;
    });

    msg += `%0ATotal Amount: ₹${total.toFixed(2)}`;
    window.open(`https://wa.me/917983348682?text=${msg}`);
}

loadCart();