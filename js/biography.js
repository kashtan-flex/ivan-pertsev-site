/*
==================================================
BIOGRAPHY JS

Версия: biography-js-001

ИЗМЕНЕНИЯ:
- добавлено масштабирование desktop-сцены 1440×800 по высоте
- добавлена автоматическая карусель Ken Burns + fade
- добавлена логика открытия и закрытия меню
- добавлена accordion-логика для пунктов «Проекты» и «Контакты»
- добавлена логика открытия popup из меню
==================================================
*/

(function(){
  'use strict';

  var DESIGN_WIDTH = 1440;
  var DESIGN_HEIGHT = 800;
  var SLIDE_INTERVAL = 6200;

  var stage = document.querySelector('.ip-biography-stage');
  var page = document.querySelector('[data-biography-page]');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.ip-biography-slide'));

  var menu = document.querySelector('[data-biography-menu]');
  var menuOpenButton = document.querySelector('[data-biography-menu-open]');
  var menuCloseButton = document.querySelector('[data-biography-menu-close]');
  var accordionButtons = Array.prototype.slice.call(document.querySelectorAll('[data-biography-accordion]'));

  var popup = document.querySelector('[data-ip-popup]');
  var popupOpenButtons = Array.prototype.slice.call(document.querySelectorAll('[data-biography-popup-open]'));
  var popupCloseButtons = Array.prototype.slice.call(document.querySelectorAll('[data-ip-popup-close]'));

  var currentSlideIndex = 0;
  var carouselTimer = null;

  function setScale(){
    if(!stage){
      return;
    }

    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;

    var scaleByHeight = viewportHeight / DESIGN_HEIGHT;
    var scaledWidth = DESIGN_WIDTH * scaleByHeight;

    if(scaledWidth < viewportWidth){
      scaleByHeight = viewportWidth / DESIGN_WIDTH;
    }

    document.documentElement.style.setProperty('--biography-scale', scaleByHeight.toFixed(5));
  }

  function startCarousel(){
    if(slides.length <= 1){
      return;
    }

    stopCarousel();

    carouselTimer = window.setInterval(function(){
      slides[currentSlideIndex].classList.remove('is-active');

      currentSlideIndex = currentSlideIndex + 1;

      if(currentSlideIndex >= slides.length){
        currentSlideIndex = 0;
      }

      slides[currentSlideIndex].classList.add('is-active');
    }, SLIDE_INTERVAL);
  }

  function stopCarousel(){
    if(carouselTimer){
      window.clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  function openMenu(){
    if(!menu){
      return;
    }

    menu.classList.add('is-open');
  }

  function closeMenu(){
    if(!menu){
      return;
    }

    menu.classList.remove('is-open');
  }

  function toggleAccordion(button){
    var group = button.closest('.ip-biography-menu-group');

    if(!group){
      return;
    }

    group.classList.toggle('is-open');
  }

  function openPopup(){
    if(!popup){
      return;
    }

    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('ip-popup-lock');
    document.body.classList.add('ip-popup-lock');

    closeMenu();
  }

  function closePopup(){
    if(!popup){
      return;
    }

    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('ip-popup-lock');
    document.body.classList.remove('ip-popup-lock');
  }

  function onKeydown(event){
    if(event.key === 'Escape'){
      closeMenu();
      closePopup();
    }
  }

  function bindEvents(){
    window.addEventListener('resize', setScale);
    window.addEventListener('orientationchange', setScale);
    document.addEventListener('keydown', onKeydown);

    if(menuOpenButton){
      menuOpenButton.addEventListener('click', openMenu);
    }

    if(menuCloseButton){
      menuCloseButton.addEventListener('click', closeMenu);
    }

    accordionButtons.forEach(function(button){
      button.addEventListener('click', function(){
        toggleAccordion(button);
      });
    });

    popupOpenButtons.forEach(function(button){
      button.addEventListener('click', openPopup);
    });

    popupCloseButtons.forEach(function(button){
      button.addEventListener('click', closePopup);
    });
  }

  function init(){
    if(!page){
      return;
    }

    setScale();
    bindEvents();
    startCarousel();
  }

  init();

})();