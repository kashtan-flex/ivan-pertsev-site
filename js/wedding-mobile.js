/*
WEDDING MOBILE JS
Версия: wedding-mobile-js-001
*/

(function(){
'use strict';

var SCROLLTOP_REVEAL_OFFSET = 160;

var menuButton=document.querySelector('.ip-menu-toggle');
var menuPanel=document.querySelector('.ip-menu-panel');
var accordions=[].slice.call(document.querySelectorAll('.ip-accordion'));
var popup=document.querySelector('[data-popup="main"]');
var popupOpenTriggers=[].slice.call(document.querySelectorAll('[data-popup-open]'));
var popupCloseTriggers=[].slice.call(document.querySelectorAll('[data-popup-close]'));
var galleryButton=document.querySelector('[data-wedding-mobile-gallery-open]');
var gallery=document.querySelector('[data-wedding-mobile-gallery]');
var scrollTopButton=document.querySelector('.ip-wedding-mobile-scrolltop');

function updateVH(){
  var h=(window.visualViewport&&window.visualViewport.height)?window.visualViewport.height:window.innerHeight;
  document.documentElement.style.setProperty('--wedding-mobile-vh',(h*0.01)+'px');
}

function updateScrollTopVisibility(){
  if(!scrollTopButton) return;
  var st=window.pageYOffset||document.documentElement.scrollTop||0;
  var vh=(window.visualViewport&&window.visualViewport.height)?window.visualViewport.height:window.innerHeight;
  var ph=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
  var distance=ph-(st+vh);

  if(distance<=SCROLLTOP_REVEAL_OFFSET){
    scrollTopButton.classList.add('is-visible');
  }else{
    scrollTopButton.classList.remove('is-visible');
  }
}

function closeMenu(){
  if(!menuPanel) return;
  menuPanel.classList.remove('is-open');
  if(menuButton) menuButton.classList.remove('is-open');
  accordions.forEach(function(a){a.classList.remove('is-open');});
}

function openMenu(){
  if(!menuPanel) return;
  menuPanel.classList.add('is-open');
  if(menuButton) menuButton.classList.add('is-open');
}

if(menuButton){
  menuButton.addEventListener('click',function(e){
    e.preventDefault();
    menuPanel && menuPanel.classList.contains('is-open') ? closeMenu() : openMenu();
  });
}

accordions.forEach(function(acc){
  var btn=acc.querySelector('.ip-accordion-button');
  if(!btn) return;
  btn.addEventListener('click',function(e){
    e.preventDefault();
    acc.classList.toggle('is-open');
  });
});

function openPopup(){
  if(!popup) return;
  popup.classList.add('is-open');
  popup.setAttribute('aria-hidden','false');
  closeMenu();
}

function closePopup(){
  if(!popup) return;
  popup.classList.remove('is-open');
  popup.setAttribute('aria-hidden','true');
}

popupOpenTriggers.forEach(function(el){
  el.addEventListener('click',function(e){
    e.preventDefault();
    openPopup();
  });
});

popupCloseTriggers.forEach(function(el){
  el.addEventListener('click',function(e){
    e.preventDefault();
    closePopup();
  });
});

if(galleryButton && gallery){
  galleryButton.addEventListener('click',function(e){
    e.preventDefault();
    var top=gallery.getBoundingClientRect().top + window.pageYOffset - 24;
    window.scrollTo({top:top,behavior:'smooth'});
  });
}

if(scrollTopButton){
  scrollTopButton.addEventListener('click',function(){
    window.scrollTo({top:0,behavior:'smooth'});
  });
}

window.addEventListener('scroll',function(){
  updateScrollTopVisibility();
  if(menuPanel && menuPanel.classList.contains('is-open')) closeMenu();
},{passive:true});

window.addEventListener('resize',function(){
  updateVH();
  updateScrollTopVisibility();
},{passive:true});

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    closePopup();
    closeMenu();
  }
});

updateVH();
updateScrollTopVisibility();

})();