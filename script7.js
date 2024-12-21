document.addEventListener('DOMContentLoaded', () => {
    const block6 = document.querySelector('.block6');

    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.style.padding = '10px 20px';
    playButton.style.marginTop = '10px';
    block6.appendChild(playButton);

    playButton.addEventListener('click', () => {
        createWorkArea();
        playButton.remove();
    });

    function createWorkArea() {
        const block4 = document.querySelector('.block4');
        block4.innerHTML = ''; // Очищаємо блок 4

        // Створення області "work"
        const workArea = document.createElement('div');
        workArea.style.position = 'relative';
        workArea.style.width = '90%';
        workArea.style.height = '500px';
        workArea.style.margin = '0 auto';
        workArea.style.border = '2px dashed black';
        workArea.style.backgroundColor = '#f0f0f0';
        block4.appendChild(workArea);

        // Створення області "anim"
        const animArea = document.createElement('div');
        animArea.style.position = 'absolute';
        animArea.style.width = 'calc(100% - 10px)';
        animArea.style.height = 'calc(100% - 50px)';
        animArea.style.bottom = '0';
        animArea.style.border = '5px solid yellow';
        animArea.style.display = 'grid';
        animArea.style.gridTemplateRows = '1fr 1fr'; // Дві рядки
        animArea.style.gridTemplateColumns = '1fr 1fr'; // Дві колонки
        workArea.appendChild(animArea);

        // Додаємо квадранти з текстурами
        const textures = ['img.png', 'img_1.png', 'img_2.png', 'img_3.png'];
        for (let i = 0; i < 4; i++) {
            const quadrant = document.createElement('div');
            quadrant.style.backgroundImage = `url(${textures[i]})`;
            quadrant.style.backgroundSize = '32px 32px';
            quadrant.style.backgroundRepeat = 'repeat';
            quadrant.style.width = '100%';
            quadrant.style.height = '100%';
            animArea.appendChild(quadrant);
        }

        // Створення зони "controls" (залишаємо без змін)
        const controlsArea = document.createElement('div');
        controlsArea.style.position = 'absolute';
        controlsArea.style.width = '100%';
        controlsArea.style.height = '50px';
        controlsArea.style.top = '0';
        controlsArea.style.backgroundColor = '#ccc';
        controlsArea.style.display = 'flex';
        controlsArea.style.justifyContent = 'space-between';
        controlsArea.style.alignItems = 'center';
        controlsArea.style.padding = '0 10px';
        workArea.appendChild(controlsArea);

        const startButton = document.createElement('button');
        startButton.textContent = 'Start';
        controlsArea.appendChild(startButton);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        controlsArea.appendChild(closeButton);

        closeButton.addEventListener('click', () => {
            block4.innerHTML = '<p>Дані було очищено!</p>';
            localStorage.clear();
        });

        startButton.addEventListener('click', () => {
            startButton.disabled = true;
            startAnimation(animArea, startButton, controlsArea);
        });
    }


    function startAnimation(animArea, startButton, controlsArea) {
        const square = document.createElement('div');
        square.style.position = 'absolute';
        square.style.width = '20px';
        square.style.height = '20px';
        square.style.backgroundColor = 'blue';
        animArea.appendChild(square);

        let direction = 'right';
        let step = 1;
        let posX = animArea.clientWidth / 2 - 10;
        let posY = animArea.clientHeight / 2 - 10;

        square.style.left = `${posX}px`;
        square.style.top = `${posY}px`;

        const interval = setInterval(() => {
            const event = {
                step: step,
                direction: direction,
                posX: posX,
                posY: posY,
                localTime: new Date().toLocaleTimeString()
            };

            // Негайне відправлення даних (перший спосіб)
            sendEventToServer(event);

            // Зберігання в LocalStorage (для другого способу)
            accumulateEvent(event);

            switch (direction) {
                case 'right':
                    posX += step;
                    if (posX + 20 >= animArea.clientWidth) direction = 'up';
                    break;
                case 'up':
                    posY -= step;
                    if (posY <= 0) direction = 'left';
                    break;
                case 'left':
                    posX -= step;
                    if (posX <= 0) direction = 'down';
                    break;
                case 'down':
                    posY += step;
                    if (posY + 20 >= animArea.clientHeight) {
                        clearInterval(interval);
                        createReloadButton(startButton, controlsArea);
                        sendAccumulatedEvents(); // Відправлення всіх накопичених даних
                        return;
                    }
                    break;
            }

            step += 1;
            square.style.left = `${posX}px`;
            square.style.top = `${posY}px`;
        }, 100);
    }

    function sendEventToServer(event) {
        fetch('https://weblab6-2f3f4-default-rtdb.firebaseio.com/firebase.json', {
            method: 'POST',
            body: JSON.stringify(event),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => console.log('Серверний час:', data.serverTime))
            .catch(error => console.error('Помилка:', error));
    }

    function accumulateEvent(event) {
        try {
            const events = JSON.parse(localStorage.getItem('events')) || [];
            events.push(event);
            localStorage.setItem('events', JSON.stringify(events));
            console.log('Подія збережена у LocalStorage:', event);
        } catch (error) {
            console.error('Помилка збереження в LocalStorage:', error);
        }
    }



    function sendAccumulatedEvents() {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        if (events.length === 0) return;

        fetch('https://weblab6-2f3f4-default-rtdb.firebaseio.com/firebase.json', {
            method: 'POST',
            body: JSON.stringify(events),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Успішно відправлено всі події на сервер:', data);
                localStorage.removeItem('events');
            })
            .catch(error => console.error('Помилка відправлення подій:', error));
    }

    function createReloadButton(startButton, controlsArea) {
        const reloadButton = document.createElement('button');
        reloadButton.textContent = 'Reload';
        controlsArea.appendChild(reloadButton);

        reloadButton.addEventListener('click', () => {
            startButton.disabled = false;
            reloadButton.remove();
        });
    }
});
