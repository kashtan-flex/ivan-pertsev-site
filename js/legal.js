/*
==================================================
LEGAL JS

Версия: legal-js-014-policy-burger-body-lock-accordion-align

ИЗМЕНЕНИЯ:
- создан JS для текстовых правовых страниц проекта
- сохранена логика меню, аккордеонов, popup и маски даты по approved-страницам
- добавлена обработка data-popup-open="main" для пунктов «Другое», «Написать» и popup-триггеров
- добавлена работа стрелки наверх
- desktop масштабирование страницы политики переведено на approved-логику fixed-stage: min(width/1440, height/800)
- desktop burger/menu переносятся в fixed stage 1440×800 по логике approved-страниц
- фон меню теперь управляется pseudo-слоями fixed-stage через класс is-open
- высота fixed-stage синхронизируется с фактической высотой viewport
- закрытие меню при scroll/wheel/touchmove сохранено как на approved-страницах
- desktop burger/cross вынесен в отдельный fixed viewport-layer вне transform-stage, чтобы не скроллился вместе со страницей
- panel/menu-stage и фон меню оставлены в approved fixed-stage логике
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
  var menuStage = null;
  var menuButtonLayer = null;
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

  function getDesktopMenuScale(){
    var viewportWidth = window.innerWidth;
    var viewportHeight = getViewportHeight();

    return Math.min(
      viewportWidth / DESIGN.desktop.width,
      viewportHeight / DESIGN.desktop.height
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

  function getMenuButtonLayer(){
    if(menuButtonLayer && menuButtonLayer.parentNode){
      return menuButtonLayer;
    }

    menuButtonLayer = document.querySelector('.ip-policy-menu-button-layer');

    if(menuButtonLayer){
      return menuButtonLayer;
    }

    menuButtonLayer = document.createElement('div');
    menuButtonLayer.className = 'ip-policy-menu-button-layer';
    menuButtonLayer.setAttribute('aria-hidden', 'false');
    document.body.appendChild(menuButtonLayer);

    return menuButtonLayer;
  }

  function updateMenuButtonViewportPosition(scale){
    var viewportWidth = window.innerWidth;
    var viewportHeight = getViewportHeight();
    var stageWidth = DESIGN.desktop.width * scale;
    var stageHeight = DESIGN.desktop.height * scale;
    var stageLeft = (viewportWidth - stageWidth) / 2;
    var stageTop = (viewportHeight - stageHeight) / 2;
    var buttonTop = stageTop + (60 * scale);
    var buttonRight = Math.max(0, stageLeft + (100 * scale));

    document.documentElement.style.setProperty('--ip-policy-menu-button-top', buttonTop.toFixed(3) + 'px');
    document.documentElement.style.setProperty('--ip-policy-menu-button-right', buttonRight.toFixed(3) + 'px');
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

      if(menuButtonLayer){
        menuButtonLayer.style.display = 'none';
      }

      document.documentElement.style.removeProperty('--ip-policy-menu-stage-scale');
      document.documentElement.style.removeProperty('--ip-policy-menu-stage-height');
      document.documentElement.style.removeProperty('--ip-policy-menu-button-top');
      document.documentElement.style.removeProperty('--ip-policy-menu-button-right');
      return;
    }

    var stage = getMenuStage();
    var buttonLayer = getMenuButtonLayer();
    var scale = getDesktopMenuScale();
    var stageHeight = Math.max(DESIGN.desktop.height, Math.ceil(getViewportHeight() / scale));

    stage.style.display = 'block';
    buttonLayer.style.display = 'block';

    document.documentElement.style.setProperty('--ip-policy-menu-stage-scale', scale.toFixed(5));
    document.documentElement.style.setProperty('--ip-policy-menu-stage-height', stageHeight + 'px');
    updateMenuButtonViewportPosition(scale);

    if(menuButton.parentNode !== buttonLayer){
      buttonLayer.appendChild(menuButton);
    }

    if(menuPanel.parentNode !== stage){
      stage.appendChild(menuPanel);
    }
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
      scale = getDesktopMenuScale();

      document.documentElement.style.setProperty('--ip-policy-desktop-scale', scale.toFixed(5));
      document.documentElement.style.removeProperty('--ip-policy-mobile-scale');
    }

    syncPolicyMenuStage();

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

    if(menuStage){
      menuStage.classList.add('is-open');
    }

    menuPanel.style.pointerEvents = 'auto';
  }

  function closeMenu(){
    menuButton.classList.remove('is-open');
    menuPanel.classList.remove('is-open');

    if(menuStage){
      menuStage.classList.remove('is-open');
    }

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