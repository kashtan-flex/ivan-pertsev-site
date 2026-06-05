/*
==================================================
LEGAL JS

Версия: legal-js-006-policy-menu-scroll-intent-sync

ИЗМЕНЕНИЯ:
- создан JS для текстовых правовых страниц проекта
- сохранена логика меню, аккордеонов, popup и маски даты по approved-страницам
- добавлена обработка data-popup-open="main" для пунктов «Другое», «Написать» и popup-триггеров
- добавлена работа стрелки наверх
- desktop burger/menu выносится в отдельный fixed-слой вне transform-контейнера страницы
- fixed-layer используется совместно с legal-css-011, где сохранены ширина и типографика эталонного меню
- при возврате в mobile меню возвращается в исходное место разметки
- строка «Сайт ИванПерцев.рф / ivanpercev.rf» автоматически превращается в кликабельную ссылку
- меню закрывается не только по фактическому scroll, но и по wheel/touchmove в capture-режиме
- сохранён desktop fixed-layer для burger/menu вне transform-контейнера страницы
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
  var menuLayer = null;
  var menuButtonOriginalParent = menuButton ? menuButton.parentNode : null;
  var menuButtonOriginalNext = menuButton ? menuButton.nextSibling : null;
  var menuPanelOriginalParent = menuPanel ? menuPanel.parentNode : null;
  var menuPanelOriginalNext = menuPanel ? menuPanel.nextSibling : null;

  var DESIGN = {
    desktop:{ width:1440 },
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

  function getMenuLayer(){
    if(menuLayer && menuLayer.parentNode){
      return menuLayer;
    }

    menuLayer = document.querySelector('.ip-policy-menu-layer');

    if(menuLayer){
      return menuLayer;
    }

    menuLayer = document.createElement('div');
    menuLayer.className = 'ip-policy-menu-layer';
    menuLayer.setAttribute('aria-hidden', 'false');
    document.body.appendChild(menuLayer);

    return menuLayer;
  }

  function insertBeforeOriginal(parent, node, nextSibling){
    if(!parent || !node){
      return;
    }

    if(nextSibling && nextSibling.parentNode === parent){
      parent.insertBefore(node, nextSibling);
      return;
    }

    parent.appendChild(node);
  }

  function syncMenuFixedLayer(){
    if(isMobile()){
      insertBeforeOriginal(menuButtonOriginalParent, menuButton, menuButtonOriginalNext);
      insertBeforeOriginal(menuPanelOriginalParent, menuPanel, menuPanelOriginalNext);

      if(menuLayer){
        menuLayer.style.display = 'none';
      }

      return;
    }

    var layer = getMenuLayer();
    layer.style.display = 'block';

    if(menuButton.parentNode !== layer){
      layer.appendChild(menuButton);
    }

    if(menuPanel.parentNode !== layer){
      layer.appendChild(menuPanel);
    }
  }

  function setupLegalSiteLinks(){
    var meta = document.querySelector('.ip-legal-meta');

    if(!meta){
      return;
    }

    var targets = Array.prototype.slice.call(meta.querySelectorAll('.ip-legal-site, p, span, div'));

    if(meta.textContent && /иван\s*перцев\.рф|ivan\s*percev\.rf/i.test(meta.textContent)){
      targets.push(meta);
    }

    targets.forEach(function(target){
      if(!target || target.querySelector('a')){
        return;
      }

      var html = target.innerHTML;

      if(!/иван\s*перцев\.рф|ivan\s*percev\.rf/i.test(html)){
        return;
      }

      target.innerHTML = html.replace(/(Иван\s*Перцев\.рф|иван\s*перцев\.рф|ivan\s*percev\.rf)/ig, function(match){
        return '<a href="https://ivanpercev.rf/" target="_blank" rel="noopener noreferrer">' + match + '</a>';
      });
    });
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

    syncMenuFixedLayer();

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

  function closeMenuOnScrollIntent(){
    if(menuPanel.classList.contains('is-open')){
      closeMenu();
    }
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

  setupLegalSiteLinks();
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

  window.addEventListener('scroll', closeMenuOnScrollIntent, { passive:true });
  window.addEventListener('wheel', closeMenuOnScrollIntent, { passive:true, capture:true });
  window.addEventListener('touchmove', closeMenuOnScrollIntent, { passive:true, capture:true });
})();