'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Сообщение для проверки, что скрипт был успешно загружен и выполнен.
    console.log('Скрипт Aura-Beauty.js отработал корректно. DOM полностью загружен.');

    // ==========================================================================
    // 0. ОБЩИЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И ПЕРЕМЕННЫЕ
    // ==========================================================================
    const body = document.body;

    /** Блокирует прокрутку страницы (используется для модальных окон). */
    const lockScroll = () => {
        body.style.overflow = 'hidden';
    };
    
    /** Разблокирует прокрутку страницы. */
    const unlockScroll = () => {
        body.style.overflow = '';
    };

    // Объявляем функции закрытия заранее, чтобы они были доступны глобальному слушателю клавиш
    let closeModal = () => {};
    let closeLightbox = () => {};
    let closeMobileMenu = () => {};

    // ==========================================================================
    // 1. PRELOADER
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('preloader--hidden');
            }, 500);
        });
    }

    // ==========================================================================
    // 2. CUSTOM CURSOR
    // ==========================================================================
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    if (cursor && cursorFollower) {
        window.addEventListener('mousemove', e => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        document.querySelectorAll('a, button, .gallery__item, .slider-btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('is-active'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('is-active'));
        });
    }

    // ==========================================================================
    // 3. HEADER & NAVIGATION
    // ==========================================================================
    const header = document.querySelector('.header');
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.scrollY > 50);
    });

    closeMobileMenu = () => { // Переопределяем функцию
        burger.classList.remove('is-active');
        navMenu.classList.remove('nav--open');
        unlockScroll();
    };

    burger.addEventListener('click', () => {
        if (navMenu.classList.contains('nav--open')) {
            closeMobileMenu();
        } else {
            burger.classList.add('is-active');
            navMenu.classList.add('nav--open');
            lockScroll();
        }
    });

    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            if (navMenu.classList.contains('nav--open')) {
                closeMobileMenu();
            }
        });
    });

    // ==========================================================================
    // 4. SCROLL & TEXT ANIMATIONS
    // ==========================================================================
    const animatedElements = document.querySelectorAll('[data-animate], [data-animate-text]');
    document.querySelectorAll('[data-animate-text]').forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            el.appendChild(span);
        });
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.hasAttribute('data-animate-text')) {
                    entry.target.querySelectorAll('.char').forEach((char, index) => {
                        char.style.transitionDelay = `${index * 50}ms`;
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));


// ==========================================================================
// 5. ЗАДАНИЕ: СОЗДАНИЕ СТИЛЬНОЙ КАРУСЕЛИ ОТЗЫВОВ С SWIPER.JS
// ==========================================================================

const reviewsSlider = new Swiper('.reviews-slider', {
    // Основные опции
    loop: true,
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 30,

    // НОВЫЙ ЭФФЕКТ ПЕРЕХОДА
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },

    // Автопрокрутка
    autoplay: {
        delay: 6000, // Увеличим задержку для более вдумчивого чтения
        disableOnInteraction: false,
    },

    // ОБНОВЛЕННЫЕ ЭЛЕМЕНТЫ УПРАВЛЕНИЯ
    // Навигация (стрелки)
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Пагинация (точки внизу)
    pagination: {
        el: '.reviews-pagination', // Используем новый класс
        clickable: true,
    },
});
    // ==========================================================================
    // 6. GALLERY LIGHTBOX
    // ==========================================================================
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('.gallery__item');
        const lightboxImg = lightbox.querySelector('.lightbox__image');
        const imageSources = Array.from(galleryItems).map(item => item.querySelector('img').src);
        let currentImageIndex;

        const openLightbox = (index) => {
            currentImageIndex = index;
            lightboxImg.src = imageSources[currentImageIndex];
            lightbox.classList.add('is-open');
            lockScroll();
        };

        closeLightbox = () => { // Переопределяем функцию
            lightbox.classList.remove('is-open');
            unlockScroll();
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        };
        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        };
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox__nav--next').addEventListener('click', showNextImage);
        lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    }




 // ==========================================================================
    // 6. ЗАДАНИЕ: АЛГОРИТМ И БЛОК-СХЕМА ДЛЯ КОМПОНЕНТА "ЛАЙТБОКС ГАЛЕРЕИ"
    // ==========================================================================
    
    /*
     *  АЛГОРИТМ РАБОТЫ ЛАЙТБОКСА
     *
     *  1. НАЧАЛО (ИНИЦИАЛИЗАЦИЯ):
     *     1.1. Завести переменные для DOM-элементов: лайтбокс, контейнер <img>, кнопки, элементы галереи.
     *     1.2. Создать массив `imageSources` из URL всех изображений галереи.
     *     1.3. Завести переменную `currentImageIndex` для отслеживания текущего изображения.
     *     1.4. Установить слушатели событий на все интерактивные элементы (изображения, кнопки, фон).
     *
     *  2. СОБЫТИЕ: Клик на изображение в галерее:
     *     2.1. Вызвать функцию `openLightbox`, передав ей индекс кликнутого изображения.
     *     2.2. В `openLightbox`: обновить `currentImageIndex`, установить `src` для `<img>` лайтбокса, добавить CSS-класс для отображения, заблокировать скролл.
     *
     *  3. СОБЫТИЕ: Клик на кнопку "вперед":
     *     3.1. Вызвать функцию `showNextImage`.
     *     3.2. В `showNextImage`: вычислить новый индекс с зацикливанием ( (index + 1) % length ), обновить `src` у `<img>`.
     *
     *  4. СОБЫТИЕ: Клик на кнопку "назад":
     *     4.1. Вызвать функцию `showPrevImage`.
     *     4.2. В `showPrevImage`: вычислить новый индекс с зацикливанием ( (index - 1 + length) % length ), обновить `src`.
     *
     *  5. СОБЫТИЕ: Клик на крестик, фон или нажатие "Escape":
     *     5.1. Вызвать функцию `closeLightbox`.
     *     5.2. В `closeLightbox`: убрать CSS-класс для скрытия, разблокировать скролл.
     *
     *  6. КОНЕЦ.
    */

    /*
     *  ССЫЛКА НА ГРАФИЧЕСКУЮ БЛОК-СХЕМУ
     *  Ссылка: images/block-schema
    */




    // ==========================================================================
