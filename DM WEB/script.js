// script.js (module) — ПОЛНЫЙ ФАЙЛ (замените текущий)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc, collection, getDocs, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

/* ================== FIREBASE CONFIG ================== */
const firebaseConfig = {
  apiKey: "AIzaSyAgyk4fu88ZfHEXsFvpDtRHYJa2XxlPRQY",
  authDomain: "dancemotion-40d56.firebaseapp.com",
  projectId: "dancemotion-40d56",
  storageBucket: "dancemotion-40d56.firebasestorage.app",
  messagingSenderId: "1095644417326",
  appId: "1:1095644417326:web:b32ba0116b65a7d42abebf",
  measurementId: "G-XNGTDZQPQQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* ========== CONFIG (Telegram и пр.) ========== */
const TELEGRAM_BOT_TOKEN = '8182609479:AAG7AqcB8naX92u2XlHkxwp9R9IBhEhfoW0';
const TELEGRAM_CHAT_ID  = '8492577684';
const TELEGRAM_WEBHOOK_URL = ''; // если есть сервер — лучше указать его (рекомендуется)

/* ========== DATA (каталог) ========== */
// (оставил как у тебя — не менял данные)
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

/* ========== Expose cart for legacy pages (fix `cart is not defined`) ========== */
window.getCart = () => cart;
window._syncCartToWindow = () => { try { window.cart = cart; } catch(e){} };
window.cart = cart;

/* ========== DOM refs (index.html) */ 
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

/* categories list and active */
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

function productMatchesFilter(p){
  const q = (searchInput && searchInput.value || '').trim().toLowerCase();

  if(activeCategory !== 'Все'){
    if(activeCategory === 'Скидки' && !(p.discount > 0)) return false;

    if(['Женщинам','Девочкам','Мальчикам'].includes(activeCategory)){
      if(p.category !== activeCategory) return false;
    }

    if(['Рейтинг','Стандартные','Латинские','Аксессуары'].includes(activeCategory)){
      if((p.collection || '').toLowerCase() !== activeCategory.toLowerCase()) return false;
    }
  }

  if(q){
    const hay = (((p.title || '') + ' ' + (p.category || '') + ' ' + (p.type || '') + ' ' + (p.collection || '')).toLowerCase());
    if(!hay.includes(q)) return false;
  }

  return true;
}

function createProductCard(p){
  const div = document.createElement('div');
  div.className = 'card';
  div.dataset.id = p.id;
  if(p.category) div.dataset.category = p.category;
  if(p.collection) div.dataset.collection = p.collection;
  if(p.discount && p.discount > 0) div.dataset.discount = 'true';

  div.innerHTML = `
    <div style="position:relative">
      <div class="img-box">
        <img src="${p.img}" alt="${escapeHtml(p.title)}" style="max-height:100%;max-width:100%;object-fit:contain;border-radius:10px">
        ${p.isNew ? '<div class="new-label">NEW</div>' : ''}
      </div>
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

  const maxUse = Math.min(user.cashback || 0, total);
  if(window.appliedCashback > maxUse) window.appliedCashback = maxUse;
  if(cashbackUseInput) cashbackUseInput.value = window.appliedCashback > 0 ? window.appliedCashback : '';
  if(cashbackAvailableEl) cashbackAvailableEl.textContent = formatSum(user.cashback || 0);
}

/* ========== CART OPERATIONS ========== */
function syncCartAndLS(){
  writeJSON(LS_CART, cart);
  window._syncCartToWindow();
}
function addToCart(id){
  const product = PRODUCTS.find(p=>p.id===id); if(!product) return;
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({ id:product.id, title:product.title, price:product.price, discount:product.discount, qty:1 });
  syncCartAndLS();
  showCartDrawer(true);
  renderAll();
}
function removeFromCart(id){
  cart = cart.filter(i => i.id !== id);
  syncCartAndLS();
  renderAll();
}
function changeQty(id, delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + delta);
  syncCartAndLS();
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

    document.getElementById('loginBtn').onclick = async () => {
      const idVal = document.getElementById('loginId').value.trim();
      const phoneVal = document.getElementById('loginPhone').value.trim();
      const nameVal = document.getElementById('loginName').value.trim();

      // сначала локально
      const ordersLS = readJSON(LS_ORDERS, []);
      let found = null;
      if(idVal) found = ordersLS.find(o => String(o.id) === idVal);
      else if(phoneVal) found = ordersLS.find(o => o.phone === phoneVal);

      // если не нашли локально, попробуем Firestore (если id указан)
      if(!found && idVal) {
        try {
          const remote = await fetchOrderFromFirestore(idVal);
          if(remote) {
            _saveOrderInternal(Object.assign({}, remote));
            found = remote;
            console.info('Найден заказ в Firestore и сохранён в LS:', remote.id);
          }
        } catch(e) {
          console.warn('firestore lookup failed', e);
        }
      }

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
  const orders = readJSON(LS_ORDERS, []);
  const idx = orders.findIndex(o => o.id === order.id);
  if(idx >= 0) orders[idx] = order;
  else orders.push(order);
  writeJSON(LS_ORDERS, orders);
}
function getOrders(){ return readJSON(LS_ORDERS, []); }
function findOrderById(id){ const orders = readJSON(LS_ORDERS, []); return orders.find(o => String(o.id) === String(id)); }

/* ========== Firestore helpers (чтение/запись) ========== */
async function fetchOrderFromFirestore(id){
  if(!id) return null;
  try{
    const snap = await getDoc(doc(db, 'orders', String(id)));
    if(!snap.exists()) return null;
    const data = snap.data();
    if(data.updated_at && data.updated_at.toDate) data.updated_at = data.updated_at.toDate().toISOString();
    if(data.created_at && data.created_at.toDate) data.created_at = data.created_at.toDate().toISOString();
    data.id = data.id || id;
    return data;
  } catch(e){
    console.error('Firestore fetch error', e);
    return null;
  }
}

async function fetchOrdersFromFirestore(){
  try{
    const q = query(collection(db,'orders'), orderBy('created_at','desc'));
    const snap = await getDocs(q);
    const out = [];
    snap.forEach(d => {
      const obj = d.data();
      obj.id = obj.id || d.id;
      out.push(obj);
    });
    return out;
  } catch(e){
    console.error('Firestore fetchOrders error', e);
    return [];
  }
}

async function writeOrderToFirestore(order){
  try{
    const id = String(order.id || generateOrderId());
    const payload = Object.assign({}, order, {
      id,
      updated_at: serverTimestamp(),
      created_at: order.created_at ? order.created_at : serverTimestamp()
    });
    await setDoc(doc(db,'orders', id), payload, { merge: true });
    return { ok:true };
  }catch(e){
    console.error('Firestore write error', e);
    return { ok:false, error: e.message || String(e) };
  }
}

/* ========== Telegram (send message) ========== */
async function sendTelegramMessage(text, parseMode = 'HTML') {
  try {
    console.info('sendTelegramMessage: trying to send...', { webhook: !!TELEGRAM_WEBHOOK_URL });
    if (TELEGRAM_WEBHOOK_URL && TELEGRAM_WEBHOOK_URL.trim() !== '') {
      const res = await fetch(TELEGRAM_WEBHOOK_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ text })
      });
      const txt = await res.text();
      console.info('Webhook response:', res.status, txt);
      return res.ok;
    }

    // direct call to Telegram API (may be blocked by CORS in browser)
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: parseMode
      })
    });

    let data;
    try { data = await res.json(); } catch(e){ data = {ok:false, error:'invalid json', raw: await res.text()}; }
    console.log('Telegram API response', data);

    if(!res.ok || data.ok === false){
      console.error('Telegram send failed', data);
      // if CORS blocked, fetch throws; if telegram returns error -> log code
      return false;
    }
    return true;
  } catch (err) {
    console.error('Telegram send exception', err);
    // возможно CORS / network - логируем для диагностики
    return false;
  }
}

/* ========== Public API ========== */
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

    // Сохраняем локально (чтобы клиент мог потом войти)
    saveOrder(order);

    // Пишем в Firestore (ненавязчиво, но ждём результат)
    try {
      const wf = await writeOrderToFirestore(order);
      if(!wf.ok) console.warn('Firestore write returned error', wf);
      else console.info('Order written to Firestore:', order.id);
    } catch(e) {
      console.warn('writeOrderToFirestore failed:', e);
    }

    // notify admin in telegram (await, чтобы точно знать результат)
    let itemsText = order.items.map(it => `• ${it.title} × ${it.qty} — ${ (Math.round((it.price || 0) * (1 - (it.discount||0)/100) * (it.qty||1))).toLocaleString() } сум`).join('\n');
    const message = `<b>Новый заказ #${order.id}</b>\nИмя: ${order.name}\nТел: ${order.phone}\nГород: ${order.city}\n\n${itemsText}\n\nИтого: ${order.total.toLocaleString()} сум\nСтатус: ${order.status}`;

    const tgOk = await sendTelegramMessage(message, 'HTML');
    if(!tgOk) {
      console.warn('Telegram send returned false — возможно CORS или неверный токен/chat_id. Проверь консоль network и вывод выше.');
    } else {
      console.info('Telegram notification sent for order', order.id);
    }

    return { ok:true, id };
  } catch (e){
    console.error(e);
    return { ok:false, error: e.message || String(e) };
  }
};

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

