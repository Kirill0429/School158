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
if (!getCurrentUser() && window.location.pathname !== '/index.html' && window.location.pathname !== '/login.html') {
    window.location.href = 'login.html'; // Переход на страницу входа
}

// Отображение имени текущего пользователя в профиле
function showProfile() {
    const currentUser = getCurrentUser();
    document.getElementById('usernameDisplay').textContent = currentUser;
}

// Сохранение профиля
function saveProfile() {
    const description = document.getElementById('description').value;
    const avatarFile = document.getElementById('avatar').files[0];

    if (avatarFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            localStorage.setItem('avatar', e.target.result);
        };
        reader.readAsDataURL(avatarFile);
    }

    localStorage.setItem('description', description);
    window.location.href = 'chat.html';
}

// Перейти в чат
function startChat() {
    window.location.href = 'chat.html';
}

// Функция для отправки сообщений
function sendMessage() {
    const message = document.getElementById('message').value;
    if (message) {
        const currentUser = localStorage.getItem('currentUser') || 'Гость'; // Берем текущего пользователя
        const avatar = localStorage.getItem('avatar') || 'default-avatar.png'; // Если аватар не установлен, дефолтный
        const messagesDiv = document.getElementById('messages');

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');

        const avatarImg = document.createElement('img');
        avatarImg.src = avatar;

        const textDiv = document.createElement('div');
        textDiv.textContent = `${currentUser}: ${message}`;

        messageDiv.appendChild(avatarImg);
        messageDiv.appendChild(textDiv);

        // Сохраняем сообщение в localStorage для текущего пользователя
        saveMessage({ user: currentUser, message: message, avatar: avatar });

        messagesDiv.appendChild(messageDiv);
        document.getElementById('message').value = '';
    }
}

// Сохранение сообщений в localStorage для каждого пользователя
function saveMessage(message) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const userMessages = JSON.parse(localStorage.getItem(currentUser + '_messages')) || [];
    userMessages.push(message);
    localStorage.setItem(currentUser + '_messages', JSON.stringify(userMessages)); // Сохраняем сообщения для этого пользователя
}

// Загрузка сообщений для текущего пользователя
function loadMessages() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const messages = JSON.parse(localStorage.getItem(currentUser + '_messages')) || [];
    const messagesDiv = document.getElementById('messages');

    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');

        const avatarImg = document.createElement('img');
        avatarImg.src = msg.avatar;

        const textDiv = document.createElement('div');
        textDiv.textContent = `${msg.user}: ${msg.message}`;

        messageDiv.appendChild(avatarImg);
        messageDiv.appendChild(textDiv);

        messagesDiv.appendChild(messageDiv);
    });
}

// Загружаем сообщения при загрузке страницы
document.addEventListener('DOMContentLoaded', loadMessages);
