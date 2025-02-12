const API_URL = "http://localhost:5000/product"; 

// 📌 Create (Добавить товар)
async function createProduct() {
    const name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    const image_url = document.getElementById("productImage").value;
    const url = document.getElementById("productUrl").value;

    if (!name || !price || !image_url || !url) {
        alert("All fields are required!");
        return;
    }

    // Если цена не начинается с "£", добавляем его
    price = price.trim();
    if (!price.startsWith("£")) {
        price = `£${parseFloat(price).toFixed(2)}`;
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, image_url, url }),
    });

    if (response.ok) {
        alert("Product added!");
        readProducts();
    } else {
        alert("Error adding product!");
    }
}

// 📌 Read (Получить товары)
async function readProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();

        const productsDiv = document.getElementById("products");
        productsDiv.innerHTML = "";

        products.forEach(product => {
            productsDiv.innerHTML += `
                <div class="product">
                    <img src="${product.image_url}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Price: ${product.price}</p>
                    <a href="${product.url}" target="_blank">View Product</a><br>
                    <button onclick="addToCart('${product._id}', '${product.name}', '${product.price}', '${product.image_url}', '${product.url}')">
                        Add to Cart
                    </button>
                    <button onclick="deleteProduct('${product._id}')">Delete</button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}


// 📌 Update (Обновить товар по URL)
async function updateProduct() {
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
        headers: { "Content-Type": "application/json" },
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
    if (!confirm("Are you sure?")) return;
    
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    
    if (response.ok) {
        alert("Product deleted!");
        readProducts();
    } else {
        alert("Error deleting product!");
    }
}

document.addEventListener("DOMContentLoaded", readProducts);
