/*
==================================================
BIOGRAPHY JS

Версия: biography-js-010

ИЗМЕНЕНИЯ:
- исправлена работа mobile-меню после агрессивного close-on-scroll
- клик по крестику больше не перезапускает меню
- accordion снова открывается по тапу
- ссылки меню снова работают корректно
- меню закрывается только при реальном scroll/wheel/свайпе страницы
- клики внутри меню не считаются scroll-жестом
- сохранена carousel-система
- сохранена popup-система
- сохранена кнопка scroll-to-top
==================================================
*/

(function(){
  'use strict';

  var DESIGN = {
    desktop:{
      width:1440,
      height:800
    },
    mobile:{
      width:390,
      height:700,
      stageHeight:1760
    },
    breakpoint:767
  };

  var SLIDE_INTERVAL = 6200;

  var page = document.querySelector('[data-biography-page]');
  var stage = document.querySelector('.ip-biography-stage');

  var menuButton = document.querySelector('.ip-menu-toggle');
  var menuPanel = document.querySelector('.ip-menu-panel');

  var accordions = Array.prototype.slice.call(
    document.querySelectorAll('.ip-accordion')
  );

  var popup = document.querySelector('[data-popup="main"]');

  var popupOpenTriggers = Array.prototype.slice.call(
    document.querySelectorAll('[data-popup-open]')
  );

  var popupCloseTriggers = Array.prototype.slice.call(
    document.querySelectorAll('[data-popup-close]')
  );

  var scrollTopButton = document.querySelector('.ip-biography-scrolltop');

  var slides = Array.prototype.slice.call(
    document.querySelectorAll('.ip-biography-slide')
  );

  var currentSlideIndex = 0;
  var carouselTimer = null;
  var resizeFrame = null;

  var touchStartY = null;
  var touchStartedInsideMenu = false;

  if(!page || !stage){
    return;
  }

  function isMobile(){
    return window.innerWidth <= DESIGN.breakpoint;
  }

  function updateScale(){
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var scale;
    var scaledHeight;

    if(isMobile()){
      scale = Math.max(
        viewportWidth / DESIGN.mobile.width,
        viewportHeight / DESIGN.mobile.height
      );

      scaledHeight = Math.ceil(
        DESIGN.mobile.stageHeight * scale
      );

      document.documentElement.style.setProperty(
        '--biography-mobile-scale',
        scale.toFixed(5)
      );

      document.documentElement.style.setProperty(
        '--biography-mobile-page-height',
        scaledHeight + 'px'
      );

      document.documentElement.style.removeProperty(
        '--biography-scale'
      );

      page.style.height = '';
      page.style.minHeight = '';

      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';

      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';

      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';

      return;
    }

    scale = viewportHeight / DESIGN.desktop.height;

    document.documentElement.style.setProperty(
      '--biography-scale',
      scale.toFixed(5)
    );

    document.documentElement.style.removeProperty(
      '--biography-mobile-scale'
    );

    document.documentElement.style.removeProperty(
      '--biography-mobile-page-height'
    );

    page.style.height = '';
    page.style.minHeight = '';

    document.documentElement.style.height = '';
    document.body.style.height = '';

    document.documentElement.style.overflowX = '';
    document.body.style.overflowX = '';

    document.documentElement.style.overflowY = '';
    document.body.style.overflowY = '';
  }

  function requestScaleUpdate(){
    if(resizeFrame){
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(updateScale);
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
    if(!menuButton || !menuPanel){
      return;
    }

    menuButton.classList.add('is-open');
    menuPanel.classList.add('is-open');
    menuPanel.style.pointerEvents = 'auto';
  }

  function closeMenu(){
    if(!menuButton || !menuPanel){
      return;
    }

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

    if(!menuPanel){
      return;
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

    updateScale();
  }

  function scrollToTop(){
    window.scrollTo({
      top:0,
      behavior:'smooth'
    });
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
  }

  function closeMenuOnUserScroll(){
    if(menuPanel && menuPanel.classList.contains('is-open')){
      closeMenu();
    }
  }

  function setupMenuCloseOnScroll(){
    var lastScrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    window.addEventListener(
      'scroll',
      function(){
        var currentScrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          0;

        if(Math.abs(currentScrollTop - lastScrollTop) > 2){
          closeMenuOnUserScroll();
        }

        lastScrollTop = currentScrollTop <= 0
          ? 0
          : currentScrollTop;
      },
      { passive:true }
    );

    window.addEventListener(
      'wheel',
      function(event){
        if(
          menuPanel &&
          menuPanel.contains(event.target)
        ){
          return;
        }

        closeMenuOnUserScroll();
      },
      { passive:true }
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

        if(!touch || touchStartY === null){
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

  function bindEvents(){
    window.addEventListener('resize', requestScaleUpdate);

    window.addEventListener('orientationchange', function(){
      window.setTimeout(updateScale, 250);
    });

    if(menuButton){
      menuButton.addEventListener('click', toggleMenu);
    }

    accordions.forEach(setupAccordion);

    setupPopupTriggers();
    setupMenuCloseOnScroll();
    setupDateMask();

    if(scrollTopButton){
      scrollTopButton.addEventListener('click', scrollToTop);
    }
  }

  function init(){
    updateScale();
    bindEvents();
    startCarousel();
  }

  init();

})();