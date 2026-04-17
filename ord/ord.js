const WHATSAPP_NUMBER = '201558143429'; 

const CATEGORIES = [
  { label: 'الكل',    value: 'all'     },
  { label: 'كشري',   value: 'كشري'    },
  { label: 'بيتزا',  value: 'بيتزا'   },
  { label: 'طواجن',  value: 'طواجن'   },
];

const PRODUCTS = [
  {
    name:     'كشري السلطان',
    category: 'كشري',
    price:    null,
    s:        '30 ج.م',
    m:        '40 ج.م',
    l:        '55 ج.م',
    mkon:     'زر + مكرونة + عدس + صلصة',
  },
  {
    name:     'كشري عادي',
    category: 'كشري',
    price:    '25 ج.م',
    s:        null,
    m:        null,
    l:        null,
    mkon:     'مكرونة + عدس + صلصة',
  },
  {
    name:     'بيتزا مارغريتا',
    category: 'بيتزا',
    price:    null,
    s:        '60 ج.م',
    m:        '90 ج.م',
    l:        '130 ج.م',
    mkon:     'جبن موزاريلا + طماطم + ريحان',
  },
  {
    name:     'بيتزا بيبروني',
    category: 'بيتزا',
    price:    null,
    s:        '70 ج.م',
    m:        '100 ج.م',
    l:        '145 ج.م',
    mkon:     'بيبروني + جبن + صلصة طماطم',
  },
  {
    name:     'طاجن فراخ',
    category: 'طواجن',
    price:    '65 ج.م',
    s:        null,
    m:        null,
    l:        null,
    mkon:     'فراخ + بصل + طماطم + توابل',
  },
  {
    name:     'طاجن لحمة',
    category: 'طواجن',
    price:    '85 ج.م',
    s:        null,
    m:        null,
    l:        null,
    mkon:     'لحمة + خضار + بهارات',
  },
];


let currentCategory = 'all';
let cart = [];  // [{product, selectedSize}]


function hasSizes(p) {
  return p.s !== null || p.m !== null || p.l !== null;
}


function getSizes(p) {
  const pairs = [];
  if (p.s !== null) pairs.push({ label: 'S', price: p.s });
  if (p.m !== null) pairs.push({ label: 'M', price: p.m });
  if (p.l !== null) pairs.push({ label: 'L', price: p.l });
  return pairs;
}


function itemPrice(entry) {
  if (!hasSizes(entry.product)) return entry.product.price;
  if (!entry.selectedSize) return '—';
  const map = { S: entry.product.s, M: entry.product.m, L: entry.product.l };
  return map[entry.selectedSize] || '—';
}

function renderCategories() {
  const nav = document.getElementById('categoriesNav');
  nav.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (cat.value === currentCategory ? ' active' : '');
    btn.textContent = cat.label;
    btn.onclick = () => {
      currentCategory = cat.value;
      renderCategories();
      renderProducts();
    };
    nav.appendChild(btn);
  });
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';


  let list = currentCategory === 'all'
    ? [...PRODUCTS].sort(() => Math.random() - 0.5)
    : PRODUCTS.filter(p => p.category === currentCategory);

  if (list.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 0;grid-column:1/-1">لا توجد منتجات في هذه الفئة</p>';
    return;
  }

  list.forEach((product, idx) => {
    const card = document.createElement('div');
    card.className = 'product-card';


    card.innerHTML += `<span class="product-category-tag">${product.category}</span>`;


    card.innerHTML += `<div class="product-name">${product.name}</div>`;


    if (product.mkon) {
      card.innerHTML += `<div class="product-mkon">🧂 ${product.mkon}</div>`;
    }


    if (hasSizes(product)) {
      const sizes = getSizes(product);

      const sizeRow = document.createElement('div');
      sizeRow.className = 'sizes-row';
      sizes.forEach(sz => {
        const chip = document.createElement('div');
        chip.className = 'size-chip';
        chip.dataset.size = sz.label;
        chip.innerHTML = `<span class="size-label">${sz.label}</span><span class="size-price">${sz.price}</span>`;
        sizeRow.appendChild(chip);
      });
      card.appendChild(sizeRow);
    } else {
      card.innerHTML += `<div class="single-price">${product.price}</div>`;
    }


    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.textContent = '+ أضف للسلة';
    addBtn.onclick = () => addToCart(product);
    card.appendChild(addBtn);

    grid.appendChild(card);
  });
}


