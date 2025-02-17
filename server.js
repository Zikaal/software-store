require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// 📌 Модель пользователя
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String, default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAMFBMVEXk5ueutLfb3t+nrrHn6eqrsbTh4+S7wMPT1tixt7rKztDBxsi3vL/q7O3Y293Q09Wdj+FKAAAFPklEQVR4nO2c25LbIAxADRZgrv7/vy042SabOyBH8g7npdP2xWckQBDQNA0Gg8FgMBgMBoPBYDAYDAaDwWAwGAwGg92BzKRlQevtL0cFQMvFOe/NhnduSfqQPtlk8SZYdY0Nxi86HswH4uKDFUrcUoR8OlJ4skoQD0zOPsKG5TDRick+E/kvZNMhdECb+Y1KsZmNZm8DsKp3YfkZPSv1x74BtP8gLGeYBwdS+NxlGzl8bT5OsUuqLRNXHVensuk4pmtOg0uGpQ24FpViQ/3l98Da6CLEyi00sNhmGcFsTgMZmgbMhrLM1hvf7lJWT+rP/8Vas1Y+sGE0CYDsictmwyfRwPTKqBCpJc7A0pdkW2i4zM+xW6VAbXEiuv7AlCKNRaIBgkrGUnsU4to7+s9wCA101DHXqEBtUqYyHBfBoeAEj+WiPLmM7qgwb2SCJHaBFWnIZCx1nkFXufwb5WldJt1dll3JGNo8gxTQXHKe0W45O3b+D1C0gwbajpeeyRDv0RDHf5kBNKWLRBz/ZQYg3XAmg+giRJCEMriTmaA9QYOEt/7Ty+CVzBtqIZXBHP9Fhs6l/LqEKjP/JRnayCCnGW1k/tSYwZ7NxjqDJoN2ArBhKcuZXGhiutDWZpP+S1sAzPOMsjmjlcHdaRJvm3t+Mb+Hss7M9PxkfkdIpC6ohwDE47/8bIbmUm440cpg1gCB/NoJoC2byhBnGWqe0f8OCBIrz2gLsxMRK88MvQvCxZkzxCvmiYhzEBg4uOTSGeWGBvm8fCJilDRsrjVNCLeaeMRlwtgIzPRrzIXOn2mUZROYTOqMDPV1ht90JRrxDvOOnpMN8ssMt0D77QYG1fIdrRto+vs/j2jbpjF93dRUcSrBoPB/CDTY8Llqfkt1lcakVH5M9E9fAd+jBP1FxpfA+nFwVGC2Vt4D8rPg5LBwHfpXwLSYt881lfJ8X2j+AvRi5lc6SpmF7yx2C+jk1ROf/O8+8StgXqNXc++j5jnQ/qLUCkzJ2zlT2meUP2d7lJHyEIhxksvqnFsXOcVDdGd4CfyH+ksa2b5cn5HnJjonzv95DPKn5u9PKSeX9yYEW6bibeGxIRjv3ZpSVpu4GxUPmYpEKPOWul87T1OBsiY7LUlyNdpE1hwL+2yB+S2VlXKcXJL8ki5CFjFBPAjGS6WT0MRolotRuq0rU4XHlVAeS3n5YXGiCVG70pWp69xMWOvpWwRBRLtzrqwj7a8VJyc+GO0f68yGbIuTt2GIJmedQNPzSL7es7Qyi0V/txgt9fAuKptOWL94xllUKg5h6lFh/dZGFKR724yt10aY9RuFAUwO98bsMx0vd19Howy7ZtiVjnX7LjsQ/d4ZdmUjwp7BAY38Kuutzn5nnrB8KcMuzH6fNQfAdVWTbahdLqFXtS7EtBH4z1BAftIdcxebeUVONXjftHRHHdxOezF9fehfgzoNxJUwLgWFZxNX0rig2sBCHBdEG9KxfwHlbn1X60JMEK4+fdZ9+SsgvOJGaV6Gguq9ko79RLYL1dehEiT5pHzN3DUJ9LdhxKXnJjdOtz9Eum7Z8oqL6GmDGJkl2UbjJQJIDF2UaQsN0lMSbJrmgIjaIAsN1fQAitu0/INtqGqQXy3j0dLUEfdxPCKq/m0qm8r/nvqdDW5/PFTq3w7g9pPApfbCfc4y6k9+Tm3rQFb7mFuq+wag9sbApvIwHbdxITZz1aBhPWRKq/qawLAsmC/UDRqMTv97UrfScNsv32BrZDgvmQVVJWNm3lR125HMqVs1gTdVLoPBYDAYDAZH4R8eaVEbhZaf7QAAAABJRU5ErkJggg==" }
}, { collection: "users" });

