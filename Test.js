// ==================== Firebase ====================
const firebaseConfig = {
  apiKey: "AIzaSyCMyF3ow0w-KoXGNbgcG6ZsydPFENj8h0E",
  authDomain: "soama-23d50.firebaseapp.com",
  projectId: "soama-23d50",
  storageBucket: "soama-23d50.firebasestorage.app",
  messagingSenderId: "841769303753",
  appId: "1:841769303753:web:c2b3389c3ac119c68f1718"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ==================== Products ====================
const products = [
  { id: 1, name: "ប្រហិតឆឹង", price: 1.50, image: "IMG/Brorhit.jpg" },
  { id: 2, name: "Coca-Cola (Can)", price: 1.50, image: "IMG/coca-cola.png" },
  { id: 3, name: "Angkor Beer (Can)", price: 2.00, image: "IMG/angkor-beer.png" },
  { id: 4, name: "Fresh Coconut Water", price: 2.50, image: "IMG/coconut-water.png" },
  { id: 5, name: "Sugarcane Juice", price: 1.80, image: "IMG/sugarcane-juice.png" },
  { id: 6, name: "Nom Ansom", price: 1.20, image: "IMG/nom-ansom.png" },
  { id: 7, name: "Num Krouk", price: 1.00, image: "IMG/num-krouk.png" },
  { id: 8, name: "Fried Banana Chips", price: 1.50, image: "IMG/banana-chips.png" },
  { id: 9, name: "Dried Mango Slices", price: 2.20, image: "IMG/dried-mango.png" },
  { id: 10, name: "Cambodian Iced Coffee", price: 2.00, image: "IMG/iced-coffee.png" },
  { id: 11, name: "Taro Chips", price: 1.80, image: "IMG/taro-chips.png" },
  { id: 12, name: "Red Bull", price: 1.70, image: "IMG/red-bull.png" }
];

let cart = JSON.parse(localStorage.getItem("saomaCart")) || [];
let lastOrder = null;

// ==================== Cart Functions ====================
function saveCart() {
  localStorage.setItem("saomaCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

function addToCart(id) {
  const existing = cart.find(i => i.id === id);
  if (existing) existing.quantity++;
  else cart.push({ id, quantity: 1 });
  
  saveCart();
  alert(products.find(p => p.id === id).name + " added to cart!");
}

function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
    saveCart();
    renderCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

// ==================== Render Functions ====================
function renderFeatured() {
  const container = document.getElementById("featured-grid");
  container.innerHTML = "";
  products.slice(0, 4).forEach(p => createProductCard(p, container));
}

function renderProducts() {
  const container = document.getElementById("products-grid");
  container.innerHTML = "";
  products.forEach(p => createProductCard(p, container));
}

function createProductCard(p, container) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${p.image}" alt="${p.name}" loading="lazy">
    <div class="product-info">
      <h3>${p.name}</h3>
      <div class="price">$${p.price.toFixed(2)}</div>
      <button class="btn add-to-cart" data-id="${p.id}">Add to Cart</button>
    </div>`;
  container.appendChild(card);
}

function renderCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty 😕</p>
        <p>Let's add some delicious items from SAOMA!</p>
        <button onclick="goHome()" class="btn" style="margin-top: 2rem;">
          Browse Products
        </button>
      </div>`;
    document.getElementById("cart-total").textContent = "0.00";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    const prod = products.find(p => p.id === item.id);
    if (!prod) return;
    total += prod.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.style.transitionDelay = `${index * 80}ms`;
    div.innerHTML = `
      <div>
        <strong>${prod.name}</strong>
        <div class="price-info">$${prod.price.toFixed(2)} × ${item.quantity}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 15px;">
        <div class="quantity-control">
          <button onclick="changeQuantity(${item.id}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
        <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
      </div>`;
    container.appendChild(div);
  });

  document.getElementById("cart-total").textContent = total.toFixed(2);
}

function renderSuccess(order) {
  let html = `<strong>Customer:</strong> ${order.name}<br>
              <strong>Phone:</strong> ${order.phone}<br>`;
  if (order.note) html += `<strong>Note:</strong> ${order.note}<br><br>`;
  
  html += `<strong>Items:</strong><br>`;
  order.cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) html += `• ${p.name} × ${item.quantity} = $${(p.price * item.quantity).toFixed(2)}<br>`;
  });
  
  html += `<br><strong>Total:</strong> $${order.total.toFixed(2)}`;
  document.getElementById("success-details").innerHTML = html;
}

// ==================== Fade Animation Helper ====================
function triggerFadeIn() {
  // Product cards fade in with stagger
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${80 + index * 70}ms`;
    card.classList.add("visible");
  });

  // Cart items fade in
  const cartItems = document.querySelectorAll(".cart-item");
  cartItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 80}ms`;
    item.classList.add("visible");
  });

  // Success message
  const successMsg = document.querySelector(".success-message");
  if (successMsg) successMsg.classList.add("visible");
}

