(function () {

  const page = document.querySelector('.ip-page-home');
  if (!page) return;

  const menuButton = document.querySelector('.ip-menu-toggle');
  const menuPanel = document.querySelector('.ip-menu-panel');
  const accordions = document.querySelectorAll('.ip-accordion');

  if (!menuButton || !menuPanel) return;

  /* =========================
     АДАПТИВНОЕ МАСШТАБИРОВАНИЕ
  ========================= */
  const DESIGN_WIDTH = 1440;
  const DESIGN_HEIGHT = 800;

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
  function openMenu() {
    menuButton.classList.add('is-open');
    menuPanel.classList.add('is-open');
    menuPanel.style.pointerEvents = 'auto';
  }

  function closeMenu() {
    menuButton.classList.remove('is-open');
    menuPanel.classList.remove('is-open');
    menuPanel.style.pointerEvents = 'none';
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
    const isContactsAccordion = buttonText.includes('контакты');

    if (!isContactsAccordion) {
      // обычные аккордеоны (Проекты)
      button.addEventListener('click', function () {
        accordion.classList.toggle('is-open');
      });
      return;
    }

    // ==============================
    // Контакты — отдельные строки
    // ==============================
    const lines = Array.from(content.children);
    lines.forEach(line => {
      line.style.overflow = 'hidden';
      line.style.maxHeight = '0px';
      line.style.transition = 'max-height 620ms cubic-bezier(.19,1,.22,1)';
    });

    function openContactsAccordion() {
      accordion.classList.add('is-open');
      lines.forEach((line, index) => {
        requestAnimationFrame(() => {
          line.style.maxHeight = line.scrollHeight + 'px';
        });
      });
    }

    function closeContactsAccordion() {
      lines.forEach((line, index) => {
        line.style.maxHeight = line.scrollHeight + 'px';
        requestAnimationFrame(() => {
          line.style.maxHeight = '0px';
        });
      });
      accordion.classList.remove('is-open');
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