const API_URL = "http://localhost:5000";

// 📌 Регистрация (Signup)
async function signup() {
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const role = document.getElementById("signupRole").value;

    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
    });

    if (response.ok) {
        alert("User registered successfully! Now log in.");
        window.location.href = "login.html";
    } else {
        alert("Error signing up!");
    }
}

async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            alert("Logged in successfully!");
            window.location.href = "profile.html";
        } else {
            alert(`Login failed: ${data.error}`);
        }
    } catch (error) {
        console.error("Login request failed:", error);
        alert("An error occurred while logging in.");
    }
}

// 📌 Загрузка профиля
async function loadProfile() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!userId || !token) {
        window.location.href = "login.html";
        return;
    }

    const response = await fetch(`${API_URL}/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
        const user = await response.json();
        document.getElementById("profileUsername").innerText = user.username;
        document.getElementById("profileEmail").innerText = user.email;
        document.getElementById("avatar").src = user.avatar;
        document.getElementById("profileRole").innerText = user.role; // Добавлено для роли
    } else {
        alert("Error loading profile!");
        window.location.href = "login.html";
    }
}


// 📌 Выход (Logout)
function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    alert("Logged out!");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("profile.html")) {
        loadProfile();
    }
});
