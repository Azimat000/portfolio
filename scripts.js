/* scripts.js
   Функциональность:
   - Хеш-маршрутизация между секциями (#works, #about, #contacts)
   - Модальное увеличение изображений (клавиша Esc для закрытия, клики по фону)
   - Проверка заполнения контактной формы и отправка через Formspree
   - Удаление margin у .work-gallery, если нет изображений
*/

/* ====== Навигация по хешу ====== */
(function(){
  const pages = document.querySelectorAll('.page');
  const links = document.querySelectorAll('[data-link]');
  
  function showPage(id){
    pages.forEach(p => {
      if (p.id === id) {
        p.classList.add('page--visible');
        p.setAttribute('aria-hidden', 'false');
      } else {
        p.classList.remove('page--visible');
        p.setAttribute('aria-hidden', 'true');
      }
    });
    window.scrollTo({top:0, behavior: 'smooth'});
  }

  function handleHash(){
    const hash = location.hash.replace('#','') || 'works';
    const el = document.getElementById(hash);
    if (el) {
      showPage(hash);
    } else {
      showPage('works');
    }
  }

  window.addEventListener('hashchange', handleHash, false);
  window.addEventListener('load', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    handleHash();
  });
})();

/* ====== Модальное увеличение изображений ====== */
(function(){
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');
  const thumbs = document.querySelectorAll('.work-thumb');
  const galleryImgs = document.querySelectorAll('.work-gallery img');

  function openModal(src, alt, caption){
    modalImg.src = src;
    modalImg.alt = alt || '';
    modalCaption.textContent = caption || '';
    modal.setAttribute('aria-hidden', 'false');
    modal.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    modalImg.alt = '';
    modalCaption.textContent = '';
    document.body.style.overflow = '';
  }

  // Основные изображения
  thumbs.forEach(btn => {
    btn.addEventListener('click', () => {
      const thumb = btn.querySelector('img');
      const full = btn.dataset.full || thumb.src;
      const alt = thumb.alt || '';
      const caption = btn.closest('.work-card')?.querySelector('.work-title')?.textContent || '';
      openModal(full, alt, caption);
    });
  });

  // Дополнительные изображения
  galleryImgs.forEach(img => {
    img.addEventListener('click', () => {
      const full = img.dataset.full || img.src;
      const alt = img.alt || '';
      const caption = img.closest('.work-card')?.querySelector('.work-title')?.textContent || '';
      openModal(full, alt, caption);
    });
  });

  // Закрытие по кнопке или клику по фону
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  // Закрытие по Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Не даём фокусу убежать из модалки
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') e.preventDefault();
  });
})();

/* ====== Проверка и отправка контактной формы ====== */
(function(){
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const message = form.elements['message'].value.trim();

    // Проверка на пустые поля
    if (!name || !email || !message) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    // Проверка корректности email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Введите корректный email.');
      return;
    }

    // Блокируем кнопку, чтобы избежать повторных кликов
    const submitBtn = form.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
      // Отправка данных через Formspree (замени URL на свой)
      const response = await fetch("https://formspree.io/f/mqagdvyy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        alert('Спасибо! Ваше сообщение отправлено.');
        form.reset();
      } else {
        alert('Ошибка при отправке. Попробуйте позже.');
      }
    } catch (error) {
      alert('Ошибка сети. Проверьте подключение к интернету.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить';
    }
  });
})();

/* ====== Убираем margin-top у .work-gallery без изображений ====== */
(function(){
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".work-gallery").forEach(gallery => {
      const hasImages = gallery.querySelector("img") !== null;
      if (!hasImages) {
        gallery.style.marginTop = "0";
      }
    });
  });
})();