function addToCart(product) {
  cart.push({ product, selectedSize: null });
  updateCartFloat();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCartFloat();
  renderCartModal();
}

function setSize(cartIdx, size) {
  cart[cartIdx].selectedSize = size;
  renderCartModal();
}

function updateCartFloat() {
  const btn = document.getElementById('cartFloat');
  const cnt = document.getElementById('cartCount');
  if (cart.length === 0) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'flex';
    cnt.textContent = cart.length;
  }
}

function openCart() {
  document.getElementById('cartModal').style.display = 'flex';
  renderCartModal();
}

function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

function renderCartModal() {
  const container = document.getElementById('cartItems');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">السلة فاضية</p>';
    return;
  }

  cart.forEach((entry, idx) => {
    const div = document.createElement('div');
    div.className = 'cart-item';

    
    div.innerHTML = `
      <div class="cart-item-header">
        <span class="cart-item-name">${entry.product.name}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${idx})">🗑</button>
      </div>
      <div class="cart-item-cat">📂 ${entry.product.category}</div>
    `;

    if (hasSizes(entry.product)) {
      const sizes = getSizes(entry.product);
      const row = document.createElement('div');
      row.className = 'cart-size-row';
      sizes.forEach(sz => {
        const btn = document.createElement('button');
        btn.className = 'cart-size-btn' + (entry.selectedSize === sz.label ? ' sel' : '');
        btn.textContent = `${sz.label} — ${sz.price}`;
        btn.onclick = () => setSize(idx, sz.label);
        row.appendChild(btn);
      });
      div.appendChild(row);

      const priceDiv = document.createElement('div');
      priceDiv.className = 'cart-item-price';
      priceDiv.textContent = entry.selectedSize
        ? `السعر: ${itemPrice(entry)}`
        : 'اختار الحجم';
      div.appendChild(priceDiv);
    } else {
      div.innerHTML += `<div class="cart-item-price">السعر: ${entry.product.price}</div>`;
    }

    container.appendChild(div);
  });
}


function confirmOrder() {
  const name    = document.getElementById('clientName').value.trim();
  const address = document.getElementById('clientAddress').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked')?.value || 'نقدي';


  if (!name) {
    alert('من فضلك اكتب اسمك ');
    document.getElementById('clientName').focus();
    return;
  }
  if (!address) {
    alert('من فضلك اكتب عنوانك ');
    document.getElementById('clientAddress').focus();
    return;
  }


  for (let i = 0; i < cart.length; i++) {
    const entry = cart[i];
    if (hasSizes(entry.product) && !entry.selectedSize) {
      alert(`اختار الحجم لـ "${entry.product.name}" الأول `);
      return;
    }
  }


  let msg = `سلام عليكم\n`;
  msg += `اسمي : ${name}\n`;
  msg += `عنواني : ${address}\n`;
  msg += `طريقة الدفع : ${payment}\n`;
  msg += `طلبي :\n`;

  cart.forEach((entry, i) => {
    const num     = i + 1;
    const pName   = entry.product.name;
    const pCat    = entry.product.category;
    const pSize   = hasSizes(entry.product) ? (entry.selectedSize || '—') : 'غير محدد';
    const pPrice  = itemPrice(entry);

    msg += `\nعنصر ${num} :\n`;
    msg += `اسمه : ${pName}\n`;
    msg += `سعره : ${pPrice}\n`;


    if (hasSizes(entry.product)) {
      msg += `حجمه : ${pSize}\n`;
    }

    msg += `نوعه : ${pCat}\n`;
  });


  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
}


renderCategories();
renderProducts();