/*
==================================================
PAGE TRANSITION JS

Версия: page-transition-003

ИЗМЕНЕНИЯ:
- переход переделан в короткий монтажный dip to black
- затемнение перед уходом ускорено до 340ms
- проявление новой страницы сделано мягче через enter-state
- исправлена стабильность перехода с главной на биографию и обратно
- внешние ссылки, телефон и popup-триггеры не перехватываются
- меню не изменялось
==================================================
*/

(function(){
  'use strict';

  var EXIT_DURATION = 360;
  var ENTER_DURATION = 480;
  var overlay = null;
  var isTransitioning = false;

  function createOverlay(){
    overlay = document.querySelector('.ip-page-transition');

    if(overlay){
      return overlay;
    }

    overlay = document.createElement('div');
    overlay.className = 'ip-page-transition is-enter';
    document.body.appendChild(overlay);

    window.requestAnimationFrame(function(){
      window.requestAnimationFrame(function(){
        overlay.classList.add('is-ready');

        window.setTimeout(function(){
          overlay.classList.remove('is-enter');
          overlay.classList.remove('is-ready');
        }, ENTER_DURATION);
      });
    });

    return overlay;
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

    var transitionOverlay = createOverlay();

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
    createOverlay();
    bindLinks();
  }

  init();

})();