const User = mongoose.model("User", UserSchema);

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
}

function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    next();
}

app.post("/signup", async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User created' });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, userId: user._id });
});


// 📌 Получение профиля
app.get("/profile/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password") // Убираем пароль из ответа
            .lean(); // Ускоряет запрос

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("Profile error:", err);
        res.status(500).json({ error: "Error fetching profile" });
    }
});

// Модель товара
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    image_url: { type: String, required: true },
    url: { type: String, required: true, unique: true, index: true } 
}, { collection: "product" });

const Product = mongoose.model("Product", ProductSchema);

// 📌 Добавить товар (Create)
app.post("/product", authenticate, isAdmin,  async (req, res) => {
    try {
        let { name, price, image_url, url } = req.body;
        console.log("Received new product:", req.body);

        if (!name || !price || !image_url || !url) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Проверяем, есть ли уже символ валюты (например, "£"), если нет — добавляем "£"
        price = price.trim();
        if (!price.startsWith("£")) {
            price = `£${price}`;
        }

        const product = new Product({ name, price, image_url, url });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({ error: err.message });
    }
});

// 📌 Получить все товары (Read)
app.get("/product", async (req, res) => {
    try {
        const products = await Product.find()
            .select("name price image_url url") // Выбираем только нужные поля
            .lean(); // Ускоряет запрос

        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: err.message });
    }
});

// 📌 Обновить товар по URL (Update)
app.put("/product",authenticate, isAdmin,  async (req, res) => {
    try {
        let { name, price, image_url, url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL is required to update a product" });
        }

        const existingProduct = await Product.findOne({ url });
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Если поле пустое, оставляем старое значение
        name = name || existingProduct.name;
        price = price ? (price.startsWith("£") ? price : `£${parseFloat(price).toFixed(2)}`) : existingProduct.price;
        image_url = image_url || existingProduct.image_url;

        const updatedProduct = await Product.findOneAndUpdate(
            { url }, 
            { name, price, image_url }, 
            { new: true }
        );

        res.json(updatedProduct);
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ error: err.message });
    }
});


// 📌 Удалить товар (Delete)
app.delete("/product/:id",authenticate, isAdmin,  async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ error: err.message });
    }
});

const ObjectId = mongoose.Types.ObjectId;

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    products: [{
        productId: { type: ObjectId, ref: "Product" },
        name: String,
        price: String,
        image_url: String,
        url: String,
        quantity: { type: Number, default: 1 }
    }]
}, { collection: "cart" });

const Cart = mongoose.model("Cart", CartSchema);

// 📌 Обновляем код `app.post("/cart")`
app.post("/cart", async (req, res) => {
    try {
        const { userId, productId, name, price, image_url, url } = req.body;
        console.log("📌 Received Add to Cart request:", req.body);

        if (!userId || !productId) {
            console.log("❌ Missing required fields");
            return res.status(400).json({ error: "Missing required fields" });
        }

        let cart = await Cart.findOne({ userId });
        console.log("🔍 Existing cart:", cart);

        if (!cart) {
            console.log("🆕 Creating new cart for user:", userId);
            cart = new Cart({ userId, products: [] });
        }

        const existingProduct = cart.products.find(p => p.productId.equals(productId));
        if (existingProduct) {
            console.log("🔄 Increasing quantity for existing product:", productId);
            existingProduct.quantity += 1;
        } else {
            console.log("➕ Adding new product to cart:", productId);
            cart.products.push({ productId, name, price, image_url, url, quantity: 1 });
        }

        await cart.save();
        console.log("✅ Cart saved successfully:", cart);
        res.json(cart);
    } catch (err) {
        console.error("❌ Error adding to cart:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Получить корзину пользователя
app.get("/cart/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).lean();
        if (!cart) {
            return res.json({ products: [] });
        }
        res.json(cart);
    } catch (err) {
        console.error("❌ Error fetching cart:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// 📌 Удалить товар из корзины
app.delete("/cart/:userId/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.products = cart.products.filter(p => !p.productId.equals(productId));
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error("Error removing product from cart:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Запуск сервера
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
