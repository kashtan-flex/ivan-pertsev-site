/*
==================================================
WEDDING JS

Версия: wedding-js-005

ИЗМЕНЕНИЯ:
- Kinescope iframe теперь полностью пересоздаётся при каждом входе на страницу
- видео принудительно стартует заново при обновлении страницы
- видео принудительно стартует заново при возврате на страницу после перехода
- poster продолжает скрывать служебный кадр загрузки
- сохранены desktop scaling, menu, accordion, popup, review popup и gallery logic
==================================================
*/

(function(){
  'use strict';

  var DESIGN = {
    desktop:{
      width:1440,
      heroHeight:800,
      pageHeight:1351
    },
    breakpoint:767
  };

  var VIDEO_REVEAL_DELAY = 3200;
  var VIDEO_RECREATE_DELAY = 80;

  var page = document.querySelector('[data-wedding-page]');
  var stage = document.querySelector('.ip-wedding-stage');

  var videoFrame = document.querySelector('[data-wedding-video-frame]');
  var videoWrap = videoFrame ? videoFrame.parentNode : null;

  var originalVideoSrc = videoFrame
    ? videoFrame.getAttribute('src')
    : '';

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

  var galleryButton = document.querySelector('[data-wedding-gallery-open]');
  var gallery = document.querySelector('[data-wedding-gallery]');

  var reviewPopup = document.querySelector('[data-review-popup]');
  var reviewPopupCard = document.querySelector('[data-review-popup-card]');

  var reviewCloseTriggers = Array.prototype.slice.call(
    document.querySelectorAll('[data-review-close]')
  );

  var reviewButtons = Array.prototype.slice.call(
    document.querySelectorAll('[data-review-open]')
  );

  var resizeFrame = null;
  var videoRevealTimer = null;
  var videoRecreateTimer = null;

  if(!page || !stage){
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

  function updateViewportHeightVariable(){
    var viewportHeight = getViewportHeight();

    document.documentElement.style.setProperty(
      '--wedding-vh',
      (viewportHeight * 0.01) + 'px'
    );

    return viewportHeight;
  }

  function updateScale(){
    var viewportWidth = window.innerWidth;
    var viewportHeight = updateViewportHeightVariable();

    var scale;
    var scaledPageHeight;

    if(isMobile()){
      scale = viewportWidth / DESIGN.desktop.width;

      scaledPageHeight = Math.ceil(
        DESIGN.desktop.pageHeight * scale
      );

      document.documentElement.style.setProperty(
        '--wedding-scale',
        scale.toFixed(5)
      );

      page.style.height = scaledPageHeight + 'px';
      page.style.minHeight = scaledPageHeight + 'px';

      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';

      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';

      document.documentElement.style.overflowY = 'auto';
      document.body.style.overflowY = 'auto';

      return;
    }

    scale = viewportHeight / DESIGN.desktop.heroHeight;

    document.documentElement.style.setProperty(
      '--wedding-scale',
      scale.toFixed(5)
    );

    scaledPageHeight = Math.ceil(
      DESIGN.desktop.pageHeight * scale
    );

    page.style.height = scaledPageHeight + 'px';
    page.style.minHeight = scaledPageHeight + 'px';

    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';

    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';

    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
  }

  function requestScaleUpdate(){
    if(resizeFrame){
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(updateScale);
  }

  function clearVideoTimers(){
    if(videoRevealTimer){
      window.clearTimeout(videoRevealTimer);
      videoRevealTimer = null;
    }

    if(videoRecreateTimer){
      window.clearTimeout(videoRecreateTimer);
      videoRecreateTimer = null;
    }
  }

  function buildFreshVideoSrc(){
    if(!originalVideoSrc){
      return '';
    }

    var separator = originalVideoSrc.indexOf('?') === -1
      ? '?'
      : '&';

    return originalVideoSrc + separator + 'start=0&restart=' + Date.now();
  }

  function createFreshVideoFrame(){
    var iframe = document.createElement('iframe');

    iframe.className = 'ip-wedding-video';
    iframe.setAttribute('data-wedding-video-frame', '');
    iframe.setAttribute('src', buildFreshVideoSrc());
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'eager');

    return iframe;
  }

  function revealVideo(){
    if(!page || page.classList.contains('is-video-ready')){
      return;
    }

    page.classList.add('is-video-ready');
  }

  function recreateWeddingVideo(){
    if(!videoWrap || !originalVideoSrc){
      return;
    }

    clearVideoTimers();

    page.classList.remove('is-video-ready');

    if(videoFrame && videoFrame.parentNode){
      videoFrame.setAttribute('src', 'about:blank');
      videoFrame.parentNode.removeChild(videoFrame);
    }

    videoFrame = null;

    videoRecreateTimer = window.setTimeout(function(){
      videoFrame = createFreshVideoFrame();
      videoWrap.appendChild(videoFrame);
    }, VIDEO_RECREATE_DELAY);

    videoRevealTimer = window.setTimeout(function(){
      revealVideo();
    }, VIDEO_REVEAL_DELAY);
  }

  function setupVideoPosterTransition(){
    recreateWeddingVideo();

    window.addEventListener('pageshow', function(){
      recreateWeddingVideo();
    });

    window.addEventListener('pagehide', function(){
      if(videoFrame){
        videoFrame.setAttribute('src', 'about:blank');
      }
    });

    document.addEventListener('visibilitychange', function(){
      if(document.visibilityState === 'visible'){
        recreateWeddingVideo();
      }
    });
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

  function openMainPopup(){
    if(!popup){
      return;
    }

    closeMenu();
    closeReviewPopup();

    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');

    document.documentElement.classList.add('ip-popup-lock');
    document.body.classList.add('ip-popup-lock');
  }

  function closeMainPopup(){
    if(!popup){
      return;
    }

    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');

    document.documentElement.classList.remove('ip-popup-lock');
    document.body.classList.remove('ip-popup-lock');

    updateScale();
  }

  function setupMainPopupTriggers(){
    popupOpenTriggers.forEach(function(trigger){
      trigger.addEventListener('click', function(event){
        event.preventDefault();
        event.stopPropagation();

        openMainPopup();
      });
    });

    popupCloseTriggers.forEach(function(trigger){
      trigger.addEventListener('click', function(event){
        event.preventDefault();

        closeMainPopup();
      });
    });
  }

  function getReviewOrigin(reviewButton){
    var rect = reviewButton.getBoundingClientRect();

    return {
      x:rect.left + rect.width / 2,
      y:rect.top + rect.height / 2
    };
  }

  function setReviewPopupOrigin(reviewButton){
    if(!reviewPopupCard){
      return;
    }

    var origin = getReviewOrigin(reviewButton);

    reviewPopupCard.style.transformOrigin =
      origin.x + 'px ' + origin.y + 'px';
  }

  function cloneReviewContent(reviewButton){
    if(!reviewPopupCard){
      return;
    }

    var clone = reviewButton.cloneNode(true);

    clone.removeAttribute('data-review-open');
    clone.setAttribute('type', 'button');
    clone.setAttribute('tabindex', '-1');

    reviewPopupCard.innerHTML = '';
    reviewPopupCard.appendChild(clone);
  }

  function openReviewPopup(reviewButton){
    if(!reviewPopup || !reviewPopupCard || !reviewButton){
      return;
    }

    closeMenu();
    closeMainPopup();

    cloneReviewContent(reviewButton);
    setReviewPopupOrigin(reviewButton);

    reviewPopup.classList.add('is-open');
    reviewPopup.setAttribute('aria-hidden', 'false');

    document.documentElement.classList.add('ip-popup-lock');
    document.body.classList.add('ip-popup-lock');
  }

  function closeReviewPopup(){
    if(!reviewPopup || !reviewPopupCard){
      return;
    }

    reviewPopup.classList.remove('is-open');
    reviewPopup.setAttribute('aria-hidden', 'true');

    window.setTimeout(function(){
      if(!reviewPopup.classList.contains('is-open')){
        reviewPopupCard.innerHTML = '';
      }
    }, 520);

    if(!popup || !popup.classList.contains('is-open')){
      document.documentElement.classList.remove('ip-popup-lock');
      document.body.classList.remove('ip-popup-lock');
    }

    updateScale();
  }

  function setupReviewPopupTriggers(){
    reviewButtons.forEach(function(reviewButton){
      reviewButton.addEventListener('click', function(event){
        event.preventDefault();
        event.stopPropagation();

        openReviewPopup(reviewButton);
      });
    });

    reviewCloseTriggers.forEach(function(trigger){
      trigger.addEventListener('click', function(event){
        event.preventDefault();

        closeReviewPopup();
      });
    });
  }

  function toggleGallery(event){
    if(event){
      event.preventDefault();
    }

    if(!gallery || !galleryButton){
      return;
    }

    gallery.classList.toggle('is-visible');

    if(gallery.classList.contains('is-visible')){
      gallery.setAttribute('aria-hidden', 'false');
      galleryButton.textContent = 'Скрыть фото';
      return;
    }

    gallery.setAttribute('aria-hidden', 'true');
    galleryButton.textContent = 'Смотреть фото';
  }

  function setupGalleryTrigger(){
    if(!galleryButton){
      return;
    }

    galleryButton.addEventListener('click', toggleGallery);
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
        if(menuPanel && menuPanel.contains(event.target)){
          return;
        }

        closeMenuOnUserScroll();
      },
      { passive:true }
    );
  }

  function bindKeyboard(){
    document.addEventListener('keydown', function(event){
      if(event.key !== 'Escape'){
        return;
      }

      closeReviewPopup();
      closeMainPopup();
      closeMenu();
    });
  }

  function bindEvents(){
    window.addEventListener(
      'resize',
      requestScaleUpdate,
      { passive:true }
    );

    window.addEventListener(
      'orientationchange',
      function(){
        window.setTimeout(updateScale, 250);
      },
      { passive:true }
    );

    if(window.visualViewport){
      window.visualViewport.addEventListener(
        'resize',
        requestScaleUpdate,
        { passive:true }
      );
    }

    if(menuButton){
      menuButton.addEventListener('click', toggleMenu);
    }

    accordions.forEach(setupAccordion);

    setupVideoPosterTransition();
    setupMainPopupTriggers();
    setupReviewPopupTriggers();
    setupGalleryTrigger();
    setupMenuCloseOnScroll();
    setupDateMask();
    bindKeyboard();
  }

  function init(){
    updateScale();
    bindEvents();
  }

  init();

})();