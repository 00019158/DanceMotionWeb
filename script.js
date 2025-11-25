/* script.js — основная логика для index.html
   - Рендер каталога / корзины / профиль
   - Работа с localStorage: cart, favs, user, orders
   - Экспорт функций для checkout/admin/order страниц:
     window.placeOrder(orderData), window.saveOrder(order), window.getOrders(), window.updateOrderStatus(id,status)
*/

/* ========== CONFIG (вставь свой токен/чат если нужно) ========== */
const TELEGRAM_BOT_TOKEN = '8182609479:AAG7AqcB8naX92u2XlHkxwp9R9IBhEhfoW0';
const TELEGRAM_CHAT_ID  = '8492577684';

/* ========== DATA (каталог) ==========
   Добавлена property `collection` чтобы товары попадали в фильтры:
   'Рейтинг','Стандартные','Латинские','Аксессуары' (и т.д.)
*/
const PRODUCTS = [
  {id:1, title:'Туфли Рейтинг с ремешками - Белые (Кожа)', price:350000, category:'Девочкам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:true, img:'/images/w3.jpg'},
  {id:2, title:'Туфли Рейтинг с ремешками - Светло-Бежевые (Сатин)', price:350000, category:'Девочкам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:true, img:'/images/B2.jpg'},
  {id:3, title:'Туфли Рейтинг с ремешками - Коричневые (Кожа)', price:350000, category:'Девочкам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:false, img:'/images/B.jpg'},
  {id:4, title:'Туфли Рейтинг с ремешками - Красные (Кожа)', price:350000, category:'Девочкам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:true, img:'/images/R.jpg'},
  {id:5, title:'Туфли Рейтинг с ремешками - Черные (Сатин)', price:350000, category:'Девочкам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:true, img:'/images/BL.jpg'},
  {id:6, title:'Туфли Рейтинг с ремешками - Коричневые (Сатин)', price:350000, category:'Девочкам', collection:'Рейтинг', type:'Туфли', discount:10, isNew:true, img:'/images/BR.jpg'},

  {id:7, title:'Согревающие Чуни (Серые)', price:350000, category:'Женщинам', collection:'Аксессуары', type:'Чуни', discount:0, isNew:true, img:'/images/S.png'},
  {id:8, title:'Согревающие Чуни (Небесно-голубой)', price:250000, category:'Женщинам', collection:'Аксессуары', type:'Чуни', discount:0, isNew:true, img:'/images/BCH.png'},
  {id:9, title:'Согревающие Чуни (Темно-Фиолетовые)', price:250000, category:'Женщинам', collection:'Аксессуары', type:'Чуни', discount:0, isNew:true, img:'/images/FCH.PNG'},
  {id:10, title:'Согревающие Чуни (Черные)', price:250000, category:'Женщинам', collection:'Аксессуары', type:'Чуни', discount:0, isNew:true, img:'/images/BLCH.PNG'},
  {id:11, title:'Согревающие Чуни (Градиент)', price:250000, category:'Женщинам', collection:'Аксессуары', type:'Чуни', discount:0, isNew:true, img:'/images/GCH.PNG'},
  {id:12, title:'Согревающие Чуни (Розовые)', price:250000, category:'Женщинам', collection:'Аксессуары', type:'Чуни', discount:0, isNew:true, img:'/images/PCH.png'},

  {id:13, title:'Стандартные туфли - (Шампань)', price:350000, category:'Женщинам', collection:'Стандартные', type:'Туфли', discount:0, isNew:true, img:'/images/SHST.PNG'},
  {id:14, title:'Стандартные туфли - (Белые)', price:350000, category:'Женщинам', collection:'Стандартные', type:'Туфли', discount:0, isNew:true, img:'/images/WHST.PNG'},
  {id:15, title:'Стандартные туфли - (Сатин)', price:350000, category:'Женщинам', collection:'Стандартные', type:'Туфли', discount:0, isNew:true, img:'/images/SST.PNG'},

  {id:16, title:'Латинские туфли - (Светло-Бежевые)', price:350000, category:'Женщинам', collection:'Латинские', type:'Туфли', discount:0, isNew:true, img:'/images/GLT.PNG'},
  {id:17, title:'Латинские туфли - (Черные)', price:350000, category:'Женщинам', collection:'Латинские', type:'Туфли', discount:0, isNew:true, img:'/images/BLT.PNG'},
  {id:18, title:'Латинские туфли - (Сатин)', price:350000, category:'Женщинам', collection:'Латинские', type:'Туфли', discount:0, isNew:true, img:'/images/SLT.PNG'},
  {id:19, title:'Латинские туфли - (Шампань)', price:350000, category:'Женщинам', collection:'Латинские', type:'Туфли', discount:0, isNew:true, img:'/images/SHLT.PNG'},
  {id:20, title:'Латинские туфли - (Градиент)', price:350000, category:'Женщинам', collection:'Латинские', type:'Туфли', discount:0, isNew:true, img:'/images/GRLT.PNG'},

  {id:21, title:'Тренировочные туфли (Золотые Поцелуи)', price:350000, category:'Женщинам', collection:'Стандартные', type:'Тренировочные', discount:0, isNew:true, img:'/images/GT.PNG'},
  {id:22, title:'Тренировочные туфли (Красные Поцелуи)', price:350000, category:'Женщинам', collection:'Стандартные', type:'Тренировочные', discount:0, isNew:true, img:'/images/RT.PNG'},
  {id:23, title:'Тренировочные туфли (Градиентовые Поцелуи)', price:350000, category:'Женщинам', collection:'Стандартные', type:'Тренировочные', discount:0, isNew:true, img:'/images/GRT.PNG'},

  {id:24, title:'Туфли Рейтинг - (Сатин)', price:350000, category:'Женщинам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:true, img:'/images/SR.PNG'},
  {id:25, title:'Туфли Рейтинг - (Белые)', price:350000, category:'Женщинам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:true, img:'/images/WHR.PNG'},
  {id:26, title:'Туфли Рейтинг - (Черные)', price:350000, category:'Женщинам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:true, img:'/images/BRT.PNG'},
  {id:27, title:'Туфли Рейтинг плетение - (Персиковые)', price:350000, category:'Женщинам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:true, img:'/images/PR.PNG'},
  {id:28, title:'Туфли Рейтинг плетение - (Белые)', price:350000, category:'Женщинам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:true, img:'/images/WHRT.PNG'},
  {id:29, title:'Туфли Рейтинг - (Черные)', price:350000, category:'Женщинам', collection:'Рейтинг', type:'Туфли', discount:0, isNew:true, img:'/images/BLRT.PNG'},

  {id:30, title:'Гетры - (Черные)', price:120000, category:'Женщинам', collection:'Аксессуары', type:'Гетры', discount:0, isNew:true, img:'/images/GET.PNG'},
  {id:31, title:'Гетры - (Белые)', price:120000, category:'Женщинам', collection:'Аксессуары', type:'Гетры', discount:0, isNew:true, img:'/images/GETWH.PNG'},
  {id:32, title:'Гетры - (Фирменный цвет DanceMotion)', price:120000, category:'Женщинам', collection:'Аксессуары', type:'Гетры', discount:0, isNew:true, img:'/images/GETB.PNG'},
];

/* ========== STORAGE KEYS ========== */
const LS_CART   = 'dm_cart_v1';
const LS_FAV    = 'dm_fav_v1';
const LS_USER   = 'dm_user_v1';
const LS_ORDERS = 'dm_orders_v1';

/* ========== HELPERS ========== */
function readJSON(key, fallback){ try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch(e){ return fallback; } }
function writeJSON(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }
function formatSum(v){ return (Math.round(v)).toLocaleString('ru-RU') + ' сум'; }
function calcPriceAfterDiscount(p){ return Math.round(p.price * (1 - (p.discount||0)/100)); }

/* ========== APP STATE ========== */
let cart = readJSON(LS_CART, []);
let favs = readJSON(LS_FAV, []);
let user = readJSON(LS_USER, { logged:false, name:'', phone:'', id:null, cashback:0 });

/* ========== DOM refs (index.html) - guard на случай если файл подключён на другой странице */ 
const productsGrid   = document.getElementById('productsGrid');
const discountsGrid  = document.getElementById('discountsGrid');
const categoryNav    = document.getElementById('categoryNav');
const searchInput    = document.getElementById('searchInput');

const cartBtn        = document.getElementById('cartBtn');
const cartCountEl    = document.getElementById('cartCount');
const favCountEl     = document.getElementById('favCount');
const cartDrawer     = document.getElementById('cartDrawer');
const cartList       = document.getElementById('cartList');
const cartTotalEl    = document.getElementById('cartTotal');
const closeCartBtn   = document.getElementById('closeCart');
const overlay        = document.getElementById('overlay');
const checkoutBtnEl  = document.getElementById('checkoutBtn');

const profileBtn     = document.getElementById('profileBtn');
const profileModal   = document.getElementById('profileModal');
const profileBody    = document.getElementById('profileBody');
const closeProfileBtn= document.getElementById('closeProfile');

const cashbackAvailableEl = document.getElementById('cashbackAvailable');
const cashbackUseInput    = document.getElementById('cashbackUseInput');
const applyCashbackBtnEl  = document.getElementById('applyCashbackBtn');

const shopNowBtn     = document.getElementById('shopNow');

/* categories list and active
   Здесь финальный набор кнопок, который вы просили:
   Все, Женщинам, Девочкам, Мальчикам, Рейтинг, Стандартные, Латинские, Аксессуары, Скидки
*/
const categories = ['Все','Женщинам','Девочкам','Мальчикам','Рейтинг','Стандартные','Латинские','Аксессуары','Скидки'];
let activeCategory = 'Все';

/* ========== RENDER FUNCTIONS ========== */
function renderCategoryNav(){
  if(!categoryNav) return;
  categoryNav.innerHTML = '';
  categories.forEach(cat=>{
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (cat === activeCategory ? ' active' : '');
    btn.textContent = cat;
    btn.onclick = () => { activeCategory = cat; renderAll(); window.scrollTo({top:220, behavior:'smooth'}); };
    categoryNav.appendChild(btn);
  });
}

/* Фильтрация товаров по activeCategory и поиску */
function productMatchesFilter(p){
  const q = (searchInput && searchInput.value || '').trim().toLowerCase();

  if(activeCategory !== 'Все'){
    if(activeCategory === 'Скидки' && !(p.discount > 0)) return false;

    // фильтры по полу/категории (Женщинам/Девочкам/Мальчикам)
    if(['Женщинам','Девочкам','Мальчикам'].includes(activeCategory)){
      if(p.category !== activeCategory) return false;
    }

    // фильтры по коллекциям
    if(['Рейтинг','Стандартные','Латинские','Аксессуары'].includes(activeCategory)){
      if((p.collection || '').toLowerCase() !== activeCategory.toLowerCase()) return false;
    }
  }

  // поиск по title / category / type / collection
  if(q){
    const hay = (((p.title || '') + ' ' + (p.category || '') + ' ' + (p.type || '') + ' ' + (p.collection || '')).toLowerCase());
    if(!hay.includes(q)) return false;
  }

  return true;
}

function createProductCard(p){
  const div = document.createElement('div');
  div.className = 'card';
  // dataset для возможного использования в фильтрах/отладке
  div.dataset.id = p.id;
  if(p.category) div.dataset.category = p.category;
  if(p.collection) div.dataset.collection = p.collection;
  if(p.discount && p.discount > 0) div.dataset.discount = 'true';

  div.innerHTML = `
    <div class="img-box">
      <img src="${p.img}" alt="${escapeHtml(p.title)}" style="max-height:100%;max-width:100%;object-fit:contain;border-radius:10px">
      ${p.isNew ? '<div class="new-label">NEW</div>' : ''}
    </div>
    <div>
      <div class="title">${escapeHtml(p.title)}</div>
      <div class="meta">Категория: ${escapeHtml(p.category || '')} ${p.collection ? '• ' + escapeHtml(p.collection) : ''}</div>
    </div>
    <div class="price-row">
      <div>
        ${p.discount > 0 ? `<div class="old-price">${formatSum(p.price)}</div>` : ''}
        <div class="price">${formatSum(calcPriceAfterDiscount(p))}</div>
      </div>
      <div style="text-align:right">
        ${p.discount > 0 ? `<div class="discount">-${p.discount}%</div>` : ''}
      </div>
    </div>
    <div class="actions">
      <button class="btn cart" data-id="${p.id}">В корзину</button>
      <button class="btn fav" data-id="${p.id}">${favs.find(f=>f.id===p.id) ? '♥' : '♡'}</button>
    </div>
  `;
  return div;
}

/* простая защита от XSS для title/meta */
function escapeHtml(s){
  return String(s || '').replace(/[&<>"']/g, function(m){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
  });
}

function renderProducts(){
  if(!productsGrid) return;
  productsGrid.innerHTML = '';
  const filtered = PRODUCTS.filter(productMatchesFilter);
  if(filtered.length === 0){
    productsGrid.innerHTML = `<div class="muted">Нет товаров по этому фильтру</div>`;
    return;
  }
  filtered.forEach(p => productsGrid.appendChild(createProductCard(p)));
}

function renderDiscounts(){
  if(!discountsGrid) return;
  discountsGrid.innerHTML = '';
  const disc = PRODUCTS.filter(p => p.discount > 0 && productMatchesFilter(p));
  if(disc.length === 0) { discountsGrid.innerHTML = `<div class="muted">Скидочные товары не найдены</div>`; return; }
  disc.forEach(p => discountsGrid.appendChild(createProductCard(p)));
}

function renderCounters(){
  if(cartCountEl) cartCountEl.textContent = cart.reduce((s,i)=> s + i.qty, 0);
  if(favCountEl) favCountEl.textContent = favs.length;
  if(cashbackAvailableEl) cashbackAvailableEl.textContent = formatSum(user.cashback || 0);
}

function renderCartDrawer(){
  if(!cartList) return;
  cartList.innerHTML = '';
  if(cart.length === 0){
    cartList.innerHTML = '<div class="muted">Корзина пуста</div>';
  } else {
    cart.forEach(item=>{
      const subtotal = Math.round(item.price * (1 - (item.discount||0)/100) * item.qty);
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <div style="width:64px;height:64px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center">${escapeHtml(String(item.title).split(' ')[0])}</div>
        <div style="flex:1">
          <div style="font-weight:700">${escapeHtml(item.title)}</div>
          <div class="muted">${item.qty} x ${formatSum(Math.round(item.price*(1-(item.discount||0)/100)))}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">${formatSum(subtotal)}</div>
          <div style="margin-top:8px" class="qty">
            <button class="icon-btn" data-action="minus" data-id="${item.id}">−</button>
            <span style="min-width:22px;display:inline-block;text-align:center">${item.qty}</span>
            <button class="icon-btn" data-action="plus" data-id="${item.id}">+</button>
            <div style="margin-top:6px"><button class="underline" data-action="remove" data-id="${item.id}">Удалить</button></div>
          </div>
        </div>
      `;
      cartList.appendChild(itemDiv);
    });
  }

  // attach handlers
  cartList.querySelectorAll('[data-action]').forEach(btn=>{
    btn.onclick = () => {
      const id = +btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      if(action === 'plus') changeQty(id, +1);
      if(action === 'minus') changeQty(id, -1);
      if(action === 'remove') removeFromCart(id);
    };
  });

  const total = cart.reduce((s,i)=> s + Math.round(i.price * (1 - (i.discount||0)/100) * i.qty), 0);
  if(cartTotalEl) cartTotalEl.textContent = formatSum(total);

  // cashback guard
  const maxUse = Math.min(user.cashback || 0, total);
  if(window.appliedCashback > maxUse) window.appliedCashback = maxUse;
  if(cashbackUseInput) cashbackUseInput.value = window.appliedCashback > 0 ? window.appliedCashback : '';
  if(cashbackAvailableEl) cashbackAvailableEl.textContent = formatSum(user.cashback || 0);
}

/* ========== CART OPERATIONS ========== */
function addToCart(id){
  const product = PRODUCTS.find(p=>p.id===id); if(!product) return;
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({ id:product.id, title:product.title, price:product.price, discount:product.discount, qty:1 });
  writeJSON(LS_CART, cart);
  showCartDrawer(true);
  renderAll();
}
function removeFromCart(id){
  cart = cart.filter(i => i.id !== id);
  writeJSON(LS_CART, cart);
  renderAll();
}
function changeQty(id, delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + delta);
  writeJSON(LS_CART, cart);
  renderAll();
}

/* ========== PROFILE & LOGIN (ID / phone) ========== */
function renderProfile(){
  if(!profileBody) return;
  profileBody.innerHTML = '';
  const div = document.createElement('div');

  if(user.logged && user.id){
    div.innerHTML = `
      <div class="muted">Вас приветствует:</div>
      <div style="font-weight:700;margin-bottom:8px">${escapeHtml(user.name || user.phone || 'Пользователь')}</div>
      <div class="muted">Ваш ID:</div>
      <div style="font-weight:800;margin-bottom:12px">${escapeHtml(String(user.id))}</div>
      <div style="display:flex;gap:8px">
        <button id="logoutBtn" class="btn" style="background:#eee;color:#000">Выйти</button>
        <button id="goOrder" class="btn" style="background:var(--brand-dark);color:#fff">Мой заказ</button>
      </div>
    `;
    profileBody.appendChild(div);

    document.getElementById('logoutBtn').onclick = () => {
      user = { logged:false, name:'', phone:'', id:null, cashback:0 };
      writeJSON(LS_USER, user);
      renderAll();
      closeProfileModal();
    };
    document.getElementById('goOrder').onclick = () => {
      if(user.id) window.location.href = `order.html?id=${user.id}`;
    };

  } else {
    div.innerHTML = `
      <div class="muted" style="margin-bottom:10px">Вход — По ID или по телефону</div>
      <div style="display:flex;gap:8px;flex-direction:column">
        <input id="loginId" placeholder="Введите ID (например 502)" style="padding:8px;border-radius:8px;border:1px solid #e6eef7" />
        <input id="loginPhone" placeholder="Или номер телефона" style="padding:8px;border-radius:8px;border:1px solid #e6eef7" />
        <input id="loginName" placeholder="Имя (опционально)" style="padding:8px;border-radius:8px;border:1px solid #e6eef7" />
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="loginBtn" class="btn" style="background:var(--brand-dark);color:#fff;flex:1">Войти</button>
          <button id="adminOpen" class="btn" style="background:#eee;color:#000;flex:1">Админ</button>
        </div>
      </div>
    `;
    profileBody.appendChild(div);

    document.getElementById('loginBtn').onclick = () => {
      const idVal = document.getElementById('loginId').value.trim();
      const phoneVal = document.getElementById('loginPhone').value.trim();
      const nameVal = document.getElementById('loginName').value.trim();
      const orders = readJSON(LS_ORDERS, []);
      let found = null;
      if(idVal) found = orders.find(o => String(o.id) === idVal);
      else if(phoneVal) found = orders.find(o => o.phone === phoneVal);

      if(found){
        user = { logged:true, name: nameVal || found.name || '', phone: phoneVal || found.phone || '', id: found.id, cashback: found.cashback || 0 };
        writeJSON(LS_USER, user);
        alert('Вход успешен. Перенаправляем к заказу.');
        window.location.href = `order.html?id=${found.id}`;
      } else {
        if(idVal){
          alert('Заказ с таким ID не найден');
          return;
        }
        // login by phone without order -> create ephemeral user (allows creating order later)
        if(phoneVal){
          const newId = generateOrderId();
          user = { logged:true, name: nameVal || '', phone: phoneVal, id:newId, cashback:0 };
          writeJSON(LS_USER, user);
          alert('Создан профиль. Для оформления заказа используйте "Оформить заказ".');
          closeProfileModal();
          renderAll();
        } else {
          alert('Введите ID или телефон');
        }
      }
    };

    document.getElementById('adminOpen').onclick = () => {
      window.location.href = 'admin.html';
    };
  }
}

/* show/hide UI */
function showCartDrawer(open=true){ if(!cartDrawer) return; cartDrawer.classList.toggle('open', open); overlay.style.display = open ? 'block' : 'none'; cartDrawer.setAttribute('aria-hidden', !open); renderCartDrawer(); }
function closeCartDrawer(){ showCartDrawer(false); }
function showProfileModal(open=true){ if(!profileModal) return; profileModal.classList.toggle('open', open); overlay.style.display = open ? 'block' : 'none'; renderProfile(); }
function closeProfileModal(){ if(!profileModal) return; profileModal.classList.remove('open'); overlay.style.display = 'none'; renderAll(); }

/* ========== ORDERS (LS) ========== */
function generateOrderId() {
  let orders = readJSON(LS_ORDERS, []);
  if (!Array.isArray(orders)) {
    console.warn('⚠️ LS_ORDERS не массив, сбрасываю...');
    orders = [];
    writeJSON(LS_ORDERS, orders);
  }
  const max = orders.length > 0 ? orders.reduce((m, o) => Math.max(m, o.id || 500), 500) : 500;
  return max + 1;
}

function saveOrder(order){
  // order: { id, name, phone, items:[], total, status, note, cashback }
  const orders = readJSON(LS_ORDERS, []);
  const idx = orders.findIndex(o => o.id === order.id);
  if(idx >= 0) orders[idx] = order;
  else orders.push(order);
  writeJSON(LS_ORDERS, orders);
}
function getOrders(){ return readJSON(LS_ORDERS, []); }
function findOrderById(id){ const orders = readJSON(LS_ORDERS, []); return orders.find(o => String(o.id) === String(id)); }

/* ========== Telegram (send message) ========== */
async function sendTelegramMessage(text, parseMode = 'HTML') {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: parseMode
      })
    });
    const data = await res.json();
    console.log('Telegram response:', data);
    return res.ok;
  } catch (err) {
    console.error('Telegram send error', err);
    return false;
  }
}

/* ========== Public API for checkout/admin/order pages ========== */
/**
 * placeOrder(orderData)
 * orderData: { name, phone, city, country, items: [{id,title,qty,price,discount}], note(optional) }
 * returns: { ok:true, id: ### } or { ok:false, error:'...' }
 */
window.placeOrder = async function(orderData){
  try {
    if(!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0) return { ok:false, error: 'Пустая корзина' };
    const id = generateOrderId();
    const total = orderData.items.reduce((s,i)=> s + Math.round((i.price || 0) * (1 - (i.discount||0)/100) * (i.qty||1)), 0);
    const order = {
      id,
      name: orderData.name || '',
      phone: orderData.phone || '',
      city: orderData.city || '',
      country: orderData.country || '',
      items: orderData.items,
      total,
      status: 'В обработке',
      note: orderData.note || '',
      cashback: Math.round(total * 0.05),
      created_at: (new Date()).toISOString()
    };
    saveOrder(order);

    // notify admin in telegram
    let itemsText = order.items.map(it => `• ${it.title} × ${it.qty} — ${ (Math.round((it.price || 0) * (1 - (it.discount||0)/100) * (it.qty||1))).toLocaleString() } сум`).join('\n');
    const message = `<b>Новый заказ #${order.id}</b>\nИмя: ${order.name}\nТел: ${order.phone}\nГород: ${order.city}\n\n${itemsText}\n\nИтого: ${order.total.toLocaleString()} сум\nСтатус: ${order.status}`;
    await sendTelegramMessage(message, 'HTML');

    return { ok:true, id };
  } catch (e){
    console.error(e);
    return { ok:false, error: e.message || String(e) };
  }
};

// внутренняя функция для работы с localStorage
function _saveOrderInternal(order) {
  const orders = readJSON(LS_ORDERS, []);
  const idx = orders.findIndex(o => o.id === order.id);
  if (idx >= 0) orders[idx] = order;
  else orders.push(order);
  writeJSON(LS_ORDERS, orders);
}

window.saveOrder = function(order){
  if(!order || !order.id) throw new Error('order.id required');
  _saveOrderInternal(order);
  return { ok:true };
};

/**
 * getOrders - для админки
 */
window.getOrders = function(){ return getOrders(); };

/**
 * updateOrderStatus(id, status) - обновляет статус и уведомляет в телеграм
 */
window.updateOrderStatus = async function(id, status){
  const orders = readJSON(LS_ORDERS, []);
  const idx = orders.findIndex(o => String(o.id) === String(id));
  if(idx === -1) return { ok:false, error:'order not found' };
  orders[idx].status = status;
  writeJSON(LS_ORDERS, orders);
  const order = orders[idx];
  const msg = `<b>Обновлён заказ #${order.id}</b>\nСтатус: ${order.status}\nКлиент: ${order.name} ${order.phone}`;
  await sendTelegramMessage(msg, 'HTML');
  return { ok:true };
};

/* ========== Checkout redirect (index -> checkout.html) ========== */
if(checkoutBtnEl) {
  checkoutBtnEl.addEventListener('click', () => {
    // save cart to LS (checkout page will read it)
    writeJSON(LS_CART, cart);
    window.location.href = 'checkout.html';
  });
}

/* ========== Apply cashback - simple UI (in drawer) ========== */
window.appliedCashback = 0;
if(applyCashbackBtnEl) applyCashbackBtnEl.onclick = ()=>{
  const requested = Number((cashbackUseInput && cashbackUseInput.value) || 0);
  const total = cart.reduce((s,i)=> s + Math.round(i.price * (1 - (i.discount||0)/100) * i.qty), 0);
  const maxUse = Math.min(user.cashback || 0, total);
  if(requested <= 0){ window.appliedCashback = 0; alert('Введите сумму кешбэка для использования'); renderCartDrawer(); return; }
  if(requested > maxUse){ alert('Нельзя использовать больше, чем доступно или больше суммы заказа'); return; }
  window.appliedCashback = Math.round(requested);
  alert('Кешбэк применён: ' + formatSum(window.appliedCashback));
  renderCartDrawer();
};

/* ========== Delegated handlers (Add to cart / Fav) ========== */
document.addEventListener('click', (e)=>{
  const el = e.target;
  if(el.matches('.card .btn.cart')) { const id = +el.getAttribute('data-id'); addToCart(id); }
  if(el.matches('.card .btn.fav')) { const id = +el.getAttribute('data-id'); toggleFav(id); renderAll(); }
});

/* fav toggle */
function toggleFav(id){
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  if(favs.find(f=>f.id===id)) favs = favs.filter(x=>x.id!==id);
  else favs.push({ id:p.id, title:p.title, price:p.price, discount:p.discount });
  writeJSON(LS_FAV, favs);
}

/* ========== UI events ========== */
if(cartBtn) cartBtn.onclick = ()=> showCartDrawer(true);
if(closeCartBtn) closeCartBtn.onclick = ()=> closeCartDrawer();
if(overlay) overlay.onclick = ()=> { closeCartDrawer(); if(profileModal) profileModal.classList.remove('open'); overlay.style.display = 'none'; };
if(profileBtn) profileBtn.onclick = ()=> { renderProfile(); showProfileModal(true); };
if(closeProfileBtn) closeProfileBtn.onclick = ()=> closeProfileModal();
if(searchInput) searchInput.oninput = ()=> renderAll();
if(shopNowBtn) shopNowBtn.onclick = ()=> { activeCategory = 'Все'; renderAll(); window.scrollTo({top:260, behavior:'smooth'}); };

/* ========== INIT ========== */
function renderAll(){
  renderCategoryNav();
  renderProducts();
  renderDiscounts();
  renderCounters();
  renderCartDrawer();
  renderProfile();
}
renderAll();

/* ========== Expose small helpers for debugging in console ========== */
window._dm = {
  getOrders,
  findOrderById,
  saveOrder,
  placeOrder: window.placeOrder,
  updateOrderStatus: window.updateOrderStatus,
};
