(function () {

  const page = document.querySelector('.ip-page-home');
  if (!page) return;

  const menuButton = document.querySelector('.ip-menu-toggle');
  const menuPanel = document.querySelector('.ip-menu-panel');
  const accordions = document.querySelectorAll('.ip-accordion');

  if (!menuButton || !menuPanel) return;

  const DESKTOP_WIDTH = 1440;
  const DESKTOP_HEIGHT = 800;

  const MOBILE_WIDTH = 390;
  const MOBILE_HEIGHT = 700;

  let resizeFrame = null;

  function isMobile() {
    return window.innerWidth <= 767;
  }

  function getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  function updateHomeScale() {
    const viewport = getViewportSize();

    let scale;

    if (isMobile()) {
      const scaleX = viewport.width / MOBILE_WIDTH;
      const scaleY = viewport.height / MOBILE_HEIGHT;

      scale = Math.max(scaleX, scaleY);
    } else {
      scale = viewport.height / DESKTOP_HEIGHT;
    }

    page.style.setProperty('--ip-home-scale', scale);
  }

  function requestScaleUpdate() {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(updateHomeScale);
  }

  updateHomeScale();

  window.addEventListener('resize', requestScaleUpdate);

  window.addEventListener('orientationchange', function () {
    setTimeout(updateHomeScale, 250);
  });

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