window.getOrders = function(){ return getOrders(); };

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
    writeJSON(LS_CART, cart);
    window._syncCartToWindow();
    window.location.href = 'checkout.html';
  });
}

/* ========== Apply cashback ========== */
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

/* ========== Delegated handlers ========== */
document.addEventListener('click', (e)=>{
  const el = e.target;
  if(el.matches('.card .btn.cart')) { const id = +el.getAttribute('data-id'); addToCart(id); }
  if(el.matches('.card .btn.fav')) { const id = +el.getAttribute('data-id'); toggleFav(id); renderAll(); }
});

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
  // After render sync global cart reference (for legacy pages)
  window._syncCartToWindow();
}
renderAll();

/* ========== Firestore Auth state sync for admin.html usage ========== */
onAuthStateChanged(auth, (u)=>{
  console.log('Auth state changed (admin):', u ? u.email : null);
});

/* ========== expose helpers for admin.html and debugging ========== */
window._dm = {
  getOrders,
  findOrderById,
  saveOrder,
  placeOrder: window.placeOrder,
  updateOrderStatus: window.updateOrderStatus,
  fetchOrderFromFirestore,
  fetchOrdersFromFirestore,
  writeOrderToFirestore,
  auth,
  signInWithPopupFn: async ()=> signInWithPopup(auth, provider),
  signOutFn: async ()=> signOut(auth)
};
