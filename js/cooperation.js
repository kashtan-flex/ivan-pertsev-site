/*
==================================================
COOPERATION JS

Версия: cooperation-js-001-desktop

ИЗМЕНЕНИЯ:
- создан desktop JS страницы «Сотрудничество» на базе логики главной страницы
- сохранено масштабирование fixed stage 1440×800
- сохранена логика меню, аккордеонов, popup и маски даты
- добавлена обработка data-popup-open="main" для кнопки «Обсудить детали"
- добавлена безопасная заглушка для строки «Портфолио» без скачивания
- mobile-логика не создавалась
==================================================
*/

(function(){
  'use strict';

  const page = document.querySelector('.ip-page-cooperation');
  const menuButton = document.querySelector('.ip-menu-toggle');
  const menuPanel = document.querySelector('.ip-menu-panel');
  const accordions = document.querySelectorAll('.ip-accordion');
  const mainPopup = document.querySelector('[data-popup="main"]');

  if(!page || !menuButton || !menuPanel){
    return;
  }

  const DESIGN = {
    desktop:{ width:1440, height:800 }
  };

  let resizeFrame = null;

  function updateCooperationScale(){
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scale = Math.min(viewportWidth / DESIGN.desktop.width, viewportHeight / DESIGN.desktop.height);

    page.style.setProperty('--ip-cooperation-scale', scale);
  }

  function requestScaleUpdate(){
    if(resizeFrame){
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(updateCooperationScale);
  }

  function openMenu(){
    menuButton.classList.add('is-open');
    menuPanel.classList.add('is-open');
    menuPanel.style.pointerEvents = 'auto';
  }

  function closeMenu(){
    menuButton.classList.remove('is-open');
    menuPanel.classList.remove('is-open');
    menuPanel.style.pointerEvents = 'none';
  }

  function toggleMenu(){
    menuPanel.classList.contains('is-open') ? closeMenu() : openMenu();
  }

  function openMainPopup(){
    if(!mainPopup){
      return;
    }

    closeMenu();
    mainPopup.classList.add('is-open');
    mainPopup.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('ip-popup-lock');
    document.body.classList.add('ip-popup-lock');
  }

  function closeMainPopup(){
    if(!mainPopup){
      return;
    }

    mainPopup.classList.remove('is-open');
    mainPopup.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('ip-popup-lock');
    document.body.classList.remove('ip-popup-lock');
  }

  function setupDateMask(){
    if(!mainPopup){
      return;
    }

    const dateInput =
      mainPopup.querySelector('input[name="date"]') ||
      mainPopup.querySelector('.ip-popup-fields input:nth-child(3)');

    if(!dateInput){
      return;
    }

    const mask = '__.__.____';

    function getDigits(value){
      return value.replace(/\D/g, '').slice(0, 8);
    }

    function buildMaskedValue(digits){
      const chars = mask.split('');
      const digitPositions = [0, 1, 3, 4, 6, 7, 8, 9];

      digits.split('').forEach(function(digit, index){
        chars[digitPositions[index]] = digit;
      });

      return chars.join('');
    }

    function setCaretToNextSlot(){
      const firstEmptyIndex = dateInput.value.indexOf('_');
      const caretPosition = firstEmptyIndex === -1 ? dateInput.value.length : firstEmptyIndex;

      requestAnimationFrame(function(){
        dateInput.setSelectionRange(caretPosition, caretPosition);
      });
    }

    function updateMaskedValue(){
      const digits = getDigits(dateInput.value);
      dateInput.value = buildMaskedValue(digits);
      setCaretToNextSlot();
    }

    dateInput.setAttribute('type', 'text');
    dateInput.setAttribute('placeholder', 'Дата');
    dateInput.setAttribute('inputmode', 'numeric');
    dateInput.setAttribute('maxlength', '10');
    dateInput.setAttribute('autocomplete', 'off');

    dateInput.addEventListener('focus', function(){
      if(!getDigits(dateInput.value)){
        dateInput.value = mask;
      }

      setCaretToNextSlot();
    });

    dateInput.addEventListener('click', setCaretToNextSlot);

    dateInput.addEventListener('keydown', function(event){
      const allowedKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End'
      ];

      if(allowedKeys.includes(event.key)){
        return;
      }

      if(!/^\d$/.test(event.key)){
        event.preventDefault();
      }
    });

    dateInput.addEventListener('input', updateMaskedValue);

    dateInput.addEventListener('paste', function(event){
      event.preventDefault();

      const pastedText = (event.clipboardData || window.clipboardData).getData('text');
      const digits = getDigits(pastedText);

      dateInput.value = buildMaskedValue(digits);
      setCaretToNextSlot();
    });

    dateInput.addEventListener('blur', function(){
      if(!getDigits(dateInput.value)){
        dateInput.value = '';
        dateInput.setAttribute('placeholder', 'Дата');
      }
    });
  }

  function setupPopupTriggers(){
    document.addEventListener('click', function(event){
      const target = event.target.closest('a, button, [data-popup-close]');

      if(!target){
        return;
      }

      if(target.hasAttribute('data-popup-close')){
        event.preventDefault();
        closeMainPopup();
        return;
      }

      if(target.matches('[data-popup-open="main"]')){
        event.preventDefault();
        openMainPopup();
        return;
      }

      const text = target.textContent.trim().toLowerCase();

      if(text === 'другое' || text === 'написать'){
        event.preventDefault();
        openMainPopup();
      }
    });

    document.addEventListener('keydown', function(event){
      if(event.key === 'Escape'){
        closeMainPopup();
      }
    });

    if(mainPopup){
      const form = mainPopup.querySelector('.ip-popup-form');

      if(form){
        form.addEventListener('submit', function(event){
          event.preventDefault();
        });
      }
    }
  }

  function setupDisabledDownloads(){
    const disabledLinks = document.querySelectorAll('.ip-cooperation-download.is-disabled');

    disabledLinks.forEach(function(link){
      link.addEventListener('click', function(event){
        event.preventDefault();
      });
    });
  }

  function setupAccordion(accordion){
    const button = accordion.querySelector('.ip-accordion-button');
    const content = accordion.querySelector('.ip-accordion-content');

    if(!button || !content){
      return;
    }

    const isContactsAccordion = button.textContent.trim().toLowerCase().includes('контакты');

    if(!isContactsAccordion){
      button.addEventListener('click', function(){
        accordion.classList.toggle('is-open');
      });

      return;
    }

    const submenu = content.querySelector('.ip-submenu');
    const lines = submenu ? Array.from(submenu.children) : [];

    lines.forEach(function(line){
      line.style.overflow = 'hidden';
      line.style.maxHeight = '0px';
      line.style.transition = 'max-height 620ms cubic-bezier(.19,1,.22,1)';
    });

    function openContactsAccordion(){
      accordion.classList.add('is-open');

      lines.forEach(function(line){
        requestAnimationFrame(function(){
          line.style.maxHeight = line.scrollHeight + 'px';
        });
      });
    }

    function closeContactsAccordion(){
      lines.forEach(function(line){
        line.style.maxHeight = line.scrollHeight + 'px';

        requestAnimationFrame(function(){
          line.style.maxHeight = '0px';
        });
      });

      accordion.classList.remove('is-open');
    }

    button.addEventListener('click', function(){
      accordion.classList.contains('is-open')
        ? closeContactsAccordion()
        : openContactsAccordion();
    });
  }

  updateCooperationScale();
  setupPopupTriggers();
  setupDateMask();
  setupDisabledDownloads();

  window.addEventListener('resize', requestScaleUpdate);

  window.addEventListener('orientationchange', function(){
    setTimeout(updateCooperationScale, 250);
  });

  menuButton.addEventListener('click', toggleMenu);

  window.addEventListener('scroll', function(){
    if(menuPanel.classList.contains('is-open')){
      closeMenu();
    }
  });

  accordions.forEach(setupAccordion);
})();
