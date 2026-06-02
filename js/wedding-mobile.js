/*
==================================================
WEDDING MOBILE JS

Версия: wedding-mobile-js-004-video-poster-delay

ИЗМЕНЕНИЯ:
- увеличено время отображения poster-обложки перед показом Kinescope iframe
- по видео проверки загрузочный экран плеера виден примерно 0.28–0.30 секунды
- добавлен запас по времени: poster скрывается позже, чтобы перекрыть загрузочный экран
- сохранена mobile-логика «Биографии»: scale, scroll, menu, accordion, popup, date mask и scroll-top
- desktop-логика Wedding не затрагивается
==================================================
*/

(function(){
  'use strict';

  var DESIGN = {
    mobile:{
      width:390,
      height:700,
      stageHeight:4100
    },
    breakpoint:767
  };

  var SCROLLTOP_REVEAL_OFFSET = 140;
  var VIDEO_POSTER_FALLBACK_DELAY = 2800;
  var VIDEO_POSTER_LOAD_DELAY = 2200;

  var page = document.querySelector('[data-wedding-mobile-page]');
  var stage = document.querySelector('.ip-wedding-mobile-content');

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

  var galleryButton = document.querySelector('[data-wedding-mobile-gallery-open]');
  var gallery = document.querySelector('[data-wedding-mobile-gallery]');

  var scrollTopButton = document.querySelector('.ip-wedding-mobile-scrolltop');

  var videoFrame = document.querySelector('[data-wedding-mobile-video-frame]');
  var videoPoster = document.querySelector('[data-wedding-mobile-video-poster]');

  var resizeFrame = null;
  var touchStartY = null;
  var touchStartedInsideMenu = false;
  var videoPosterHidden = false;

  if(!page || !stage){
    return;
  }

  function isMobile(){
    return window.innerWidth <= DESIGN.breakpoint;
  }

  function getViewportHeight(){
    if(
      window.visualViewport &&
      window.visualViewport.height
    ){
      return window.visualViewport.height;
    }

    return window.innerHeight;
  }

  function updateViewportHeightVariable(){
    var viewportHeight = getViewportHeight();

    document.documentElement.style.setProperty(
      '--wedding-vh',
      (viewportHeight * 0.01) + 'px'
    );

    document.documentElement.style.setProperty(
      '--wedding-mobile-vh',
      (viewportHeight * 0.01) + 'px'
    );

    return viewportHeight;
  }

  function updateScrollTopVisibility(){
    if(!scrollTopButton){
      return;
    }

    if(!isMobile()){
      scrollTopButton.classList.remove('is-visible');
      return;
    }

    var scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    var viewportHeight = getViewportHeight();

    var pageHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );

    var distanceToBottom = pageHeight - (scrollTop + viewportHeight);

    if(distanceToBottom <= SCROLLTOP_REVEAL_OFFSET){
      scrollTopButton.classList.add('is-visible');
      return;
    }

    scrollTopButton.classList.remove('is-visible');
  }

  function updateScale(){
    var viewportWidth = window.innerWidth;
    var viewportHeight = updateViewportHeightVariable();

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
        '--wedding-mobile-scale',
        scale.toFixed(5)
      );

      document.documentElement.style.setProperty(
        '--wedding-mobile-page-height',
        scaledHeight + 'px'
      );

      page.style.height = '';
      page.style.minHeight = '';

      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';

      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';

      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';

      updateScrollTopVisibility();

      return;
    }

    document.documentElement.style.removeProperty(
      '--wedding-mobile-scale'
    );

    document.documentElement.style.removeProperty(
      '--wedding-mobile-page-height'
    );

    page.style.height = '';
    page.style.minHeight = '';

    document.documentElement.style.height = '';
    document.body.style.height = '';

    document.documentElement.style.overflowX = '';
    document.body.style.overflowX = '';

    document.documentElement.style.overflowY = '';
    document.body.style.overflowY = '';

    updateScrollTopVisibility();
  }

  function requestScaleUpdate(){
    if(resizeFrame){
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(updateScale);
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

  function scrollToGallery(event){
    if(event){
      event.preventDefault();
      event.stopPropagation();
    }

    if(!gallery){
      return;
    }

    var targetTop =
      gallery.getBoundingClientRect().top +
      (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        0
      ) -
      24;

    window.scrollTo({
      top:targetTop,
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

        updateScrollTopVisibility();
      },
      { passive:true }
    );

    window.addEventListener(
      'wheel',
      function(event){
        if(menuPanel && menuPanel.contains(event.target)){
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

  function hideVideoPoster(){
    if(!videoPoster || videoPosterHidden){
      return;
    }

    videoPosterHidden = true;
    videoPoster.classList.add('is-hidden');
  }

  function setupVideoPoster(){
    if(!videoFrame || !videoPoster){
      return;
    }

    videoFrame.addEventListener('load', function(){
      window.setTimeout(hideVideoPoster, VIDEO_POSTER_LOAD_DELAY);
    });

    window.setTimeout(hideVideoPoster, VIDEO_POSTER_FALLBACK_DELAY);
  }

  function bindEvents(){
    window.addEventListener('resize', requestScaleUpdate);

    window.addEventListener('orientationchange', function(){
      window.setTimeout(updateScale, 250);
    });

    if(window.visualViewport){
      window.visualViewport.addEventListener(
        'resize',
        requestScaleUpdate
      );
    }

    if(menuButton){
      menuButton.addEventListener('click', toggleMenu);
    }

    accordions.forEach(setupAccordion);

    setupPopupTriggers();
    setupMenuCloseOnScroll();
    setupDateMask();
    setupVideoPoster();

    if(galleryButton){
      galleryButton.addEventListener('click', scrollToGallery);
    }

    if(scrollTopButton){
      scrollTopButton.addEventListener('click', scrollToTop);
    }
  }

  function init(){
    updateScale();
    bindEvents();
    updateScrollTopVisibility();
  }

  init();

})();