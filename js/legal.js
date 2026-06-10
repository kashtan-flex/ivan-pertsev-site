/*
==================================================
LEGAL JS

Версия: legal-js-059-consent-page-ready

ИЗМЕНЕНИЯ:
- файл основан на legal-js-030-mobile-real-bottom-trim
- desktop-логика, desktop-меню, burger/cross, фон меню, текст политики, масштабирование desktop и геометрия desktop не изменялись
- mobile-only: нижняя геометрия страницы из версии 030 сохранена без изменений
- mobile-only: закрытие меню при скролле переведено на approved-логику Wedding Mobile: touchstart/touchmove с порогом движения, wheel и scroll без capture
- mobile-only: добавлен промежуточный класс is-closing, чтобы меню не исчезало мгновенно, а плавно уезжало по CSS-анимации
- desktop-only: закрытие меню при scroll/wheel возвращено к мгновенному поведению без is-closing-задержки
- desktop-only: добавлено отслеживание scroll не только на window, но и на page/document, чтобы меню не оставалось открытым при прокрутке страницы
- mobile-логика, mobile-анимация, нижняя геометрия и CSS не изменялись
- файл подключён к странице согласия без изменения рабочей логики меню, масштабирования и стрелки
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
  var menuStage = null;
  var menuCloseTimer = null;
  var touchStartY = null;
  var touchStartedInsideMenu = false;

  var menuButtonOriginalParent = menuButton ? menuButton.parentNode : null;
  var menuButtonOriginalNext = menuButton ? menuButton.nextSibling : null;
  var menuPanelOriginalParent = menuPanel ? menuPanel.parentNode : null;
  var menuPanelOriginalNext = menuPanel ? menuPanel.nextSibling : null;

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

  function getDesktopScale(){
    return Math.min(
      window.innerWidth / DESIGN.desktop.width,
      getViewportHeight() / DESIGN.desktop.height
    );
  }

  function getMenuStage(){
    if(menuStage && menuStage.parentNode){
      return menuStage;
    }

    menuStage = document.querySelector('.ip-policy-menu-stage');

    if(menuStage){
      return menuStage;
    }

    menuStage = document.createElement('div');
    menuStage.className = 'ip-policy-menu-stage';
    menuStage.setAttribute('aria-hidden', 'false');
    document.body.appendChild(menuStage);

    return menuStage;
  }

  function insertBack(parent, node, nextSibling){
    if(!parent || !node){
      return;
    }

    if(nextSibling && nextSibling.parentNode === parent){
      parent.insertBefore(node, nextSibling);
      return;
    }

    parent.appendChild(node);
  }

  function syncPolicyMenuStage(){
    if(isMobile()){
      insertBack(menuButtonOriginalParent, menuButton, menuButtonOriginalNext);
      insertBack(menuPanelOriginalParent, menuPanel, menuPanelOriginalNext);

      if(menuStage){
        menuStage.classList.remove('is-open');
        menuStage.style.display = 'none';
      }

      document.documentElement.style.removeProperty('--ip-policy-menu-stage-scale');
      document.documentElement.style.removeProperty('--ip-policy-menu-stage-height');
      return;
    }

    var stage = getMenuStage();
    var scale = getDesktopScale();
    var stageHeight = Math.max(
      DESIGN.desktop.height,
      Math.ceil(getViewportHeight() / scale)
    );

    stage.style.display = 'block';

    document.documentElement.style.setProperty('--ip-policy-menu-stage-scale', scale.toFixed(5));
    document.documentElement.style.setProperty('--ip-policy-menu-stage-height', stageHeight + 'px');

    if(menuButtonOriginalParent && menuButton.parentNode !== menuButtonOriginalParent){
      insertBack(menuButtonOriginalParent, menuButton, menuButtonOriginalNext);
    }

    if(menuPanel.parentNode !== stage){
      stage.appendChild(menuPanel);
    }
  }

  function getNumericStyleValue(element, property){
    if(!element){
      return 0;
    }

    var value = parseFloat(window.getComputedStyle(element).getPropertyValue(property));

    if(Number.isNaN(value)){
      return 0;
    }

    return value;
  }

  function syncMobilePageBottom(scale){
    var pageBottomGap = 50;
    var contentToButtonGap = 50;
    var baseButtonHeight = scrollTopButton ? scrollTopButton.offsetHeight : 24;
    var visualButtonHeight = baseButtonHeight * scale;
    var legalPage = shell.querySelector('.ip-legal-page');
    var contentBottom = legalPage
      ? Math.ceil((legalPage.offsetTop + legalPage.offsetHeight) * scale)
      : Math.ceil(Math.max(0, shell.scrollHeight - getNumericStyleValue(shell, 'padding-bottom')) * scale);
    var buttonTop = contentBottom + contentToButtonGap;
    var pageHeight = Math.max(
      getViewportHeight(),
      buttonTop + visualButtonHeight + pageBottomGap
    );

    document.documentElement.style.setProperty('--ip-policy-page-height', Math.ceil(pageHeight) + 'px');
    document.documentElement.style.setProperty('--ip-policy-bg-height', Math.ceil(pageHeight / scale) + 'px');

    if(scrollTopButton){
      scrollTopButton.style.top = Math.ceil(buttonTop) + 'px';
      scrollTopButton.style.bottom = 'auto';
    }
  }

  function resetDesktopScrollTopPosition(){
    if(!scrollTopButton){
      return;
    }

    scrollTopButton.style.removeProperty('top');
    scrollTopButton.style.removeProperty('bottom');
  }

  function updatePolicyScale(){
    if(!shell){
      return;
    }

    var scale = 1;

    if(isMobile()){
      scale = Math.max(
        window.innerWidth / DESIGN.mobile.width,
        getViewportHeight() / DESIGN.mobile.height
      );

      document.documentElement.style.setProperty('--ip-policy-mobile-scale', scale.toFixed(5));
      document.documentElement.style.removeProperty('--ip-policy-desktop-scale');

      syncPolicyMenuStage();
      syncMobilePageBottom(scale);
      return;
    }

    scale = getDesktopScale();

    document.documentElement.style.setProperty('--ip-policy-desktop-scale', scale.toFixed(5));
    document.documentElement.style.removeProperty('--ip-policy-mobile-scale');
    document.documentElement.style.removeProperty('--ip-policy-bg-height');

    syncPolicyMenuStage();
    resetDesktopScrollTopPosition();

    document.documentElement.style.setProperty(
      '--ip-policy-page-height',
      Math.ceil(shell.scrollHeight * scale) + 'px'
    );
  }

  function requestPolicyScaleUpdate(){
    if(resizeFrame){
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(updatePolicyScale);
  }

  function openMenu(){
    if(menuCloseTimer){
      window.clearTimeout(menuCloseTimer);
      menuCloseTimer = null;
    }

    menuPanel.classList.remove('is-closing');
    menuButton.classList.add('is-open');
    menuPanel.classList.add('is-open');

    if(menuStage){
      menuStage.classList.remove('is-closing');
      menuStage.classList.add('is-open');
    }

    menuPanel.style.pointerEvents = 'auto';
  }

  function finishMenuClose(){
    menuPanel.classList.remove('is-open');
    menuPanel.classList.remove('is-closing');
    menuPanel.style.pointerEvents = 'none';

    if(menuStage){
      menuStage.classList.remove('is-open');
      menuStage.classList.remove('is-closing');
    }

    accordions.forEach(function(accordion){
      accordion.classList.remove('is-open');
    });
  }

  function closeMenu(options){
    if(!menuPanel.classList.contains('is-open')){
      return;
    }

    var shouldCloseImmediately = Boolean(options && options.immediate) || !isMobile();

    if(menuCloseTimer){
      window.clearTimeout(menuCloseTimer);
      menuCloseTimer = null;
    }

    menuButton.classList.remove('is-open');
    menuPanel.style.pointerEvents = 'none';

    if(shouldCloseImmediately){
      finishMenuClose();
      return;
    }

    menuPanel.classList.add('is-closing');

    if(menuStage){
      menuStage.classList.add('is-closing');
      menuStage.classList.remove('is-open');
    }

    menuCloseTimer = window.setTimeout(function(){
      finishMenuClose();
      menuCloseTimer = null;
    }, 760);
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

  function closeMenuOnUserScroll(){
    if(menuPanel && menuPanel.classList.contains('is-open')){
      closeMenu({ immediate: !isMobile() });
    }
  }

  function getCurrentScrollTop(){
    return Math.max(
      window.pageYOffset || 0,
      document.documentElement.scrollTop || 0,
      document.body ? document.body.scrollTop || 0 : 0,
      page ? page.scrollTop || 0 : 0
    );
  }

  function handleScrollForMenuClose(){
    var currentScrollTop = getCurrentScrollTop();

    if(isMobile()){
      if(Math.abs(currentScrollTop - lastScrollTopForMenuClose) > 2){
        closeMenuOnUserScroll();
      }
    } else {
      closeMenuOnUserScroll();
    }

    lastScrollTopForMenuClose = currentScrollTop <= 0
      ? 0
      : currentScrollTop;
  }

  var lastScrollTopForMenuClose = 0;

  function setupMenuCloseOnScroll(){
    lastScrollTopForMenuClose = getCurrentScrollTop();

    window.addEventListener(
      'scroll',
      handleScrollForMenuClose,
      { passive:true, capture:true }
    );

    document.addEventListener(
      'scroll',
      handleScrollForMenuClose,
      { passive:true, capture:true }
    );

    if(page){
      page.addEventListener(
        'scroll',
        handleScrollForMenuClose,
        { passive:true }
      );
    }

    window.addEventListener(
      'wheel',
      function(event){
        if(isMobile() && menuPanel && menuPanel.contains(event.target)){
          return;
        }

        closeMenuOnUserScroll();
      },
      { passive:true, capture:true }
    );

    window.addEventListener(
      'touchstart',
      function(event){
        var touch = event.touches && event.touches[0];

        if(!touch){
          return;
        }

        touchStartY = touch.clientY;
        touchStartedInsideMenu = Boolean(
          menuPanel &&
          menuPanel.contains(event.target)
        );
      },
      { passive:true }
    );

    window.addEventListener(
      'touchmove',
      function(event){
        var touch = event.touches && event.touches[0];

        if(!isMobile() || !touch || touchStartY === null){
          return;
        }

        if(touchStartedInsideMenu){
          return;
        }

        if(Math.abs(touch.clientY - touchStartY) > 10){
          closeMenuOnUserScroll();
        }
      },
      { passive:true }
    );

    window.addEventListener(
      'touchend',
      function(){
        touchStartY = null;
        touchStartedInsideMenu = false;
      },
      { passive:true }
    );
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

  setupMenuCloseOnScroll();
})();
