const databaseUrl = "https://weblab6-2f3f4-default-rtdb.firebaseio.com/firebase.json";

// Функція для отримання Toasts з Firebase
async function loadToasts() {
    try {
        const response = await fetch(databaseUrl);
        if (response.ok) {
            const toasts = await response.json();
            renderToasts(toasts || []);
        } else {
            console.error("Помилка завантаження:", response.statusText);
        }
    } catch (error) {
        console.error("Помилка:", error);
    }
}

// Функція для відображення Toasts
function renderToasts(toasts) {
    const toastsContainer = document.getElementById("toastsContainer");
    toastsContainer.innerHTML = "";

    toasts.forEach((toast) => {
        const toastElement = document.createElement("div");
        toastElement.classList.add("toast");
        toastElement.style.border = "1px solid gray";
        toastElement.style.margin = "10px";
        toastElement.style.padding = "10px";
        toastElement.innerHTML = `
      <h3>${toast.title}</h3>
      <p>${toast.message}</p>
      <small>${new Date(toast.timestamp).toLocaleString()}</small>
    `;
        toastsContainer.appendChild(toastElement);
    });
}

// Завантаження Toasts при завантаженні сторінки
document.addEventListener("DOMContentLoaded", loadToasts);
