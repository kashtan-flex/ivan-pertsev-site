(function () {
  const page = document.querySelector('.ip-page-home');
  const menuButton = document.querySelector('.ip-menu-toggle');
  const menuPanel = document.querySelector('.ip-menu-panel');
  const accordions = document.querySelectorAll('.ip-accordion');

  if (!page || !menuButton || !menuPanel) return;

  const DESIGN = {
    desktop: {
      width: 1440,
      height: 800
    },
    mobile: {
      width: 390,
      height: 700
    },
    breakpoint: 767
  };

  let resizeFrame = null;

  function isMobile() {
    return window.innerWidth <= DESIGN.breakpoint;
  }

  function updateHomeScale() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let scale;

    if (isMobile()) {
      const scaleX = viewportWidth / DESIGN.mobile.width;
      const scaleY = viewportHeight / DESIGN.mobile.height;

      scale = Math.max(scaleX, scaleY);
    } else {
      scale = viewportHeight / DESIGN.desktop.height;
    }

    page.style.setProperty('--ip-home-scale', scale);
  }

  function requestScaleUpdate() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(updateHomeScale);
  }

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

  function toggleMenu() {
    if (menuPanel.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function setupAccordion(accordion) {
    const button = accordion.querySelector('.ip-accordion-button');
    const content = accordion.querySelector('.ip-accordion-content');

    if (!button || !content) return;

    const isContactsAccordion = button.textContent.trim().toLowerCase().includes('контакты');

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
  }

  updateHomeScale();

  window.addEventListener('resize', requestScaleUpdate);

  window.addEventListener('orientationchange', function () {
    setTimeout(updateHomeScale, 250);
  });

  menuButton.addEventListener('click', toggleMenu);

  window.addEventListener('scroll', function () {
    if (menuPanel.classList.contains('is-open')) closeMenu();
  });

  accordions.forEach(setupAccordion);
})();