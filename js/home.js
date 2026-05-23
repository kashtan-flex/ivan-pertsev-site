(function () {

  /* =========================
     БАЗОВЫЕ РАЗМЕРЫ МАКЕТА
  ========================= */

  const DESIGN_WIDTH = 1440;
  const DESIGN_HEIGHT = 800;

  const page = document.querySelector('.ip-page-home');

  const menuButton = document.querySelector('.ip-menu-toggle');
  const menuPanel = document.querySelector('.ip-menu-panel');

  const accordions = document.querySelectorAll('.ip-accordion');

  if (!page) return;

  /* =========================
     АДАПТИВНОЕ МАСШТАБИРОВАНИЕ
  ========================= */

  function updateHomeScale() {

    const scaleX = window.innerWidth / DESIGN_WIDTH;
    const scaleY = window.innerHeight / DESIGN_HEIGHT;

    const scale = Math.min(scaleX, scaleY);

    page.style.setProperty('--ip-home-scale', scale);

  }

  updateHomeScale();

  window.addEventListener('resize', updateHomeScale);

  /* =========================
     МЕНЮ
  ========================= */

  if (!menuButton || !menuPanel) return;

  function openMenu() {

    menuButton.classList.add('is-open');
    menuPanel.classList.add('is-open');

  }

  function closeMenu() {

    menuButton.classList.remove('is-open');
    menuPanel.classList.remove('is-open');

  }

  menuButton.addEventListener('click', function () {

    if (menuPanel.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }

  });

  window.addEventListener('scroll', function () {

    if (menuPanel.classList.contains('is-open')) {
      closeMenu();
    }

  });

  /* =========================
     АККОРДЕОНЫ
  ========================= */

  accordions.forEach(function (accordion) {

    const button = accordion.querySelector('.ip-accordion-button');
    const content = accordion.querySelector('.ip-accordion-content');

    if (!button || !content) return;

    const buttonText = button.textContent.trim().toLowerCase();

    const isContactsAccordion =
      buttonText.includes('контакты');

    /* =========================
       ПРОЕКТЫ
       Оставляем старую логику без изменений
    ========================= */

    if (!isContactsAccordion) {

      button.addEventListener('click', function () {

        accordion.classList.toggle('is-open');

      });

      return;

    }

    /* =========================
       КОНТАКТЫ
       Более плавное раскрытие и закрытие
    ========================= */

    accordion.classList.add('ip-contacts-accordion');

    content.style.maxHeight = '0px';
    content.style.overflow = 'hidden';

    content.style.transition =
      'max-height 620ms cubic-bezier(.19,1,.22,1)';

    function openContactsAccordion() {

      accordion.classList.add('is-open');

      content.style.maxHeight = '0px';

      requestAnimationFrame(function () {

        content.style.maxHeight = content.scrollHeight + 'px';

      });

    }

    function closeContactsAccordion() {

      content.style.maxHeight = content.scrollHeight + 'px';

      requestAnimationFrame(function () {

        accordion.classList.remove('is-open');
        content.style.maxHeight = '0px';

      });

    }

    button.addEventListener('click', function () {

      if (accordion.classList.contains('is-open')) {
        closeContactsAccordion();
      } else {
        openContactsAccordion();
      }

    });

  });

})();