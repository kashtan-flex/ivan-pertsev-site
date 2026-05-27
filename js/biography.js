/*
==================================================
BIOGRAPHY JS

Версия: biography-js-005

ИЗМЕНЕНИЯ:
- исправлен mobile scroll страницы «Биография»
- mobile-высота страницы теперь учитывает scale и полную высоту stage
- кнопка scroll-to-top прокручивает страницу наверх
- desktop-логика масштабирования сохранена
- сохранена carousel-система
- сохранена popup-система
- сохранена menu-система
==================================================
*/

(function(){
  'use strict';

  var DESKTOP_HEIGHT = 800;

  var MOBILE_WIDTH = 390;
  var MOBILE_HEIGHT = 700;
  var MOBILE_STAGE_HEIGHT = 1760;

  var MOBILE_BREAKPOINT = 767;

  var SLIDE_INTERVAL = 6200;

  var stage = document.querySelector('.ip-biography-stage');
  var page = document.querySelector('[data-biography-page]');

  var slides = Array.prototype.slice.call(
    document.querySelectorAll('.ip-biography-slide')
  );

  var menuToggle = document.querySelector('.ip-menu-toggle');
  var menuPanel = document.querySelector('.ip-menu-panel');

  var accordions = Array.prototype.slice.call(
    document.querySelectorAll('.ip-accordion')
  );

  var popupOpenLinks = Array.prototype.slice.call(
    document.querySelectorAll('[data-popup-open]')
  );

  var popupCloseButtons = Array.prototype.slice.call(
    document.querySelectorAll('[data-popup-close]')
  );

  var popups = Array.prototype.slice.call(
    document.querySelectorAll('[data-popup]')
  );

  var scrollTopButton = document.querySelector('.ip-biography-scrolltop');

  var currentSlideIndex = 0;
  var carouselTimer = null;

  function isMobile(){
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function setDesktopScale(){
    var viewportHeight = window.innerHeight;
    var scale = viewportHeight / DESKTOP_HEIGHT;

    document.documentElement.style.setProperty(
      '--biography-scale',
      scale.toFixed(5)
    );

    document.documentElement.style.removeProperty(
      '--biography-mobile-scale'
    );

    if(page){
      page.style.height = '';
      page.style.minHeight = '';
    }
  }

  function setMobileScale(){
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;

    var scaleX = viewportWidth / MOBILE_WIDTH;
    var scaleY = viewportHeight / MOBILE_HEIGHT;
    var scale = Math.max(scaleX, scaleY);

    var scaledPageHeight = Math.ceil(MOBILE_STAGE_HEIGHT * scale);

    document.documentElement.style.setProperty(
      '--biography-mobile-scale',
      scale.toFixed(5)
    );

    document.documentElement.style.removeProperty(
      '--biography-scale'
    );

    if(page){
      page.style.height = scaledPageHeight + 'px';
      page.style.minHeight = scaledPageHeight + 'px';
    }
  }

  function setScale(){
    if(!stage){
      return;
    }

    if(isMobile()){
      setMobileScale();
      return;
    }

    setDesktopScale();
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

  function scrollToTop(){
    window.scrollTo({
      top:0,
      behavior:'smooth'
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

    if(scrollTopButton){
      scrollTopButton.addEventListener('click', scrollToTop);
    }
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