// 7. MODAL & FORM VALIDATION (с интеграцией LocalStorage)
// ==========================================================================
const modal = document.getElementById('modal');
if (modal) {
    const openModalButtons = document.querySelectorAll('#open-modal-btn, #open-modal-btn-hero');
    const closeModalButton = document.getElementById('close-modal-btn');
    const bookingForm = document.getElementById('booking-form');
    const formMessage = document.getElementById('form-message');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const dateInput = document.getElementById('date');

    // --- НОВАЯ ФУНКЦИЯ: Сохранение данных в LocalStorage ---
    /**
     * Сохраняет имя и телефон пользователя в LocalStorage.
     */
    const saveUserData = () => {
        const userData = {
            name: nameInput.value,
            phone: phoneInput.value,
        };
        // LocalStorage хранит только строки, поэтому преобразуем объект в JSON-строку.
        localStorage.setItem('auraClientData', JSON.stringify(userData));
        console.log('[LocalStorage] Данные пользователя сохранены:', userData);
    };

    // --- НОВАЯ ФУНКЦИЯ: Загрузка данных из LocalStorage ---
    /**
     * Загружает данные пользователя из LocalStorage и подставляет их в форму.
     */
    const loadUserData = () => {
        const savedData = localStorage.getItem('auraClientData');
        if (savedData) {
            // Если данные найдены, преобразуем их обратно в объект.
            const userData = JSON.parse(savedData);
            nameInput.value = userData.name || ''; // || '' на случай, если свойство пустое
            phoneInput.value = userData.phone || '';
            console.log('[LocalStorage] Данные пользователя загружены в форму:', userData);
        }
    };

    // --- ОБНОВЛЕННАЯ ФУНКЦИЯ: Открытие модального окна ---
    const openModal = () => {
        modal.classList.add('modal--open');
        lockScroll();
        loadUserData(); // <--- ВЫЗЫВАЕМ ЗАГРУЗКУ ДАННЫХ ПРИ ОТКРЫТИИ
    };
    
    closeModal = () => { modal.classList.remove('modal--open'); unlockScroll(); };

    openModalButtons.forEach(btn => btn.addEventListener('click', openModal));
    closeModalButton.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    // ... (код маски для телефона и валидации остается без изменений) ...
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '+7 (';
        if (value.length > 1) formattedValue += value.substring(1, 4);
        if (value.length >= 5) formattedValue += ') ' + value.substring(4, 7);
        if (value.length >= 8) formattedValue += '-' + value.substring(7, 9);
        if (value.length >= 10) formattedValue += '-' + value.substring(9, 11);
        e.target.value = formattedValue.substring(0, 18);
    });
    
    const showError = (input, message) => { input.parentElement.querySelector('.form__error-message').textContent = message; input.classList.add('is-invalid'); };
    const showSuccess = (input) => { input.parentElement.querySelector('.form__error-message').textContent = ''; input.classList.remove('is-invalid'); };

    const validateForm = () => {
        let isValid = true;
        if (nameInput.value.trim().length < 2) { showError(nameInput, 'Имя должно содержать не менее 2 символов'); isValid = false; } else { showSuccess(nameInput); }
        if (phoneInput.value.replace(/\D/g, '').length !== 11) { showError(phoneInput, 'Введите корректный номер телефона'); isValid = false; } else { showSuccess(phoneInput); }
        if (dateInput.value === '') { showError(dateInput, 'Пожалуйста, выберите дату и время'); isValid = false; } else { showSuccess(dateInput); }
        return isValid;
    };


    // --- ОБНОВЛЕННЫЙ ОБРАБОТЧИК: Отправка формы ---
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            // --- ДОБАВЛЕНО: Сохранение данных после успешной валидации ---
            saveUserData();

            formMessage.textContent = 'Отправляем вашу заявку...';
            formMessage.style.display = 'block';
            formMessage.className = 'form__message';
            
            setTimeout(() => {
                formMessage.textContent = `Спасибо, ${nameInput.value.trim()}! Ваша заявка принята.`;
                formMessage.classList.add('form__message--success');
                // Форму больше не очищаем, чтобы пользователь видел, что он отправил.
                // bookingForm.reset(); 
                setTimeout(() => {
                    closeModal();
                    formMessage.style.display = 'none';
                }, 3000);
            }, 1500);
        }
    });
}

    // ==========================================================================
    // 8. BACK TO TOP BUTTON
    // ==========================================================================
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('is-visible', window.scrollY > 300);
        });
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================================================
    // --- БЛОК С ЗАДАНИЯМИ ДЛЯ ДЕМОНСТРАЦИИ ---
    // ==========================================================================
    
    // --- ЗАДАНИЕ 9: АЛГОРИТМ И СЛУШАТЕЛЬ СОБЫТИЙ ---
    // (Алгоритм и блок-схема описаны в комментариях к коду лайтбокса (пункт 6))
    if (header) {
        header.addEventListener('mouseover', () => {
            console.log(`[ТЕСТ] Событие MOUSEOVER на шапке сработало! Время: ${new Date().toLocaleTimeString()}`);
        });
    }
    
    // --- ЗАДАНИЕ 10: ВЫВОД ВЕРСТКИ ЧЕРЕЗ FOR...IN ---
    const principlesData = {
        'Качество': { icon: 'bx-diamond', text: 'Используем только сертифицированные, премиальные материалы и косметику.' },
        'Профессионализм': { icon: 'bx-user-check', text: 'Наши мастера регулярно повышают квалификацию и следят за трендами.' },
        'Забота': { icon: 'bx-heart', text: 'Создаем атмосферу комфорта и расслабления для каждого гостя.' },
        'Безопасность': { icon: 'bx-shield-quarter', text: 'Строго соблюдаем все нормы стерилизации и гигиены.' }
    };
    const principlesContainer = document.getElementById('principles-container');
    if (principlesContainer) {
        console.log('[ЗАДАНИЕ] Формирование верстки для "Наших принципов" с помощью for...in...');
        for (const principleName in principlesData) {
            if (Object.hasOwnProperty.call(principlesData, principleName)) {
                const details = principlesData[principleName];
                const card = document.createElement('div');
                card.className = 'principle-card';
                card.setAttribute('data-animate', '');
                card.innerHTML = `
                    <div class="principle-card__icon"><i class='bx ${details.icon}'></i></div>
                    <h3 class="principle-card__title">${principleName}</h3>
                    <p class="principle-card__text">${details.text}</p>
                `;
                principlesContainer.appendChild(card);
            }
        }
        principlesContainer.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    }

    // --- ЗАДАНИЕ 11: ОБРАБОТКА JSON И ВЫВОД ВЕРСТКИ ---
    async function loadServices() {
        const servicesContainer = document.getElementById('services-container');
        if (!servicesContainer) {
            console.error('Контейнер для услуг #services-container не найден.');
            return;
        }
        try {
            console.log('[JSON] Загрузка данных из data.json...');
            // ИСПРАВЛЕНО: имя файла изменено на data.json
            const response = await fetch('data.json'); 
            if (!response.ok) throw new Error(`Ошибка сети: статус ${response.status}`);
            
            const data = await response.json();
            console.log('[JSON] Данные успешно загружены:', data);

            let servicesHTML = '';
            data.services.forEach(service => {
                servicesHTML += `
                    <div class="service-card" data-animate>
                        <div class="service-card__icon"><i class='bx ${service.icon}'></i></div>
                        <h3 class="service-card__title">${service.title}</h3>
                        <p class="service-card__text">${service.description}</p>
                    </div>
                `;
            });
            servicesContainer.innerHTML = servicesHTML;
            servicesContainer.querySelectorAll('[data-animate]').forEach(card => observer.observe(card));
        } catch (error) {
            console.error('Не удалось загрузить и отобразить услуги:', error);
            servicesContainer.innerHTML = `<p style="text-align: center; color: var(--error-color);">Не удалось загрузить список услуг.</p>`;
        }
    }
    loadServices();

    // ==========================================================================
    // 12. ГЛОБАЛЬНЫЙ СЛУШАТЕЛЬ НАЖАТИЯ КЛАВИШ
    // ==========================================================================
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('modal--open')) closeModal();
            if (lightbox && lightbox.classList.contains('is-open')) closeLightbox();
            if (navMenu.classList.contains('nav--open')) closeMobileMenu();
        }
    });

});

