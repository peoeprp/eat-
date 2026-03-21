document.addEventListener("DOMContentLoaded", () => {
  // ===== БУРГЕР-МЕНЮ =====
  const burger = document.getElementById('burgerMenu');
  if (burger) {
    burger.addEventListener('click', () => {
      document.querySelector('.nav ul').classList.toggle('active');
    });
  }

  // ===== РАСКРЫТИЕ ОТЗЫВОВ =====
  const buttons = document.querySelectorAll('.expand-btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const reviewText = button.previousElementSibling;
      reviewText.classList.toggle('expanded');
      button.textContent = reviewText.classList.contains('expanded') ? '×' : '...';
    });
  });

  // ===== ЕДИНЫЙ НАБЛЮДАТЕЛЬ ДЛЯ АНИМАЦИЙ =====
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const animatedBoxes = document.querySelectorAll('.you-can .you-box');
  const communityItems = document.querySelectorAll('.community-list li');
  const reviewCards = document.querySelectorAll(".review-card");

  // Общий наблюдатель для появления элементов
  const appearanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        appearanceObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // Наблюдаем за всеми элементами с классом animate-on-scroll
  animatedElements.forEach(el => appearanceObserver.observe(el));

  // Специальный наблюдатель для you-box с задержкой
  const youBoxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const boxes = entry.target.querySelectorAll('.you-box');
        boxes.forEach((box, index) => {
          box.style.setProperty('--delay', `${index * 0.25}s`);
          setTimeout(() => {
            box.classList.add('visible');
          }, index * 250);
        });
        youBoxObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const youCanSection = document.querySelector('.you-can');
  if (youCanSection) youBoxObserver.observe(youCanSection);

  // Специальный наблюдатель для community-list
  const communityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.community-list li');
        items.forEach((item, index) => {
          item.style.setProperty('--delay', `${index * 0.3}s`);
          setTimeout(() => {
            item.classList.add('visible');
          }, index * 300);
        });
        communityObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const communityBox = document.querySelector('.community-box');
  if (communityBox) communityObserver.observe(communityBox);

  // ===== АНИМАЦИЯ ГЕРОЯ =====
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const heroImg = heroSection.querySelector('.hero-image img');
    const heroTextTop = heroSection.querySelector('.hero-text-top');
    const buttonBlock = heroSection.querySelector('.button-wrapper-left');
    const infoBoxes = heroSection.querySelectorAll('.info-box');

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Шаг 1: Появляется изображение с прыжком
          if (heroImg) heroImg.classList.add('animate-in');

          // Шаг 2: Текстовый блок с рамкой
          setTimeout(() => {
            if (heroTextTop) heroTextTop.classList.add('visible');
          }, 1000);

          // Шаг 3: Кнопка
          setTimeout(() => {
            if (buttonBlock) buttonBlock.classList.add('visible');
          }, 1500);

          // Шаг 4: Инфо-боксы по очереди
          infoBoxes.forEach((box, i) => {
            setTimeout(() => {
              box.classList.add('visible');
            }, 1900 + i * 300);
          });

          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    heroObserver.observe(heroSection);
  }

  // ===== МАСКА ДЛЯ ТЕЛЕФОНА =====
  const phoneInput = document.querySelector('input[type="tel"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        if (value.length <= 1) {
          value = '+7';
        } else if (value.length <= 4) {
          value = '+7 (' + value.substring(1, 4);
        } else if (value.length <= 7) {
          value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7);
        } else if (value.length <= 9) {
          value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9);
        } else {
          value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
        }
        
        e.target.value = value;
      }
    });
  }
});

