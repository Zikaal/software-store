const API = "https://software-store.onrender.com";


window.addToCart = async function addToCart(productId, name, price, image_url, url) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("You must be logged in to add items to your cart.");
        window.location.href = "login.html";
        return;
    }

    console.log("📌 Sending Add to Cart request with data:", {
        userId, productId, name, price, image_url, url
    });

    const response = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, name, price, image_url, url }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("❌ Server error:", text);
        alert(`Error adding to cart: ${text}`);
        return;
    }

    const data = await response.json();
    console.log("✅ Server Response:", data);

    alert("Added to cart!");
}


// 📌 Загрузка корзины
async function loadCart() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("You must be logged in to view your cart.");
        window.location.href = "login.html";
        return;
    }

    const response = await fetch(`${API}/cart/${userId}`);
    const data = await response.json();

    const cartDiv = document.getElementById("cartItems");
    cartDiv.innerHTML = "";

    if (data.products.length === 0) {
        cartDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    data.products.forEach(product => {
        cartDiv.innerHTML += `
            <div class="cart-item">
                <img src="${product.image_url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
                <button onclick="removeFromCart('${product.productId}')">Remove</button>
            </div>
        `;
    });
}

// 📌 Удалить товар из корзины
async function removeFromCart(productId) {
    const userId = localStorage.getItem("userId");
    await fetch(`${API}/cart/${userId}/${productId}`, { method: "DELETE" });
    loadCart();
}

document.addEventListener("DOMContentLoaded", loadCart);
