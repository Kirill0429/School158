// Проверка, существует ли уже такой пользователь
function checkUserExists(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.username === username);
}

// Сохранение нового пользователя
function saveUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
}

// Регистрация пользователя
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !password || !confirmPassword) {
        alert("Пожалуйста, заполните все поля");
        return;
    }

    if (password !== confirmPassword) {
        alert("Пароли не совпадают");
        return;
    }

    if (checkUserExists(username)) {
        alert("Пользователь с таким именем уже существует");
        return;
    }

    saveUser(username, password); // Сохраняем нового пользователя
    localStorage.setItem('currentUser', username); // Сохраняем текущего пользователя
    window.location.href = 'profile.html'; // Перенаправляем на страницу редактирования профиля
}

// Вход пользователя
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        alert("Пожалуйста, введите имя и пароль");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', username); // Сохраняем текущего пользователя
        window.location.href = 'profile.html'; // Перенаправляем на страницу редактирования профиля
    } else {
        alert("Неверное имя пользователя или пароль");
    }
}

// Получение текущего пользователя
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// Если пользователь не авторизован, перенаправляем на страницу входа
if (!getCurrentUser() && window.location.pathname !== '/32.html') {
    window.location.href = '32.html'; // Переход на страницу регистрации/входа
}

// Отображение имени текущего пользователя в профиле
function showProfile() {
    const currentUser = getCurrentUser();
    document.getElementById('usernameDisplay').textContent = currentUser;
}

// Сохранение профиля
function saveProfile() {
    const description = document.getElementById('description').value;
    const avatarFile = document.getElementById('avatar').files[0]; // Получаем выбранный файл аватара

    if (avatarFile) {
        // Загружаем аватар
        const reader = new FileReader();
        reader.onload = function (e) {
            localStorage.setItem('avatar', e.target.result); // Сохраняем аватар в localStorage
        };
        reader.readAsDataURL(avatarFile); // Читаем файл как data URL
    }

    localStorage.setItem('description', description); // Сохраняем описание
    window.location.href = 'chat.html'; // Перенаправляем в чат
}

// Переход в чат
function startChat() {
    window.location.href = 'chat.html'; // Перенаправление в чат
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

// Сохранение сообщений в localStorage
function saveMessages(message) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages)); // Сохраняем сообщения в localStorage
}

// Загружать историю сообщений при загрузке чата
function loadMessages() {
    const messagesDiv = document.getElementById('messages');
    const messages = JSON.parse(localStorage.getItem('messages')) || [];

    // Отображаем каждое сообщение
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', msg.user === getCurrentUser() ? 'user-message' : 'other-message');

        // Создаем элемент для аватара
        const avatarImg = document.createElement('img');
        const avatar = localStorage.getItem('avatar');
        avatarImg.src = avatar ? avatar : 'default-avatar.png'; // Если аватар не установлен, показываем дефолтный

        // Создаем элемент для текста сообщения
        const textDiv = document.createElement('div');
        textDiv.textContent = `${msg.user}: ${msg.message}`;

        // Вставляем аватар и текст в контейнер
        messageDiv.appendChild(avatarImg);
        messageDiv.appendChild(textDiv);

        // Добавляем сообщение в чат
        messagesDiv.appendChild(messageDiv);
    });
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