// ===== МОДАЛЬНОЕ ОКНО ДЛЯ ФОРМЫ КОНТАКТОВ =====
document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.querySelector('.contact-form .submit-button');
  const contactForm = document.querySelector('.contact-form');
  
  if (submitButton) {
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Получаем поля формы
      const nameInput = contactForm.querySelector('input[type="text"]');
      const phoneInput = contactForm.querySelector('input[type="tel"]');
      const emailInput = contactForm.querySelector('input[type="email"]');
      const messageInput = contactForm.querySelector('textarea');
      
      const inputs = [nameInput, phoneInput, emailInput, messageInput];
      let isValid = true;
      
      // Сброс стилей перед проверкой
      inputs.forEach(input => {
        if (input) input.style.borderColor = '#F2A2A2';
      });
      
      // Проверка заполненности всех полей
      inputs.forEach(input => {
        if (input && !input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ff6b6b';
        }
      });
      
      // Валидация телефона (российский формат)
      const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
      if (phoneInput && phoneInput.value.trim() && !phoneRegex.test(phoneInput.value.trim())) {
        isValid = false;
        phoneInput.style.borderColor = '#ff6b6b';
        showFieldHint(phoneInput, 'Введите корректный номер телефона (например: +7 999 123-45-67)');
      }
      
      // Валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        emailInput.style.borderColor = '#ff6b6b';
        showFieldHint(emailInput, 'Введите корректный email (например: name@domain.com)');
      }
      
      // Валидация имени (минимум 2 символа)
      if (nameInput && nameInput.value.trim() && nameInput.value.trim().length < 2) {
        isValid = false;
        nameInput.style.borderColor = '#ff6b6b';
        showFieldHint(nameInput, 'Имя должно содержать минимум 2 символа');
      }
      
      // Валидация сообщения (минимум 10 символов)
      if (messageInput && messageInput.value.trim() && messageInput.value.trim().length < 10) {
        isValid = false;
        messageInput.style.borderColor = '#ff6b6b';
        showFieldHint(messageInput, 'Сообщение должно содержать минимум 10 символов');
      }
      
      if (!isValid) {
        return;
      }
      
      // Если всё ок - очищаем форму и показываем модальное окно
      contactForm.reset();
      showModal();
    });
  }
  
  // Функция для показа подсказки под полем
  function showFieldHint(input, message) {
    // Удаляем существующую подсказку
    const existingHint = input.parentNode.querySelector('.field-hint');
    if (existingHint) {
      existingHint.remove();
    }
    
    // Создаем подсказку
    const hint = document.createElement('div');
    hint.className = 'field-hint';
    hint.textContent = message;
    hint.style.cssText = `
      color: #ff6b6b;
      font-size: 12px;
      margin-top: 4px;
      font-family: 'Onest', sans-serif;
    `;
    
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(hint);
    
    // Удаляем подсказку при фокусе на поле
    input.addEventListener('focus', () => {
      if (hint.parentNode) {
        hint.remove();
      }
    }, { once: true });
    
    input.addEventListener('focus', function() {
      this.style.borderColor = '#F2A2A2';
    }, { once: true });
  }
  
  function showModal() {
    // Удаляем существующее модальное окно, если оно есть
    const existingModal = document.querySelector('.custom-modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Создаем элементы модального окна
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'custom-modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'custom-modal';
    
    // Заголовок
    const title = document.createElement('h3');
    title.textContent = 'Спасибо за обращение!';
    title.style.color = '#000';
    title.style.fontFamily = 'OnestBold, sans-serif';
    title.style.marginBottom = '20px';
    title.style.fontSize = '24px';
    
    // Иконка успеха
    const successIcon = document.createElement('div');
    successIcon.className = 'success-icon';
    successIcon.innerHTML = '✓';
    successIcon.style.cssText = `
      width: 60px;
      height: 60px;
      background-color: #F2A2A2;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin: 0 auto 20px;
      font-family: OnestBold, sans-serif;
    `;
    
    // Текст сообщения
    const message = document.createElement('p');
    message.innerHTML = 'Ваше обращение успешно отправлено!<br><br>Мы свяжемся с вами в ближайшее время по указанной электронной почте.';
    message.style.cssText = `
      color: #000;
      font-family: 'Onest', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 25px;
      text-align: center;
    `;
    
    // Кнопка закрытия
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть';
    closeButton.className = 'modal-close-btn';
    closeButton.style.cssText = `
      background-color: #F2A2A2;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 10px;
      font-family: 'OnestBold', sans-serif;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 10px;
    `;
    
    // Hover эффект для кнопки
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = '#fff';
      closeButton.style.color = '#F2A2A2';
      closeButton.style.border = '2px solid #F2A2A2';
      closeButton.style.padding = '10px 28px';
    });
    
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = '#F2A2A2';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.padding = '12px 30px';
    });
    
    closeButton.addEventListener('click', () => {
      modalOverlay.remove();
    });
    
    // Собираем модальное окно
    modalContent.appendChild(successIcon);
    modalContent.appendChild(title);
    modalContent.appendChild(message);
    modalContent.appendChild(closeButton);
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Закрытие по клику на оверлей
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });
    
    // Закрытие по Escape
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modalOverlay.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }
});

// ===== ПОСЛЕДОВАТЕЛЬНОЕ ПОЯВЛЕНИЕ ОТЗЫВОВ =====
document.addEventListener("DOMContentLoaded", () => {
  const reviewCards = Array.from(document.querySelectorAll(".review-card"));
  
  if (reviewCards.length > 0) {
    const reviewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateReviewsSequentially(reviewCards, 20);
          reviewObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    const reviewsGrid = document.querySelector(".reviews-grid");
    if (reviewsGrid) reviewObserver.observe(reviewsGrid);
  }

  function animateReviewsSequentially(cards, speed) {
    let current = 0;

    function showNextCard() {
      if (current >= cards.length) return;

      const card = cards[current];
      const textEl = card.querySelector(".review-text");
      if (!textEl) {
        current++;
        setTimeout(showNextCard, 300);
        return;
      }
      
      const fullText = textEl.textContent.trim();

      textEl.textContent = "";
      textEl.style.visibility = "visible";
      card.classList.add("visible", "typing");

      let i = 0;
      const interval = setInterval(() => {
        textEl.textContent += fullText[i];
        i++;
        if (i >= fullText.length) {
          clearInterval(interval);
          card.classList.remove("typing");
          current++;
          setTimeout(showNextCard, 300);
        }
      }, speed);
    }

    showNextCard();
  }
});