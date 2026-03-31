let productList = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
// Fetch products from API
async function getProducts() {
    try {
        let container = document.getElementById("product-container");
        container.innerHTML = "Loading products...";
        let response = await fetch("https://corsproxy.io/?https://fakestoreapi.com/products");
        let data = await response.json();
        productList = data;
        showProducts(productList);
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}
// Display products on screen
function showProducts(products) {
    let container = document.getElementById("product-container");
    container.innerHTML = "";
    if (products.length === 0) {
        container.innerHTML = "<p>No products found</p>";
        return;
    }

    products.forEach(product => {
        let card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-content">
                <img src="${product.image}" />
                <h3>${product.title}</h3>
                <p><b>$${product.price}</b></p>
                <p class="category">${product.category}</p>
            </div>

            <button onclick="addToCart(${product.id},this)">Add to Cart</button>
        `;

        container.appendChild(card);
    });
}

getProducts();
function addToCart(id, btn) {
    let product = productList.find(item => item.id === id);

    let existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    btn.innerText = "Added!";
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = "Add to Cart";
        btn.disabled = false;
    }, 1000);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    showCart();
}

function updateCartCount() {
    let count = 0;

    cart.forEach(item => {
        count += item.quantity;
    });

    document.getElementById("cart-count").innerText = count;
}
updateCartCount();

function showCart() {

    let container = document.getElementById("cart-items");
    let total = 0;
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
    <div class="empty-cart">
        <h3>Your cart feels lonely 🛒</h3>
        <p>Add some products to make it happy!</p>
    </div>
`;
        document.getElementById("total-price").innerText = "Total: $0";
        return;
    }
    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        let div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
        <span>
    ${item.title} - $${item.price} &nbsp; × &nbsp; <span class="qty">${item.quantity}</span>
</span>
        <button onclick="removeFromCart(${index})">Remove</button>
        `;

        container.appendChild(div);
    });

    document.getElementById("total-price").innerText = "Total: $" + total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showCart();
}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    let searchValue = searchInput.value.toLowerCase();

    let filteredProducts = productList.filter(product =>
        product.title.toLowerCase().includes(searchValue)
    );

    showProducts(filteredProducts);
});

document.getElementById("topBtn").onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

document.getElementById("sortSelect").addEventListener("change", function () {
    let value = this.value;

    let sorted = [...productList];

    if (value === "low") {
        sorted.sort((a, b) => a.price - b.price);
    } else if (value === "high") {
        sorted.sort((a, b) => b.price - a.price);
    }

    showProducts(sorted);
});

updateCartCount();
showCart();
