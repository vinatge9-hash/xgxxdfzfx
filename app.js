// Roast & Ritual — app.js
// Handles theme, cart, modals, search, FAQ, slider, lazy loading & small micro-interactions
(function(){
  'use strict';
  const $ = (s,d=document) => d.querySelector(s);
  const $$ = (s,d=document) => Array.from(d.querySelectorAll(s));

  // Theme (dark/light) with smooth transition
  const root = document.getElementById('pageRoot') || document.body;
  const storedTheme = localStorage.getItem('rr_theme');
  function applyTheme(theme){
    if(theme === 'dark'){
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-root');
      root && root.setAttribute('data-theme','dark');
      localStorage.setItem('rr_theme','dark');
      const icon = $('#themeIcon'); if(icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-12.34l-.7.7M4.04 19.96l-.7.7M21 12h-1M4 12H3m16.66 4.66l-.7-.7M4.04 4.04l-.7-.7"/>';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-root');
      root && root.removeAttribute('data-theme');
      localStorage.setItem('rr_theme','light');
      const icon = $('#themeIcon'); if(icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z"/>';
    }
  }
  applyTheme(storedTheme || 'light');

  const themeToggle = $('#themeToggle');
  if(themeToggle){ themeToggle.addEventListener('click', ()=> applyTheme(localStorage.getItem('rr_theme') === 'dark' ? 'light' : 'dark')); }

  // Mobile menu
  const mobileMenuBtn = $('#mobileMenuBtn');
  const mobileMenu = $('#mobileMenu');
  if(mobileMenuBtn && mobileMenu){ mobileMenuBtn.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden')); }

  // Year in footer
  const yearEls = document.querySelectorAll('#year, #yearContact');
  yearEls.forEach(el => el && (el.textContent = new Date().getFullYear()));

  // Lazy images (data-src) and reveal on scroll
  function lazyLoad(){
    const lazy = Array.from(document.querySelectorAll('img.lazyimg'));
    lazy.forEach(img=>{
      if(img.dataset.src){ img.src = img.dataset.src; img.removeAttribute('data-src'); }
    });
  }
  lazyLoad();

  // Scroll reveal
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  function onScrollReveal(){
    const top = window.innerHeight * 0.85;
    revealEls.forEach(el=>{
      const rect = el.getBoundingClientRect();
      if(rect.top < top) el.classList.add('show');
    });
  }
  onScrollReveal();
  window.addEventListener('scroll', onScrollReveal);

  // Simple products catalog (demo) — in a real app this would come from an API
  const demoProducts = [
    {id:'espresso', name:'Espresso Kiss — Dark Roast', price:16, desc:'Notes of dark chocolate, caramel, and toasted hazelnut.', img:'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'},
    {id:'sunshine', name:'Sunshine Pour — Light Roast', price:18, desc:'Lively citrus, honeysuckle, and crisp finish.', img:'https://images.pexels.com/photos/4098899/pexels-photo-4098899.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'},
    {id:'decaf', name:'Quiet Decaf — Swiss Water', price:15, desc:'Smooth cocoa notes with low acidity.', img:'https://images.unsplash.com/photo-1640613303900-97956b839853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODkyNDZ8MHwxfHNlYXJjaHw4fHxBJTIwYmFnJTIwb2YlMjBkZWNhZiUyMGJlYW5zJTIwd2l0aCUyMHNvZnQlMjBzbW9reSUyMGJhY2tncm91bmQlMkMlMjBjdXAlMjBvZiUyMGJyZXdlZCUyMGNvZmZlZXxlbnwwfDB8fHwxNzU1MjczMDU5fDA&ixlib=rb-4.1.0&q=80&w=1080'}
  ];

  // Render product cards if container exists
  const productsContainer = $('#products');
  function renderProducts(list){
    if(!productsContainer) return;
    productsContainer.innerHTML = '';
    list.forEach(p=>{
      const art = document.createElement('article');
      art.className = 'product-card w-full bg-[var(--card)] rounded-xl shadow-lg overflow-hidden p-0 transition transform hover:-translate-y-1';
      art.innerHTML = `\
        <img src="${p.img}" loading="lazy" alt="${p.name}" class="w-full h-48 object-cover">\
        <div class="p-4">\
          <h3 class="font-semibold">${p.name}</h3>\
          <p class="text-sm text-gray-600 mt-1">${p.desc}</p>\
          <div class="mt-4 flex items-center justify-between">\
            <div><span class="text-lg font-bold">$${p.price}</span><span class="text-sm text-gray-500"> / 12oz</span></div>\
            <div class="flex items-center gap-2">\
              <button class="quickView px-3 py-1 rounded-md bg-white/90 text-coffee-700 border" data-id="${p.id}">Quick</button>\
              <button class="addToCart px-3 py-1 rounded-md bg-coffee-700 text-white" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">Add</button>\
            </div>\
          </div>\
        </div>`;
      productsContainer.appendChild(art);
    });
  }
  renderProducts(demoProducts);

  // Cart logic (localStorage-backed)
  const CART_KEY = 'rr_cart_v1';
  const cartBtn = $('#cartBtn');
  const cartPanel = $('#cartPanel');
  const cartItemsEl = $('#cartItems');
  const cartCountEl = $('#cartCount');
  const cartSubtotalEl = $('#cartSubtotal');

  function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY) || '{}'); } catch(e){ return {}; } }
  function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); renderCart(); }

  function renderCart(){
    const cart = loadCart();
    const items = Object.values(cart);
    cartItemsEl.innerHTML = '';
    let subtotal = 0;
    items.forEach(it => {
      subtotal += it.price * it.qty;
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between gap-2';
      row.innerHTML = `\
        <div class="flex-1">\
          <div class="font-medium">${it.name}</div>\
          <div class="text-sm text-gray-500">${it.qty} × $${it.price}</div>\
        </div>\
        <div class="flex items-center gap-2">\
          <button data-id="${it.id}" class="text-sm px-2 py-1 bg-white/20 rounded-md decrease">-</button>\
          <button data-id="${it.id}" class="text-sm px-2 py-1 bg-white/20 rounded-md increase">+</button>\
        </div>`;
      cartItemsEl.appendChild(row);
    });
    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    cartCountEl.textContent = String(items.reduce((s,i)=>s+i.qty,0));

    // attach increase/decrease
    $$('.increase', cartItemsEl).forEach(btn=> btn.addEventListener('click', e=>{ const id=e.currentTarget.dataset.id; const c=loadCart(); if(c[id]){ c[id].qty++; saveCart(c);} }));
    $$('.decrease', cartItemsEl).forEach(btn=> btn.addEventListener('click', e=>{ const id=e.currentTarget.dataset.id; const c=loadCart(); if(c[id]){ c[id].qty--; if(c[id].qty<=0) delete c[id]; saveCart(c);} }));
  }
  renderCart();

  // Add to cart handlers (delegated)
  document.body.addEventListener('click', (e)=>{
    const btn = e.target.closest('.addToCart');
    if(btn){
      const id = btn.dataset.id; const name = btn.dataset.name; const price = parseFloat(btn.dataset.price);
      const cart = loadCart(); if(cart[id]) cart[id].qty++; else cart[id] = {id,name,price,qty:1}; saveCart(cart);
      btn.textContent = 'Added'; btn.disabled = true; setTimeout(()=>{ btn.textContent = 'Add'; btn.disabled = false; },700);
    }
  });

  if(cartBtn && cartPanel){ cartBtn.addEventListener('click', ()=>{ cartPanel.classList.toggle('hidden'); }); }
  const clearCartBtn = $('#clearCart'); if(clearCartBtn){ clearCartBtn.addEventListener('click', ()=>{ localStorage.removeItem(CART_KEY); renderCart(); }); }
  const checkoutBtn = $('#checkout'); if(checkoutBtn){ checkoutBtn.addEventListener('click', ()=>{ alert('Checkout demo — cart saved locally.'); }); }

  // Quick view modal
  const modal = $('#modal');
  const modalContent = $('#modalContent');
  const modalClose = $('#modalClose');
  function openModal(html){ if(modal){ modalContent.innerHTML = html; modal.classList.remove('hidden'); modal.focus(); document.body.style.overflow='hidden'; modal.setAttribute('aria-hidden','false'); } }
  function closeModal(){ if(modal){ modal.classList.add('hidden'); document.body.style.overflow=''; modal.setAttribute('aria-hidden','true'); } }
  document.body.addEventListener('click', (e)=>{
    const q = e.target.closest('.quickView');
    if(q){ const id = q.dataset.id; const p = demoProducts.find(x=>x.id===id); openModal(`\
      <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\
        <img src=\"${p.img}\" alt=\"${p.name}\" class=\"w-full h-64 object-cover rounded-lg\">\
        <div>\
          <h3 class=\"text-2xl font-semibold\">${p.name}</h3>\
          <p class=\"text-sm text-gray-600 mt-2\">${p.desc}</p>\
          <div class=\"mt-4\">\
            <div class=\"text-lg font-bold\">$${p.price}</div>\
            <button class=\"mt-3 addToCart px-4 py-2 rounded-md bg-coffee-700 text-white\" data-id=\"${p.id}\" data-name=\"${p.name}\" data-price=\"${p.price}\">Add to cart</button>\
          </div>\
        </div>\
      </div>` ); }
  });
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  // Search & sort
  const searchInput = $('#search');
  const sortSelect = $('#sort');
  function applyFilters(){
    const q = searchInput ? searchInput.value.toLowerCase() : '';
    const sort = sortSelect ? sortSelect.value : 'featured';
    let filtered = demoProducts.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    if(sort === 'price_asc') filtered.sort((a,b)=>a.price-b.price);
    if(sort === 'price_desc') filtered.sort((a,b)=>b.price-a.price);
    if(sort === 'new') filtered = filtered.slice().reverse();
    renderProducts(filtered);
  }
  if(searchInput) searchInput.addEventListener('input', applyFilters);
  if(sortSelect) sortSelect.addEventListener('change', applyFilters);

  // Testimonials slider (basic)
  const testHolder = $('#testimonials div > div');
  const nextTest = $('#nextTest');
  const prevTest = $('#prevTest');
  let testIndex = 0;
  if(nextTest) nextTest.addEventListener('click', ()=>{ testIndex = (testIndex+1)%2; if(testHolder) testHolder.style.transform = `translateX(-${testIndex*50}%)`; });
  if(prevTest) prevTest.addEventListener('click', ()=>{ testIndex = (testIndex-1+2)%2; if(testHolder) testHolder.style.transform = `translateX(-${testIndex*50}%)`; });

  // FAQ keyboard accessibility already provided by <details>

  // Brew timer progress
  const brewSelect = $('#brewSelect');
  const brewStart = $('#brewStart');
  const brewReset = $('#brewReset');
  const brewProgress = $('#brewProgress');
  const brewTime = $('#brewTime');
  let brewTimer = null; let remaining = 0; let total = 0;
  function setBrewTime(val){
    if(val === 'light') total = 150;
    if(val === 'medium') total = 210;
    if(val === 'dark') total = 240;
    remaining = total; updateBrewUI();
  }
  function updateBrewUI(){
    const pct = total ? Math.round(((total-remaining)/total)*100) : 0;
    if(brewProgress) brewProgress.style.width = pct+'%';
    if(brewTime) brewTime.textContent = `${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;
  }
  if(brewSelect) brewSelect.addEventListener('change', ()=> setBrewTime(brewSelect.value));
  if(brewStart) brewStart.addEventListener('click', ()=>{
    if(!total) setBrewTime(brewSelect.value);
    if(brewTimer) return;
    brewTimer = setInterval(()=>{
      remaining = Math.max(0, remaining-1); updateBrewUI(); if(remaining===0){ clearInterval(brewTimer); brewTimer=null; alert('Brew complete! Enjoy.'); }
    },1000);
  });
  if(brewReset) brewReset.addEventListener('click', ()=>{ clearInterval(brewTimer); brewTimer=null; setBrewTime(brewSelect.value); });
  setBrewTime(brewSelect ? brewSelect.value : 'medium');

  // Subscribe forms (footer & hero) — store in localStorage demo
  const subscribeForms = $$('#footerSubscribe, #subscribeForm');
  subscribeForms.forEach(f=> f && f.addEventListener('submit', e=>{
    e.preventDefault();
    const input = f.querySelector('input');
    const email = input && input.value.trim();
    if(!email || !email.includes('@')){ alert('Please provide a valid email'); return; }
    const key = 'rr_subs_v1';
    const list = JSON.parse(localStorage.getItem(key) || '[]'); if(!list.includes(email)) list.push(email); localStorage.setItem(key, JSON.stringify(list)); input.value=''; alert('Thanks — you are subscribed!');
  }));

  // Small accessibility: focus trap in modal (basic)
  document.addEventListener('focus', (e)=>{
    if(!modal || modal.classList.contains('hidden')) return;
    if(!modal.contains(e.target)) e.stopPropagation();
  }, true);

  // Loading skeleton simulation (progressive enhancement)
  window.addEventListener('load', ()=>{ document.body.classList.add('loaded'); });

  // Expose some helpers for preview tools
  window.rr = { applyTheme, loadCart, saveCart };
})();
