// Виконуємо скрипт після завантаження DOM
window.onload = function () {
    // Перевірка та обробка cookies
    const cookies = document.cookie.split('; ').find(row => row.startsWith('textData='));

    if (cookies) {
        const savedData = decodeURIComponent(cookies.split('=')[1]);
        if (confirm(`Збережений текст: "${savedData}"
Кількість слів у тексті: ${savedData.split(/\s+/).length}
Після натискання кнопки «ОК» відбудеться видалення даних із cookies.`)) {
            document.cookie = 'textData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            alert('Дані з cookies видалено. Натискніть OK, щоб перезавантажити сторінку.');
            location.reload();
            return;
        }
    } else {
        // 1. Заміна контенту блоків 3 та 5
        const block3 = document.querySelector('.block3');
        const block5 = document.querySelector('.block5');

        // Функція для зміни контенту місцями
        function swapBlocks() {
            const block3Content = block3.innerHTML;
            const block5Content = block5.innerHTML;

            // Змінюємо місцями контент
            block3.innerHTML = block5Content;
            block5.innerHTML = block3Content;
        }

        // Створюємо кнопку для свапу
        const swapButton = document.createElement('button');
        swapButton.textContent = 'Свапнути блоки';
        swapButton.style.margin = '10px';
        swapButton.style.padding = '10px 20px';
        swapButton.style.cursor = 'pointer';

        // Додаємо кнопку в кінець блоку 4
        const block4 = document.querySelector('.block4');
        block4.appendChild(swapButton);

        // Додаємо обробник події на кнопку
        swapButton.addEventListener('click', swapBlocks);

        // 2. Функція для обчислення площі паралелограма
        function calculateParallelogramArea(base, height) {
            return base * height;
        }

        // Створюємо елементи для введення даних
        const inputBase = document.createElement('input');
        inputBase.type = 'number';
        inputBase.placeholder = 'Введіть основу';
        inputBase.style.margin = '5px';

        const inputHeight = document.createElement('input');
        inputHeight.type = 'number';
        inputHeight.placeholder = 'Введіть висоту';
        inputHeight.style.margin = '5px';

        const calculateButton = document.createElement('button');
        calculateButton.textContent = 'Обчислити площу';
        calculateButton.style.margin = '5px';
        calculateButton.style.padding = '5px 10px';
        calculateButton.style.cursor = 'pointer';

        // Додаємо елементи в блок 4
        block4.appendChild(inputBase);
        block4.appendChild(inputHeight);
        block4.appendChild(calculateButton);

        // Додаємо обробник події на кнопку обчислення
        calculateButton.addEventListener('click', function () {
            const base = parseFloat(inputBase.value);
            const height = parseFloat(inputHeight.value);

            if (isNaN(base) || isNaN(height) || base <= 0 || height <= 0) {
                alert('Будь ласка, введіть коректні позитивні значення для основи та висоти.');
                return;
            }

            const area = calculateParallelogramArea(base, height);

            const resultParagraph = document.createElement('p');
            resultParagraph.textContent = `Площа паралелограма зі стороною ${base} та висотою ${height} дорівнює ${area}.`;
            block4.appendChild(resultParagraph);
        });

        // 3. Форма для введення тексту та обрахунку кількості слів
        const textForm = document.createElement('div');
        const textInput = document.createElement('textarea');
        textInput.placeholder = 'Введіть текст для підрахунку слів';
        textInput.style.margin = '5px';
        textInput.style.width = '95%';
        textInput.style.height = '80px';

        const countWordsButton = document.createElement('button');
        countWordsButton.textContent = 'Порахувати слова';
        countWordsButton.style.margin = '5px';
        countWordsButton.style.padding = '5px 10px';
        countWordsButton.style.cursor = 'pointer';

        textForm.appendChild(textInput);
        textForm.appendChild(countWordsButton);
        block4.appendChild(textForm);

        countWordsButton.addEventListener('click', function () {
            const text = textInput.value.trim();
            if (text === '') {
                alert('Будь ласка, введіть текст.');
                return;
            }

            const wordCount = text.split(/\s+/).length;
            alert(`Кількість слів у тексті: ${wordCount}`);

            // Збереження даних у cookies
            document.cookie = `textData=${encodeURIComponent(text)}; path=/;`;
        });
    }
};
