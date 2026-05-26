(function () {
  'use strict';
  var KEY = 'hype_cart';
  var CHANNELS = {
    'avi':             { name: 'AVI Channel',     category: 'Cine & Entretenimiento', color: '#386CFF' },
    'rewind':          { name: 'AVI Rewind',       category: 'Cine Clásico & Retro',  color: '#22B8CF' },
    'kids':            { name: 'AVI Kids',         category: 'Animación & Familia',   color: '#F5C518' },
    'planeta-salvaje': { name: 'Planeta Salvaje',  category: 'Naturaleza & Wildlife', color: '#2BB673' },
    'comedy':          { name: 'Comedy Channel',   category: 'Comedia & Humor',       color: '#FFBE0B' },
    'planeta-historia':{ name: 'Planeta Historia', category: 'Historia & Documentales',color: '#B4783C' }
  };

  function get() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function save(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    updateAll();
  }

  window.Cart = {
    get: get,
    add:    function(id) { var c = get(); if (c.indexOf(id) === -1) { c.push(id); save(c); } },
    remove: function(id) { save(get().filter(function(i) { return i !== id; })); },
    toggle: function(id) { Cart.get().indexOf(id) === -1 ? Cart.add(id) : Cart.remove(id); },
    has:    function(id) { return get().indexOf(id) !== -1; },
    updateAll: updateAll
  };

  function updateAll() {
    var cart = get();

    /* ── Nav counter (index.html) ── */
    var navCount = document.getElementById('nav-cart-count');
    if (navCount) navCount.textContent = cart.length;

    /* ── Nav counter (channel pages) ── */
    var chCount = document.getElementById('ch-cart-count');
    var chLink  = document.getElementById('ch-cart-link');
    if (chCount) chCount.textContent = cart.length;
    if (chLink)  chLink.style.opacity = cart.length > 0 ? '1' : '0.55';

    /* ── Add-to-cart button on channel pages ── */
    var btn = document.getElementById('cart-btn');
    if (btn) {
      var id = btn.getAttribute('data-channel');
      var inCart = Cart.has(id);
      btn.textContent = inCart ? '✓ En el carrito' : '+ Agregar al carrito';
      btn.style.background = inCart
        ? 'linear-gradient(135deg,#1a7a30,#2ab64a)'
        : 'linear-gradient(135deg,#1A35C4,#386CFF)';
      btn.style.boxShadow = inCart
        ? '0 12px 40px rgba(30,160,50,0.4)'
        : '0 12px 40px rgba(26,53,196,0.4)';
    }

    /* ── Hidden form field ── */
    var field = document.getElementById('cart-field');
    if (field) {
      field.value = cart.length > 0
        ? cart.map(function(id) { return (CHANNELS[id] || {}).name || id; }).join(', ')
        : 'Ningún canal seleccionado';
    }

    /* ── Cart preview panel in contact section ── */
    var panel = document.getElementById('cart-panel');
    if (!panel) return;

    if (cart.length === 0) {
      panel.innerHTML = '<p style="color:rgba(255,255,255,0.32);font-size:13px;margin:0;line-height:1.65">Visita cada canal y presiona <strong style="color:rgba(255,255,255,0.55)">"+ Agregar al carrito"</strong> para incluirlos en tu solicitud.</p>';
      return;
    }

    panel.innerHTML = cart.map(function(id) {
      var ch = CHANNELS[id] || { name: id, category: '', color: '#fff' };
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:8px;margin-bottom:8px">'
        + '<div style="display:flex;align-items:center;gap:10px">'
        + '<span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:' + ch.color + ';box-shadow:0 0 8px ' + ch.color + '88"></span>'
        + '<div>'
        + '<div style="font-size:13px;font-weight:600;color:#fff">' + ch.name + '</div>'
        + '<div style="font-size:11px;color:rgba(255,255,255,0.38);text-transform:uppercase;letter-spacing:0.1em">' + ch.category + '</div>'
        + '</div>'
        + '</div>'
        + '<button onclick="Cart.remove(\'' + id + '\')" style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:20px;padding:2px 8px;line-height:1;transition:color .2s" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'rgba(255,255,255,0.3)\'" title="Quitar">×</button>'
        + '</div>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', updateAll);
})();
