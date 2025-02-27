const databaseUrl = "https://weblab6-2f3f4-default-rtdb.firebaseio.com/firebase.json";

// Завантаження Toasts при завантаженні сторінки
document.addEventListener("DOMContentLoaded", loadToasts);

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

    toasts.forEach((toast, index) => {
        const toastElement = document.createElement("div");
        toastElement.classList.add("toast");
        toastElement.style.border = "1px solid gray";
        toastElement.style.margin = "10px";
        toastElement.style.padding = "10px";
        toastElement.innerHTML = `
            <h3>${toast.title}</h3>
            <p>${toast.message}</p>
            <small>${new Date(toast.timestamp).toLocaleString()}</small>
            <button onclick="deleteToast(${index})" style="margin-top: 5px;">Видалити</button>
        `;
        toastsContainer.appendChild(toastElement);
    });
}

async function deleteToast(index) {
    console.log("Видаляється запис з індексом:", index);

    const toasts = await fetchExistingToasts(); // Отримуємо всі Toasts
    console.log("Поточний список Toasts:", toasts);

    if (index >= 0 && index < toasts.length) {
        toasts.splice(index, 1); // Видаляємо Toast за індексом
        console.log("Оновлений список Toasts:", toasts);

        try {
            const response = await fetch(databaseUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(toasts),
            });

            if (response.ok) {
                console.log("Toast успішно видалено");
                showToast("Запис успішно видалено!"); // Показуємо тост
                loadToasts(); // Перезавантажуємо список Toasts
            } else {
                console.error("Помилка видалення:", response.statusText);
                showToast("Помилка видалення запису!");
            }
        } catch (error) {
            console.error("Помилка під час запиту:", error);
            showToast("Помилка підключення до сервера!");
        }
    } else {
        console.error("Некоректний індекс для видалення:", index);
    }
}


async function fetchExistingToasts() {
    try {
        const response = await fetch(databaseUrl);
        if (response.ok) {
            const data = await response.json();
            console.log("Завантажені Toasts:", data);
            return data || []; // Повертає масив
        } else {
            console.error("Помилка завантаження:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Помилка:", error);
        return [];
    }
}
function showToast(message) {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    toast.style.color = "white";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "1000";
    toast.style.fontSize = "16px";
    document.body.appendChild(toast);

    // Видаляємо тост через 3 секунди
    setTimeout(() => {
        toast.remove();
    }, 3000);
}


