const API_URL = "http://localhost:5000";

// 📌 Регистрация (Signup)
async function signup() {
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
        alert("User registered successfully! Now log in.");
        window.location.href = "login.html";
    } else {
        alert("Error signing up!");
    }
}

// 📌 Вход (Login)
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
        console.log("🔍 Server response:", data);

        if (response.ok) {
            localStorage.setItem("userId", data.userId);
            alert("Logged in successfully!");
            window.location.href = "profile.html";
        } else {
            alert(`Login failed: ${data.error}`);
        }
    } catch (error) {
        console.error("❌ Login request failed:", error);
    }
}


// 📌 Загрузка профиля
async function loadProfile() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    const response = await fetch(`${API_URL}/profile/${userId}`);
    if (response.ok) {
        const user = await response.json();
        document.getElementById("profileUsername").innerText = user.username;
        document.getElementById("profileEmail").innerText = user.email;
        document.getElementById("avatar").src = user.avatar;
    } else {
        alert("Error loading profile!");
    }
}

// 📌 Выход (Logout)
function logout() {
    localStorage.removeItem("userId");
    alert("Logged out!");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("profile.html")) {
        loadProfile();
    }
});
