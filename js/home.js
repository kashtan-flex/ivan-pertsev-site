(function () {

  const accordions = document.querySelectorAll('.ip-accordion');

  accordions.forEach(function (accordion) {
    const button = accordion.querySelector('.ip-accordion-button');
    const content = accordion.querySelector('.ip-accordion-content');

    if (!button || !content) return;

    const buttonText = button.textContent.trim().toLowerCase();

    const isContactsAccordion = buttonText.includes('контакты');

    if (!isContactsAccordion) {
      // обычные аккордеоны (Проекты) — логика без изменений
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
      line.style.transition = 'max-height 520ms cubic-bezier(.19,1,.22,1)';
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