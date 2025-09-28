// === CART.JS ===

// Elemen-elemen global (pastikan ada di HTML)
const cartBtn = document.querySelector("#lg-bag a");
const cartDropdown = document.getElementById("cartDropdown");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// Badge jumlah item
const badge = document.createElement("span");
badge.id = "cartBadge";
if (cartBtn) {
  cartBtn.style.position = "relative";
  cartBtn.appendChild(badge);
}

let cart = [];
const defaultPrice = 130000;

// Load dari localStorage saat pertama kali
if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  renderCart();
}

// Tambah produk ke keranjang (dipanggil dari tombol "Masukan ke keranjang")
// Sekarang ada parameter `name`
window.addToCart = function(imgSrc, size, qty, price = defaultPrice, name = "Produk") {
  if (size === "Select Size") {
    alert("Silakan pilih ukuran!");
    return;
  }
  if (qty <= 0) {
    alert("Jumlah minimal 1");
    return;
  }

  const existing = cart.find(item => item.size === size && item.img === imgSrc && item.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ img: imgSrc, size, qty, price, name });
  }

  renderCart();
  saveCart();
};

// Toggle keranjang
if (cartBtn) {
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartDropdown.style.display = cartDropdown.style.display === "block" ? "none" : "block";
  });
}

// Render isi keranjang
function renderCart() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";
  let total = 0;
  let totalQty = 0;

  cart.forEach((item, index) => {
    const subtotal = item.qty * item.price;
    total += subtotal;
    totalQty += item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.img}" alt="produk">
      <div class="cart-info">
        <strong>${item.name}</strong><br>
        <span>Rp${item.price.toLocaleString()}</span><br>
        <select onchange="updateSize(${index}, this.value)">
          <option ${item.size==="Small"?"selected":""}>Small</option>
          <option ${item.size==="Medium"?"selected":""}>Medium</option>
          <option ${item.size==="Large"?"selected":""}>Large</option>
          <option ${item.size==="XL"?"selected":""}>XL</option>
          <option ${item.size==="XXL"?"selected":""}>XXL</option>
        </select>
        <input type="number" min="1" value="${item.qty}" onchange="updateQty(${index}, this.value)">
      </div>
      <div>
        <p>Rp${subtotal.toLocaleString()}</p>
        <button class="cart-remove" onclick="removeItem(${index})">Hapus</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  if (cartTotal) cartTotal.textContent = "Total: Rp" + total.toLocaleString();
  badge.style.display = totalQty > 0 ? "inline-block" : "none";
  badge.textContent = totalQty;
}

// Simpan ke localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update size
window.updateSize = (index, newSize) => {
  cart[index].size = newSize;
  saveCart();
};

// Update qty
window.updateQty = (index, newQty) => {
  const qty = parseInt(newQty);
  if (qty <= 0) {
    removeItem(index);
  } else {
    cart[index].qty = qty;
  }
  renderCart();
  saveCart();
};

// Hapus item
window.removeItem = (index) => {
  cart.splice(index, 1);
  renderCart();
  saveCart();
};

// Checkout
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
    } else {
      // Tampilkan ringkasan checkout dengan nama produk
      let summary = "Checkout berhasil!\n\nRingkasan belanja:\n";
      cart.forEach(item => {
        summary += `- ${item.name} (${item.size}) x${item.qty} = Rp${(item.qty * item.price).toLocaleString()}\n`;
      });
      summary += `\nTotal: Rp${cart.reduce((sum, i) => sum + i.qty * i.price, 0).toLocaleString()}`;
      
      alert(summary);
      
      cart = [];
      renderCart();
      saveCart();
      cartDropdown.style.display = "none";
    }
  });
}
