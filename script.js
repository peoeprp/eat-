/// ===== КОНФИГУРАЦИЯ SUPABASE =====
const SUPABASE_URL = 'https://jsruceilvfliuvcqkfte.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8rhY5Udu2XJSNbnCt-crcQ_IJNG37ys';

let _supabase = null;
if (typeof supabase !== 'undefined') {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ===== КОНФИГУРАЦИЯ WEB3FORMS =====
const WEB3FORMS_ACCESS_KEY = '5bf877a6-b45f-4f6c-8640-2466a0c30a76';

document.addEventListener("DOMContentLoaded", () => {
  
  // ===== 1. ЗАГРУЗКА ОТЗЫВОВ =====
  if (_supabase) {
    loadDynamicFeedbacks();
  } else {
    console.error("Supabase SDK не найден. Проверьте подключение скрипта в HTML.");
  }

  // ===== 2. БУРГЕР-МЕНЮ =====
  const burger = document.getElementById('burgerMenu');
  const navList = document.querySelector('.nav ul');
  if (burger && navList) {
    burger.addEventListener('click', () => {
      navList.classList.toggle('active');
    });
  }

  // ===== 3. РАСКРЫТИЕ ОТЗЫВОВ =====
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('expand-btn')) {
      const button = e.target;
      const reviewText = button.previousElementSibling;
      if (reviewText && reviewText.classList.contains('review-text')) {
        reviewText.classList.toggle('expanded');
        button.textContent = reviewText.classList.contains('expanded') ? '×' : '...';
      }
    }
  });

  // ===== 4. ОБЩИЙ НАБЛЮДАТЕЛЬ ДЛЯ АНИМАЦИЙ =====
  const appearanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        appearanceObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".animate-on-scroll").forEach(el => appearanceObserver.observe(el));

  // ===== 5. АНИМАЦИИ ДЛЯ СПИСКОВ =====
  const setupListObserver = (sectionSelector, itemSelector, delayBase) => {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll(itemSelector);
          items.forEach((item, index) => {
            item.style.setProperty('--delay', `${index * delayBase}s`);
            setTimeout(() => item.classList.add('visible'), index * (delayBase * 1000));
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  };

  setupListObserver('.you-can', '.you-box', 0.25);
  setupListObserver('.community-block', '.community-list li', 0.3);

  // ===== 6. АНИМАЦИЯ ГЕРОЙ-СЕКЦИИ =====
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const heroImg = heroSection.querySelector('.hero-image img');
    const heroTextTop = heroSection.querySelector('.hero-text-top');
    const buttonBlock = heroSection.querySelector('.button-wrapper-left');
    const infoBoxes = heroSection.querySelectorAll('.info-box');

    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (heroImg) heroImg.classList.add('animate-in');
        setTimeout(() => heroTextTop?.classList.add('visible'), 1000);
        setTimeout(() => buttonBlock?.classList.add('visible'), 1500);
        infoBoxes.forEach((box, i) => {
          setTimeout(() => box.classList.add('visible'), 1900 + i * 300);
        });
        heroObserver.unobserve(heroSection);
      }
    }, { threshold: 0.3 });
    heroObserver.observe(heroSection);
  }

  // ===== 7. МАСКА ТЕЛЕФОНА =====
  const phoneInput = document.querySelector('input[type="tel"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      if (value.length > 0) {
        if (value[0] === '8') value = '7' + value.slice(1);
        if (value[0] !== '7') value = '7' + value;
        let formatted = '+7';
        if (value.length > 1) formatted += ' (' + value.substring(1, 4);
        if (value.length > 4) formatted += ') ' + value.substring(4, 7);
        if (value.length > 7) formatted += '-' + value.substring(7, 9);
        if (value.length > 9) formatted += '-' + value.substring(9, 11);
        e.target.value = formatted;
      } else {
        e.target.value = '';
      }
    });
  }

  // ===== 8. ВАЛИДАЦИЯ EMAIL =====
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ===== 9. ОТПРАВКА ФОРМЫ =====
  const contactForm = document.querySelector('.contact-form');
  const submitButton = document.querySelector('.submit-button');

  if (submitButton && contactForm) {
    submitButton.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const nameInput = contactForm.querySelector('input[type="text"]');
      const phoneInputField = contactForm.querySelector('input[type="tel"]');
      const emailInput = contactForm.querySelector('input[type="email"]');
      const msgInput = contactForm.querySelector('textarea');
      
      const inputs = [nameInput, phoneInputField, emailInput, msgInput];
      let isValid = true;

      inputs.forEach(input => {
        if (input) {
          input.style.borderColor = '#F2A2A2';
          input.style.borderWidth = '2px';
        }
      });

      if (!nameInput.value.trim()) { isValid = false; nameInput.style.borderColor = '#ff6b6b'; }
      const phoneDigits = phoneInputField.value.replace(/\D/g, '');
      if (phoneDigits.length < 11) { isValid = false; phoneInputField.style.borderColor = '#ff6b6b'; }
      if (!validateEmail(emailInput.value.trim())) { isValid = false; emailInput.style.borderColor = '#ff6b6b'; }
      if (!msgInput.value.trim()) { isValid = false; msgInput.style.borderColor = '#ff6b6b'; }

      if (!isValid) {
        showError('Пожалуйста, заполните все поля корректно.');
        return;
      }

      const formData = {
        name: nameInput.value.trim(),
        phone: phoneInputField.value,
        email: emailInput.value.trim(),
        message: msgInput.value.trim()
      };

      try {
        submitButton.textContent = "Отправка...";
        submitButton.disabled = true;
        
 
        const supabaseRequest = _supabase
          ? _supabase.from('contact_requests').insert([{
              full_name: formData.name,
              phone: formData.phone,
              email: formData.email,
              message: formData.message
            }])
          : Promise.resolve({ error: null });

        const emailRequest = fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: "Новая заявка с сайта Eat!",
            from_name: "Сайт Eat!",
            ...formData
          })
        });

        const [supaRes, emailRes] = await Promise.all([supabaseRequest, emailRequest]);
        
        if (supaRes.error) console.error("Ошибка Supabase:", supaRes.error);
        
        if (emailRes.ok) {
          contactForm.reset();
          showModal();
        } else {
          throw new Error('Ошибка при отправке письма на почту.');
        }
        
      } catch (err) {
        console.error("Ошибка:", err);
        showError(err.message || 'Не удалось отправить сообщение.');
      } finally {
        submitButton.textContent = "Отправить";
        submitButton.disabled = false;
      }
    });
  }

  function showError(text) {
    const oldMsg = document.querySelector('.form-error-message');
    if (oldMsg) oldMsg.remove();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.textContent = text;
    errorDiv.style.cssText = 'color:#ff6b6b; margin-top:10px; font-size:14px; text-align:center;';
    contactForm.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
  }

  // ===== 10. ДИНАМИЧЕСКАЯ ЗАГРУЗКА ОТЗЫВОВ =====
  async function loadDynamicFeedbacks() {
    const reviewsGrid = document.querySelector(".reviews-grid");
    if (!reviewsGrid) return;
    try {
      const { data: feedbacks, error } = await _supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      reviewsGrid.innerHTML = feedbacks?.length ? '' : '<div class="no-reviews">Пока нет отзывов. Станьте первым!</div>';
      feedbacks?.forEach(item => {
        const stars = '★'.repeat(item.rating || 5) + '☆'.repeat(5 - (item.rating || 5));
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
          <img src="${item.avatar_url || 'img/logo.png'}" alt="${item.name}" class="review-avatar">
          <div class="review-content">
            <h3>${escapeHtml(item.name || 'Аноним')}</h3>
            <div class="stars">${stars}</div>
            <p class="review-text" style="visibility: hidden;">${escapeHtml(item.comment || '')}</p>
            <button class="expand-btn">...</button>
          </div>
        `;
        reviewsGrid.appendChild(card);
      });
      const cards = Array.from(reviewsGrid.querySelectorAll(".review-card"));
      const reviewObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          animateReviewsSequentially(cards, 20);
          reviewObserver.unobserve(reviewsGrid);
        }
      }, { threshold: 0.1 });
      reviewObserver.observe(reviewsGrid);
    } catch (err) { reviewsGrid.innerHTML = '<div class="error-message">Не удалось загрузить отзывы.</div>'; }
  }

  function animateReviewsSequentially(cards, speed) {
    let current = 0;
    function showNext() {
      if (current >= cards.length) return;
      const card = cards[current];
      const textEl = card.querySelector(".review-text");
      const fullText = textEl.textContent.trim();
      textEl.textContent = "";
      textEl.style.visibility = "visible";
      card.classList.add("visible", "typing");
      let i = 0;
      const interval = setInterval(() => {
        if (i < fullText.length) { textEl.textContent += fullText[i++]; } 
        else { clearInterval(interval); card.classList.remove("typing"); current++; setTimeout(showNext, 300); }
      }, speed);
    }
    showNext();
  }

// ===== 12. МОДАЛЬНОЕ ОКНО  =====
  function showModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'custom-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="custom-modal">
        <div class="success-icon" style="font-size: 40px; color: #F2A2A2; margin-bottom: 15px;">✓</div>
        <h3 style="font-family: 'OnestBold', sans-serif; margin-bottom: 10px;">Спасибо за обращение!</h3>
        <p style="font-family: 'Onest', sans-serif; margin-bottom: 20px;">Ваше сообщение отправлено.<br>Скоро свяжемся!</p>
        <button class="button modal-close-btn">Закрыть</button>
      </div>
    `;
    document.body.appendChild(modalOverlay);
    
    const closeBtn = modalOverlay.querySelector('.modal-close-btn');
    const closeModal = () => modalOverlay.remove();
    
    closeBtn.onclick = closeModal;
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) closeModal();
    };
  }

});