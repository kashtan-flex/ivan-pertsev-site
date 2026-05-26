/*
==================================================
PAGE TRANSITION JS

Версия: page-transition-001

ИЗМЕНЕНИЯ:
- добавлен cinematic fade переход между локальными страницами
- переход работает для ссылок на .html
- внешние ссылки, телефон и popup-триггеры не перехватываются
==================================================
*/

(function(){
  'use strict';

  var TRANSITION_DURATION = 760;

  function createOverlay(){
    var overlay = document.querySelector('.ip-page-transition');

    if(overlay){
      return overlay;
    }

    overlay = document.createElement('div');
    overlay.className = 'ip-page-transition is-enter';

    document.body.appendChild(overlay);

    window.requestAnimationFrame(function(){
      overlay.classList.add('is-ready');

      window.setTimeout(function(){
        overlay.classList.remove('is-enter');
        overlay.classList.remove('is-ready');
      }, TRANSITION_DURATION);
    });

    return overlay;
  }

  function isModifiedClick(event){
    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
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
    var overlay = createOverlay();

    overlay.classList.remove('is-enter');
    overlay.classList.remove('is-ready');

    window.requestAnimationFrame(function(){
      overlay.classList.add('is-active');
    });

    window.setTimeout(function(){
      window.location.href = url;
    }, TRANSITION_DURATION);
  }

  function bindLinks(){
    document.addEventListener('click', function(event){
      var link = event.target.closest('a');

      if(isModifiedClick(event) || shouldSkipLink(link)){
        return;
      }

      event.preventDefault();

      goToPage(link.href);
    });
  }

  function init(){
    createOverlay();
    bindLinks();
  }

  init();

})();