(function () {

  const page = document.querySelector('.ip-page-home');
  if (!page) return;

  const menuButton = document.querySelector('.ip-menu-toggle');
  const menuPanel = document.querySelector('.ip-menu-panel');
  const accordions = document.querySelectorAll('.ip-accordion');

  if (!menuButton || !menuPanel) return;

  function getDesignSize() {
    if (window.innerWidth <= 767) {
      return {
        width: 390,
        height: 700
      };
    }

    return {
      width: 1440,
      height: 800
    };
  }

  function updateHomeScale() {
    const design = getDesignSize();

    const scaleX = window.innerWidth / design.width;
    const scaleY = window.innerHeight / design.height;

    const scale = Math.min(scaleX, scaleY);

    page.style.setProperty('--ip-home-scale', scale);
  }

  updateHomeScale();

  window.addEventListener('resize', updateHomeScale);

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

  accordions.forEach(function (accordion) {
    const button = accordion.querySelector('.ip-accordion-button');
    const content = accordion.querySelector('.ip-accordion-content');

    if (!button || !content) return;

    const buttonText = button.textContent.trim().toLowerCase();
    const isContactsAccordion = buttonText.includes('контакты');

    if (!isContactsAccordion) {
      button.addEventListener('click', function () {
        accordion.classList.toggle('is-open');
      });

      return;
    }

    const submenu = content.querySelector('.ip-submenu');
    const lines = submenu ? Array.from(submenu.children) : [];

    lines.forEach(function (line) {
      line.style.overflow = 'hidden';
      line.style.maxHeight = '0px';
      line.style.transition = 'max-height 620ms cubic-bezier(.19,1,.22,1)';
    });

    function openContactsAccordion() {
      accordion.classList.add('is-open');

      lines.forEach(function (line) {
        requestAnimationFrame(function () {
          line.style.maxHeight = line.scrollHeight + 'px';
        });
      });
    }

    function closeContactsAccordion() {
      lines.forEach(function (line) {
        line.style.maxHeight = line.scrollHeight + 'px';

        requestAnimationFrame(function () {
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