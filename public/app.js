const API_URL = "https://software-store.onrender.com/product"; 

async function createProduct() {
    const token = localStorage.getItem("token");

    const name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    const image_url = document.getElementById("productImage").value;
    const url = document.getElementById("productUrl").value;

    if (!name || !price || !image_url || !url) {
        alert("All fields are required!");
        return;
    }

    price = price.trim();
    if (!price.startsWith("£")) {
        price = `£${parseFloat(price).toFixed(2)}`;
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, price, image_url, url }),
    });

    if (response.ok) {
        alert("Product added!");
        readProducts();
    } else {
        alert("Error adding product!");
    }
}

async function updateProduct() {
    const token = localStorage.getItem("token");

    const url = document.getElementById("updateProductUrl").value;
    const name = document.getElementById("updateProductName").value;
    let price = document.getElementById("updateProductPrice").value;
    const image_url = document.getElementById("updateProductImage").value;

    if (!url) {
        alert("Product URL is required for update!");
        return;
    }

    // Если цена не начинается с "£", добавляем его
    if (price && !price.startsWith("£")) {
        price = `£${parseFloat(price).toFixed(2)}`;
    }

    const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, name, price, image_url }),
    });

    if (response.ok) {
        alert("Product updated!");
        readProducts();
    } else {
        alert("Error updating product!");
    }
}


// 📌 Delete (Удалить товар)
async function deleteProduct(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure?")) return;
    
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.ok) {
        alert("Product deleted!");
        readProducts();
    } else {
        alert("Error deleting product!");
    }
}

async function readProducts() {
    const response = await fetch(API_URL);
    const products = await response.json();

    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";

    const isAdmin = localStorage.getItem("isAdmin") === 'true';

    products.forEach(product => {
        productsDiv.innerHTML += `
            <div class="product">
                <img src="${product.image_url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ${product.price}</p>
                <a href="${product.url}" target="_blank">View Product</a><br>
                <button onclick="addToCart('${product._id}', '${product.name}', '${product.price}', '${product.image_url}', '${product.url}')">Add to Cart</button>
                ${isAdmin ? `<button onclick="deleteProduct('${product._id}')">Delete</button>` : ''}
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    readProducts();

    const isAdmin = localStorage.getItem("isAdmin") === 'true';
    const adminSection = document.getElementById("adminSection");
    if (isAdmin) {
        adminSection.style.display = "block";
    } else {
        adminSection.style.display = "none";
    }
});
