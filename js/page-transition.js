/*
==================================================
PAGE TRANSITION JS

Версия: page-transition-005

ИЗМЕНЕНИЯ:
- переход через чёрный экран ускорен
- время затемнения уменьшено до 280ms
- время проявления уменьшено до 380ms
- ожидание ассетов уменьшено до 420ms
- сохранена стабильность перехода между страницами
- меню не изменялось
==================================================
*/

(function(){
  'use strict';

  var EXIT_DURATION = 280;
  var ENTER_DURATION = 380;
  var MAX_ASSET_WAIT = 420;

  var overlay = null;
  var isTransitioning = false;

  function getOverlay(){
    overlay = document.querySelector('.ip-page-transition');

    if(overlay){
      return overlay;
    }

    overlay = document.createElement('div');
    overlay.className = 'ip-page-transition is-enter';
    document.body.appendChild(overlay);

    return overlay;
  }

  function waitForImages(){
    var images = Array.prototype.slice.call(document.images || []);

    if(!images.length){
      return Promise.resolve();
    }

    var imagePromises = images.map(function(image){
      if(image.complete){
        return Promise.resolve();
      }

      return new Promise(function(resolve){
        image.addEventListener('load', resolve, { once:true });
        image.addEventListener('error', resolve, { once:true });
      });
    });

    var timeoutPromise = new Promise(function(resolve){
      window.setTimeout(resolve, MAX_ASSET_WAIT);
    });

    return Promise.race([
      Promise.all(imagePromises),
      timeoutPromise
    ]);
  }

  function waitForFonts(){
    if(document.fonts && document.fonts.ready){
      return document.fonts.ready.catch(function(){
        return null;
      });
    }

    return Promise.resolve();
  }

  function revealPage(){
    var transitionOverlay = getOverlay();

    Promise.all([
      waitForImages(),
      waitForFonts()
    ]).then(function(){
      window.requestAnimationFrame(function(){
        window.requestAnimationFrame(function(){
          transitionOverlay.classList.add('is-ready');

          window.setTimeout(function(){
            transitionOverlay.classList.remove('is-enter');
            transitionOverlay.classList.remove('is-ready');
          }, ENTER_DURATION);
        });
      });
    });
  }

  function isModifiedClick(event){
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
  }

  function isSamePage(url){
    return window.location.href.split('#')[0] === url.split('#')[0];
  }

  function shouldSkipLink(link){
    if(!link){
      return true;
    }

    var href = link.getAttribute('href');

    if(!href){
      return true;
    }

    if(href === '#'){
      return true;
    }

    if(href.indexOf('tel:') === 0){
      return true;
    }

    if(href.indexOf('mailto:') === 0){
      return true;
    }

    if(link.hasAttribute('target')){
      return true;
    }

    if(link.hasAttribute('data-popup-open')){
      return true;
    }

    if(href.indexOf('.html') === -1){
      return true;
    }

    return false;
  }

  function goToPage(url){
    if(isTransitioning || isSamePage(url)){
      return;
    }

    isTransitioning = true;

    var transitionOverlay = getOverlay();

    transitionOverlay.classList.remove('is-enter');
    transitionOverlay.classList.remove('is-ready');

    window.requestAnimationFrame(function(){
      transitionOverlay.classList.add('is-active');
    });

    window.setTimeout(function(){
      window.location.href = url;
    }, EXIT_DURATION);
  }

  function bindLinks(){
    document.addEventListener('click', function(event){
      var link = event.target.closest('a');

      if(isModifiedClick(event) || shouldSkipLink(link)){
        return;
      }

      event.preventDefault();
      goToPage(link.href);
    }, true);
  }

  function init(){
    getOverlay();
    bindLinks();
    revealPage();
  }

  init();

})();