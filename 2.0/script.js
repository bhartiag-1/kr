let sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWtQIzCX11FtJmyVTu-UuWLM4Thb4-s7qc1P0agp-HzzDuNzAnA1IdMG5wT20LM8uAQl38Sn270Zl9/pub?gid=0&single=true&output=csv";
let allProducts = [];

async function loadProducts() {
    try {
        let res = await fetch(sheetURL + "&t=" + new Date().getTime());
        let data = await res.text();
        let rows = data.split("\n").slice(1);

        allProducts = rows.map(row => {
            let cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Handles commas in quotes
            return {
                name: cols[0]?.replace(/"/g, '').trim(),
                price: cols[1]?.replace(/"/g, '').trim(),
                image: cols[2]?.replace(/"/g, '').trim(),
                category: cols[3]?.replace(/"/g, '').trim()
            };
        }).filter(p => p.name);

        displayProducts(allProducts);
    } catch (err) {
        console.error("Data load failed", err);
    }
}

function displayProducts(products) {
    let container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(p => {
        container.innerHTML += `
            <div class="card">
                <img src="${p.image}" onclick="viewImage('${p.image}', '${p.name}')" title="View Full Screen" onerror="this.src='https://via.placeholder.com/300'">
                <div class="card-content">
                    <h3>${p.name}</h3>
                    <div class="price">₹${p.price}</div>
                    <div class="buttons">
                        <button class="btn cart" onclick="addToCart('${p.name}', '${p.price}', '${p.image}')">🛒 Add to Cart</button>
                        <button class="btn whatsapp" onclick="orderNow('${p.name}', '${p.price}')">💬 Order on Whatsapp</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function viewImage(imgSrc, title) {
    let modal = document.getElementById("image-modal");
    let fullImg = document.getElementById("full-img");
    modal.style.display = "flex";
    fullImg.src = imgSrc;
    document.getElementById("caption").innerText = title;
}

function closeImage() {
    document.getElementById("image-modal").style.display = "none";
}

function orderNow(name, price) {
    let msg = `Hello Krishna Collection, I want to order: ${name} (₹${price})`;
    window.open(`https://wa.me/917983348682?text=${encodeURIComponent(msg)}`);
}

function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({name, price, image});
    localStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;
    alert("Item added to cart!");
}

function filterCategory(cat) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    let filtered = cat === 'All' ? allProducts : allProducts.filter(p => p.category === cat);
    displayProducts(filtered);
}

// Search Logic
document.getElementById("search").addEventListener("input", function() {
    let val = this.value.toLowerCase();
    let filtered = allProducts.filter(p => p.name.toLowerCase().includes(val));
    displayProducts(filtered);
});

loadProducts();