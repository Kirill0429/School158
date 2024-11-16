// Новости: добавление новости с привязкой к галерее
document.getElementById('news-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const newsText = document.getElementById('news-text').value;
    const newsImage = document.getElementById('news-image').files[0];

    const newsContainer = document.getElementById('news-container');
    const newsItem = document.createElement('div');
    newsItem.classList.add('news-item');

    let imageTag = '';
    if (newsImage) {
        const imageUrl = URL.createObjectURL(newsImage);
        imageTag = `<img src="${imageUrl}" alt="Новость" class="news-image" data-news="${newsText}">`;

        // Добавление изображения в галерею
        addImageToGallery(imageUrl, newsText);
    }

    newsItem.innerHTML = `
        ${imageTag}
        <p>${newsText}</p>
    `;
    newsContainer.prepend(newsItem);

    this.reset();
});

// Галерея: добавление нового фото через форму
document.getElementById('gallery-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const galleryImage = document.getElementById('gallery-image').files[0];
    if (galleryImage) {
        const imageUrl = URL.createObjectURL(galleryImage);
        addImageToGallery(imageUrl);
        this.reset();
    }
});

// Функция для добавления изображения в галерею
function addImageToGallery(imageUrl, newsText = null) {
    const galleryContainer = document.getElementById('gallery-container');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = "Фото школы";

    if (newsText) {
        img.dataset.news = newsText; // Привязка к новости
        img.addEventListener('click', () => {
            alert(`Новость: ${newsText}`); // Здесь можно сделать перенаправление
        });
    }

    galleryContainer.appendChild(img);
}


// Галерея: полноэкранный просмотр изображений
document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    });
});

// Контакты: проверка формы и уведомление об отправке
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    if (name && email && message) {
        alert('Ваше сообщение отправлено!');
        this.reset();
    } else {
        alert('Пожалуйста, заполните все поля!');
    }
});
