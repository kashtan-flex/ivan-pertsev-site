/*
==================================================
LEGAL JS

Версия: legal-js-009-policy-burger-viewport-lock

ИЗМЕНЕНИЯ:
- создан JS для текстовых правовых страниц проекта
- сохранена логика меню, аккордеонов, popup и маски даты по approved-страницам
- добавлена обработка data-popup-open="main" для пунктов «Другое», «Написать» и popup-триггеров
- добавлена работа стрелки наверх
- desktop burger/menu жёстко синхронизированы с viewport через CSS-переменные и inline important styles
- закрытие меню при scroll/wheel/touchmove сохранено как на approved-страницах
- DOM меню не переносится и approved-анимация не ломается
- остальные страницы сайта не изменялись
==================================================
*/

(function(){
  'use strict';

  var page = document.querySelector('[data-legal-page]');
  var menuButton = document.querySelector('.ip-menu-toggle');
  var menuPanel = document.querySelector('.ip-menu-panel');
  var accordions = Array.prototype.slice.call(document.querySelectorAll('.ip-accordion'));
  var popup = document.querySelector('[data-popup="main"]');
  var popupOpenTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-popup-open]'));
  var popupCloseTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-popup-close]'));
  var scrollTopButton = document.querySelector('.ip-legal-scrolltop');
  var shell = document.querySelector('.ip-policy-shell');
  var resizeFrame = null;

  var DESIGN = {
    desktop:{ width:1440, height:800 },
    mobile:{ width:390, height:700 },
    breakpoint:767
  };

  if(!page || !menuButton || !menuPanel){
    return;
  }

  function isMobile(){
    return window.innerWidth <= DESIGN.breakpoint;
  }

  function getViewportHeight(){
    if(window.visualViewport && window.visualViewport.height){
      return window.visualViewport.height;
    }

    return window.innerHeight;
  }

  function getDesktopMenuScale(){
    var viewportWidth = window.innerWidth;
    var viewportHeight = getViewportHeight();

    return Math.min(
      viewportWidth / DESIGN.desktop.width,
      viewportHeight / DESIGN.desktop.height
    );
  }

  function applyPolicyMenuViewportLock(){
    if(isMobile()){
      menuButton.style.removeProperty('position');
      menuButton.style.removeProperty('top');
      menuButton.style.removeProperty('right');
      menuButton.style.removeProperty('left');
      menuButton.style.removeProperty('bottom');
      menuButton.style.removeProperty('z-index');
      menuButton.style.removeProperty('transform');
      menuButton.style.removeProperty('transform-origin');

      menuPanel.style.removeProperty('position');
      menuPanel.style.removeProperty('top');
      menuPanel.style.removeProperty('right');
      menuPanel.style.removeProperty('left');
      menuPanel.style.removeProperty('bottom');
      menuPanel.style.removeProperty('z-index');
      menuPanel.style.removeProperty('width');
      menuPanel.style.removeProperty('height');
      menuPanel.style.removeProperty('min-height');
      menuPanel.style.removeProperty('max-width');
      menuPanel.style.removeProperty('padding');
      menuPanel.style.removeProperty('overflow');
      menuPanel.style.removeProperty('transform');
      menuPanel.style.removeProperty('transform-origin');

      document.documentElement.style.removeProperty('--ip-policy-menu-scale');
      document.documentElement.style.removeProperty('--ip-policy-menu-top');
      document.documentElement.style.removeProperty('--ip-policy-menu-right');
      document.documentElement.style.removeProperty('--ip-policy-menu-panel-top');
      document.documentElement.style.removeProperty('--ip-policy-menu-panel-right');
      return;
    }

    var viewportWidth = window.innerWidth;
    var viewportHeight = getViewportHeight();
    var scale = getDesktopMenuScale();
    var stageLeft = Math.max(0, (viewportWidth - (DESIGN.desktop.width * scale)) / 2);
    var stageTop = Math.max(0, (viewportHeight - (DESIGN.desktop.height * scale)) / 2);
    var menuTop = stageTop + (60 * scale);
    var menuRight = stageLeft + (100 * scale);

    document.documentElement.style.setProperty('--ip-policy-menu-scale', scale.toFixed(5));
    document.documentElement.style.setProperty('--ip-policy-menu-top', menuTop.toFixed(2) + 'px');
    document.documentElement.style.setProperty('--ip-policy-menu-right', menuRight.toFixed(2) + 'px');
    document.documentElement.style.setProperty('--ip-policy-menu-panel-top', stageTop.toFixed(2) + 'px');
    document.documentElement.style.setProperty('--ip-policy-menu-panel-right', stageLeft.toFixed(2) + 'px');

    menuButton.style.setProperty('position', 'fixed', 'important');
    menuButton.style.setProperty('top', menuTop.toFixed(2) + 'px', 'important');
    menuButton.style.setProperty('right', menuRight.toFixed(2) + 'px', 'important');
    menuButton.style.setProperty('left', 'auto', 'important');
    menuButton.style.setProperty('bottom', 'auto', 'important');
    menuButton.style.setProperty('z-index', '10050', 'important');
    menuButton.style.setProperty('transform', 'scale(' + scale.toFixed(5) + ')', 'important');
    menuButton.style.setProperty('transform-origin', 'top right', 'important');

    menuPanel.style.setProperty('position', 'fixed', 'important');
    menuPanel.style.setProperty('top', stageTop.toFixed(2) + 'px', 'important');
    menuPanel.style.setProperty('right', stageLeft.toFixed(2) + 'px', 'important');
    menuPanel.style.setProperty('left', 'auto', 'important');
    menuPanel.style.setProperty('bottom', 'auto', 'important');
    menuPanel.style.setProperty('z-index', '10040', 'important');
    menuPanel.style.setProperty('width', '385px', 'important');
    menuPanel.style.setProperty('height', '800px', 'important');
    menuPanel.style.setProperty('min-height', '800px', 'important');
    menuPanel.style.setProperty('max-width', '385px', 'important');
    menuPanel.style.setProperty('padding', '60px 100px 80px 60px', 'important');
    menuPanel.style.setProperty('overflow', 'hidden', 'important');
    menuPanel.style.setProperty('transform', 'scale(' + scale.toFixed(5) + ')', 'important');
    menuPanel.style.setProperty('transform-origin', 'top right', 'important');
  }

  function updatePolicyScale(){
    if(!shell){
      return;
    }

    var viewportWidth = window.innerWidth;
    var viewportHeight = getViewportHeight();
    var scale = 1;

    if(isMobile()){
      scale = Math.max(
        viewportWidth / DESIGN.mobile.width,
        viewportHeight / DESIGN.mobile.height
      );

      document.documentElement.style.setProperty('--ip-policy-mobile-scale', scale.toFixed(5));
      document.documentElement.style.removeProperty('--ip-policy-desktop-scale');
    } else {
      scale = viewportWidth / DESIGN.desktop.width;

      document.documentElement.style.setProperty('--ip-policy-desktop-scale', scale.toFixed(5));
      document.documentElement.style.removeProperty('--ip-policy-mobile-scale');
    }

    applyPolicyMenuViewportLock();

    var pageHeight = Math.ceil(shell.scrollHeight * scale);

    document.documentElement.style.setProperty('--ip-policy-page-height', pageHeight + 'px');
  }

  function requestPolicyScaleUpdate(){
    if(resizeFrame){
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(updatePolicyScale);
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

    accordions.forEach(function(accordion){
      accordion.classList.remove('is-open');
    });
  }

  function toggleMenu(event){
    if(event){
      event.preventDefault();
      event.stopPropagation();
    }

    if(menuPanel.classList.contains('is-open')){
      closeMenu();
      return;
    }

    openMenu();
  }

  function setupAccordion(accordion){
    var button = accordion.querySelector('.ip-accordion-button');

    if(!button){
      return;
    }

    button.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      accordion.classList.toggle('is-open');
    });
  }

  function openPopup(){
    if(!popup){
      return;
    }

    closeMenu();
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('ip-popup-lock');
    document.body.classList.add('ip-popup-lock');
  }

  function closePopup(){
    if(!popup){
      return;
    }

    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('ip-popup-lock');
    document.body.classList.remove('ip-popup-lock');
    updatePolicyScale();
  }

  function setupPopupTriggers(){
    popupOpenTriggers.forEach(function(trigger){
      trigger.addEventListener('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        openPopup();
      });
    });

    popupCloseTriggers.forEach(function(trigger){
      trigger.addEventListener('click', function(event){
        event.preventDefault();
        closePopup();
      });
    });

    document.addEventListener('keydown', function(event){
      if(event.key === 'Escape'){
        closePopup();
        closeMenu();
      }
    });

    if(popup){
      var form = popup.querySelector('.ip-popup-form');

      if(form){
        form.addEventListener('submit', function(event){
          event.preventDefault();
        });
      }
    }
  }


  function scrollToTop(){
    window.scrollTo({
      top:0,
      behavior:'smooth'
    });
  }

  function setupDateMask(){
    if(!popup){
      return;
    }

    var dateInput = popup.querySelector('input[name="date"]');

    if(!dateInput){
      return;
    }

    dateInput.addEventListener('input', function(){
      var value = dateInput.value.replace(/\D/g, '');

      if(value.length > 8){
        value = value.slice(0, 8);
      }

      var formatted = '';

      if(value.length > 0){
        formatted += value.substring(0, 2);
      }

      if(value.length >= 3){
        formatted += '.' + value.substring(2, 4);
      }

      if(value.length >= 5){
        formatted += '.' + value.substring(4, 8);
      }

      dateInput.value = formatted;
    });
  }

  updatePolicyScale();

  window.addEventListener('resize', requestPolicyScaleUpdate, { passive:true });

  window.addEventListener('orientationchange', function(){
    window.setTimeout(updatePolicyScale, 250);
  }, { passive:true });

  if(window.visualViewport){
    window.visualViewport.addEventListener('resize', requestPolicyScaleUpdate, { passive:true });
  }

  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(updatePolicyScale).catch(function(){
      return null;
    });
  }

  window.setTimeout(updatePolicyScale, 250);

  menuButton.addEventListener('click', toggleMenu);
  accordions.forEach(setupAccordion);
  setupPopupTriggers();
  setupDateMask();

  if(scrollTopButton){
    scrollTopButton.addEventListener('click', scrollToTop);
  }

  function closeMenuOnScrollIntent(){
    if(menuPanel.classList.contains('is-open')){
      closeMenu();
    }
  }

  window.addEventListener('scroll', closeMenuOnScrollIntent, { passive:true });
  window.addEventListener('wheel', closeMenuOnScrollIntent, { passive:true, capture:true });
  window.addEventListener('touchmove', closeMenuOnScrollIntent, { passive:true, capture:true });
})();