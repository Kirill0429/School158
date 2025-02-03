// Сохранение сообщений в localStorage
function saveMessages(message) {
    const messages = localStorage.getItem('messages') || ''; // Получаем сохраненные сообщения как строку
    const timestamp = new Date().toISOString(); // Добавим время для каждого сообщения
    const formattedMessage = `${message.user}|${message.message}|${timestamp}`; // Форматируем сообщение
    const newMessages = messages ? `${messages}\n${formattedMessage}` : formattedMessage; // Добавляем новое сообщение
    localStorage.setItem('messages', newMessages); // Сохраняем все сообщения в localStorage
}

// Загружать историю сообщений при загрузке чата
function loadMessages() {
    const messagesDiv = document.getElementById('messages');
    const messages = localStorage.getItem('messages'); // Получаем строку сообщений

    if (messages) {
        const messageList = messages.split('\n'); // Разделяем сообщения по строкам

        messageList.forEach(msgStr => {
            const [user, message, timestamp] = msgStr.split('|'); // Разделяем сообщение на части

            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', user === getCurrentUser() ? 'user-message' : 'other-message');

            // Создаем элемент для аватара
            const avatarImg = document.createElement('img');
            const avatar = localStorage.getItem('avatar');
            avatarImg.src = avatar ? avatar : 'default-avatar.png'; // Если аватар не установлен, показываем дефолтный

            // Создаем элемент для текста сообщения
            const textDiv = document.createElement('div');
            textDiv.textContent = `${user}: ${message}`;

            // Вставляем аватар и текст в контейнер
            messageDiv.appendChild(avatarImg);
            messageDiv.appendChild(textDiv);

            // Добавляем сообщение в чат
            messagesDiv.appendChild(messageDiv);
        });
    }
}

// Отправка сообщения
function sendMessage() {
    const message = document.getElementById('message').value;
    if (message) {
        const currentUser = localStorage.getItem('nickname') || 'Гость'; // Берем ник из localStorage
        const avatar = localStorage.getItem('avatar') || 'default-avatar.png'; // Если аватар не установлен, дефолтный
        const messagesDiv = document.getElementById('messages');

        // Создаем новый div для сообщения
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message'); // Добавляем классы для стилизации

        // Создаем элемент для аватара
        const avatarImg = document.createElement('img');
        avatarImg.src = avatar;

        // Создаем элемент для текста сообщения
        const textDiv = document.createElement('div');
        textDiv.textContent = `${currentUser}: ${message}`;

        // Вставляем аватар и текст в контейнер
        messageDiv.appendChild(avatarImg);
        messageDiv.appendChild(textDiv);

        // Добавляем новое сообщение в контейнер
        messagesDiv.appendChild(messageDiv);

        // Сохраняем сообщение в localStorage
        saveMessages({ user: currentUser, message });

        // Очищаем поле ввода
        document.getElementById('message').value = '';
    }
}

// Получаем текущего пользователя
function getCurrentUser() {
    return localStorage.getItem('nickname') || 'Гость';
}

// Загружаем сообщения при загрузке страницы
document.addEventListener('DOMContentLoaded', loadMessages);

// Открытие модального окна настроек
function openSettings() {
    // Заполняем поля настройками пользователя, если они сохранены в localStorage
    const nickname = localStorage.getItem('nickname') || '';
    const avatar = localStorage.getItem('avatar') || '';
    const description = localStorage.getItem('description') || '';

    document.getElementById('nickname').value = nickname;
    document.getElementById('avatar').value = avatar;
    document.getElementById('description').value = description;

    // Показываем модальное окно
    document.getElementById('settingsModal').style.display = 'block';
}

// Закрытие модального окна
function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

// Сохранение настроек в localStorage
function saveSettings() {
    const nickname = document.getElementById('nickname').value;
    const avatar = document.getElementById('avatar').value;
    const description = document.getElementById('description').value;

    // Сохраняем настройки
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('avatar', avatar);
    localStorage.setItem('description', description);

    // Закрываем модальное окно
    closeSettings();
}
