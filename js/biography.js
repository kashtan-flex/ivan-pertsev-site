/*
==================================================
BIOGRAPHY JS

Версия: biography-js-003

ИЗМЕНЕНИЯ:
- масштабирование страницы «Биография» приведено к логике главной страницы
- desktop-сцена 1440×800 теперь масштабируется только по высоте viewportHeight / 800
- убрана подгонка по ширине, из-за которой страница обрезалась сверху и снизу
- сохранена автоматическая карусель Ken Burns + fade
- сохранена логика общего меню как на главной странице
- сохранена accordion-логика
- сохранена popup-логика через data-popup-open="main"
==================================================
*/

(function(){
  'use strict';

  var DESIGN_HEIGHT = 800;
  var SLIDE_INTERVAL = 6200;

  var stage = document.querySelector('.ip-biography-stage');
  var page = document.querySelector('[data-biography-page]');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.ip-biography-slide'));

  var menuToggle = document.querySelector('.ip-menu-toggle');
  var menuPanel = document.querySelector('.ip-menu-panel');
  var accordions = Array.prototype.slice.call(document.querySelectorAll('.ip-accordion'));

  var popupOpenLinks = Array.prototype.slice.call(document.querySelectorAll('[data-popup-open]'));
  var popupCloseButtons = Array.prototype.slice.call(document.querySelectorAll('[data-popup-close]'));
  var popups = Array.prototype.slice.call(document.querySelectorAll('[data-popup]'));

  var currentSlideIndex = 0;
  var carouselTimer = null;

  function setScale(){
    if(!stage){
      return;
    }

    var viewportHeight = window.innerHeight;
    var scale = viewportHeight / DESIGN_HEIGHT;

    document.documentElement.style.setProperty('--biography-scale', scale.toFixed(5));
  }

  function startCarousel(){
    if(slides.length <= 1){
      return;
    }

    stopCarousel();

    carouselTimer = window.setInterval(function(){
      slides[currentSlideIndex].classList.remove('is-active');

      currentSlideIndex += 1;

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
    if(!menuToggle || !menuPanel){
      return;
    }

    menuToggle.classList.add('is-open');
    menuPanel.classList.add('is-open');
  }

  function closeMenu(){
    if(!menuToggle || !menuPanel){
      return;
    }

    menuToggle.classList.remove('is-open');
    menuPanel.classList.remove('is-open');

    accordions.forEach(function(accordion){
      accordion.classList.remove('is-open');
    });
  }

  function toggleMenu(){
    if(!menuPanel){
      return;
    }

    if(menuPanel.classList.contains('is-open')){
      closeMenu();
      return;
    }

    openMenu();
  }

  function toggleAccordion(accordion){
    accordion.classList.toggle('is-open');
  }

  function openPopup(name){
    var targetPopup = document.querySelector('[data-popup="' + name + '"]');

    if(!targetPopup){
      return;
    }

    targetPopup.classList.add('is-open');
    targetPopup.setAttribute('aria-hidden', 'false');

    document.documentElement.classList.add('ip-popup-lock');
    document.body.classList.add('ip-popup-lock');

    closeMenu();
  }

  function closePopup(popup){
    if(!popup){
      return;
    }

    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');

    document.documentElement.classList.remove('ip-popup-lock');
    document.body.classList.remove('ip-popup-lock');
  }

  function closeAllPopups(){
    popups.forEach(function(popup){
      closePopup(popup);
    });
  }

  function onKeydown(event){
    if(event.key === 'Escape'){
      closeMenu();
      closeAllPopups();
    }
  }

  function bindEvents(){
    window.addEventListener('resize', setScale);
    window.addEventListener('orientationchange', setScale);
    document.addEventListener('keydown', onKeydown);

    if(menuToggle){
      menuToggle.addEventListener('click', toggleMenu);
    }

    accordions.forEach(function(accordion){
      var button = accordion.querySelector('.ip-accordion-button');

      if(!button){
        return;
      }

      button.addEventListener('click', function(){
        toggleAccordion(accordion);
      });
    });

    popupOpenLinks.forEach(function(link){
      link.addEventListener('click', function(event){
        event.preventDefault();
        openPopup(link.getAttribute('data-popup-open'));
      });
    });

    popupCloseButtons.forEach(function(button){
      button.addEventListener('click', function(){
        var popup = button.closest('[data-popup]');
        closePopup(popup);
      });
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