// ==================== Page Navigation ====================
function showPage(pageId) {
  // Hide all sections and reset animations
  document.querySelectorAll("main > section").forEach(section => {
    section.classList.add("hidden");
    const cards = section.querySelectorAll(".product-card, .cart-item");
    cards.forEach(card => card.classList.remove("visible"));
  });

  // Show target section
  const targetSection = document.getElementById(pageId);
  if (targetSection) {
    targetSection.classList.remove("hidden");
    
    // Trigger fade-in animations
    setTimeout(triggerFadeIn, 50);
  }

  if (pageId === "cart") renderCart();
}

function goHome() {
  showPage("home");
  cart = [];
  saveCart();
}

function requireLogin(callback) {
  if (auth.currentUser) {
    callback();
  } else {
    alert("Please login with Gmail first.");
    document.getElementById("login-modal").style.display = "flex";
  }
}

// ==================== Google Login ====================
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => closeLoginModal())
    .catch(err => alert("Login failed: " + err.message));
}

function closeLoginModal() {
  document.getElementById("login-modal").style.display = "none";
}

function updateUserUI(user) {
  const loginBtn = document.getElementById("login-btn");
  const userInfo = document.getElementById("user-info");

  if (user) {
    loginBtn.classList.add("hidden");
    userInfo.classList.remove("hidden");
    userInfo.innerHTML = `👤 ${user.displayName || user.email} 
      <button onclick="auth.signOut()" class="logout-btn">Logout</button>`;
  } else {
    loginBtn.classList.remove("hidden");
    userInfo.classList.add("hidden");
  }
}

// ==================== Confirm Payment ====================
async function confirmPayment() {
  const file = document.getElementById("payment-proof").files[0];
  if (!file) return alert("Please upload payment proof first.");
  if (!lastOrder) return alert("Order data missing.");

  const BOT_TOKEN = "8156676939:AAE_1le6aneeHfbq__Ss4fb0HG3ejUiQIA4";
  const CHAT_ID = "8375512408";

  try {
    const user = auth.currentUser;
    const userLine = user ? `\n👤 Logged in: ${user.email}` : "";

    const itemsText = lastOrder.cart.map(item => {
      const p = products.find(pr => pr.id === item.id);
      return `• ${p ? p.name : "Unknown"} × ${item.quantity} = $${(p.price * item.quantity).toFixed(2)}`;
    }).join("\n");

    const message = `🛒 <b>New SAOMA Order</b>${userLine}\n\nCustomer: ${lastOrder.name}\nPhone: ${lastOrder.phone}\n${lastOrder.note ? "Note: " + lastOrder.note + "\n" : ""}\n${itemsText}\n\n💰 Total: $${lastOrder.total.toFixed(2)}\n💳 Payment: ABA QR ✅`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "HTML" })
    });

    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("photo", file);
    formData.append("caption", `Payment Proof - ${lastOrder.name} - $${lastOrder.total.toFixed(2)}`);

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: formData
    });

    alert("✅ Order and payment proof sent successfully!");
    closeQRModal();
    cart = [];
    saveCart();
    showPage("success");
    renderSuccess(lastOrder);

  } catch (err) {
    console.error(err);
    alert("Failed to send. Please send the screenshot manually to admin.");
  }
}

function closeQRModal() {
  document.getElementById("qr-modal").style.display = "none";
  document.getElementById("payment-proof").value = "";
  document.getElementById("confirm-payment-btn").disabled = true;
}

// ==================== Initialize ====================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderFeatured();
  renderProducts();

  // Add to Cart
  document.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-cart")) {
      addToCart(parseInt(e.target.dataset.id));
    }
  });

  // Navigation
  document.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      showPage(link.getAttribute("href").substring(1));
    });
  });

  // Cart & Checkout
  document.getElementById("cart-link").addEventListener("click", e => {
    e.preventDefault();
    requireLogin(() => showPage("cart"));
  });

  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    requireLogin(() => showPage("checkout"));
  });

  // Order Form Submit
  document.getElementById("order-form").addEventListener("submit", e => {
    e.preventDefault();
    requireLogin(() => {
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const note = document.getElementById("note").value.trim();

      if (!name || !phone) return alert("Name and phone are required.");

      const total = cart.reduce((sum, item) => {
        const p = products.find(pr => pr.id === item.id);
        return sum + (p ? p.price * item.quantity : 0);
      }, 0);

      lastOrder = { name, phone, note, cart: JSON.parse(JSON.stringify(cart)), total };

      document.getElementById("qr-amount").textContent = `Total: $${total.toFixed(2)}`;
      document.getElementById("qr-modal").style.display = "flex";
    });
  });

  // Payment Proof
  document.getElementById("payment-proof").addEventListener("change", () => {
    document.getElementById("confirm-payment-btn").disabled = false;
  });

  document.getElementById("confirm-payment-btn").addEventListener("click", confirmPayment);

  // Login
  document.getElementById("login-btn").addEventListener("click", () => {
    document.getElementById("login-modal").style.display = "flex";
  });

  auth.onAuthStateChanged(updateUserUI);
});