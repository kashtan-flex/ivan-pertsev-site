(function () {

  const DESIGN_WIDTH = 1440;
  const DESIGN_HEIGHT = 800;

  const page = document.querySelector('.ip-page-home');
  const menuButton = document.querySelector('.ip-menu-toggle');
  const menuPanel = document.querySelector('.ip-menu-panel');
  const accordions = document.querySelectorAll('.ip-accordion');

  if (!page) return;

  function updateHomeScale() {
    const scaleX = window.innerWidth / DESIGN_WIDTH;
    const scaleY = window.innerHeight / DESIGN_HEIGHT;
    const scale = Math.min(scaleX, scaleY);

    page.style.setProperty('--ip-home-scale', scale);
  }

  updateHomeScale();
  window.addEventListener('resize', updateHomeScale);

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
    menuPanel.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  window.addEventListener('scroll', function () {
    if (menuPanel.classList.contains('is-open')) {
      closeMenu();
    }
  });

  accordions.forEach(function (accordion) {
    const button = accordion.querySelector('.ip-accordion-button');

    button.addEventListener('click', function () {
      accordion.classList.toggle('is-open');
    });
  });

})();