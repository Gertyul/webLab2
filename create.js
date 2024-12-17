const databaseUrl = "https://weblab6-2f3f4-default-rtdb.firebaseio.com/firebase.json";

// Функція для отримання вже існуючих Toasts
async function fetchExistingToasts() {
    try {
        const response = await fetch(databaseUrl);
        if (response.ok) {
            const data = await response.json();
            return data || []; // Повертає масив, якщо дані є
        } else {
            console.error("Помилка завантаження:", response.statusText);
            return [];
        }
    } catch (error) {
        console.error("Помилка:", error);
        return [];
    }
}

// Функція для збереження нового Toast у Firebase
async function saveToast(newToast) {
    const existingToasts = await fetchExistingToasts();
    existingToasts.push(newToast);

    try {
        const response = await fetch(databaseUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(existingToasts),
        });

        if (response.ok) {
            alert("Toast успішно збережено!");
        } else {
            console.error("Помилка збереження:", response.statusText);
        }
    } catch (error) {
        console.error("Помилка:", error);
    }
}

// Обробка форми для створення Toast
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("toastForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const message = document.getElementById("message").value;

        if (title && message) {
            const newToast = {
                title,
                message,
                timestamp: new Date().toISOString(),
            };

            await saveToast(newToast);
            form.reset();
        } else {
            alert("Будь ласка, заповніть усі поля!");
        }
    });
});
