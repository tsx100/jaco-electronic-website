const products = [
    { id: 1, name: "Smart Double Door Refrigerator 350L", category: "refrigerator", icon: "🧊", price: 450000, oldPrice: 520000, rating: 4.8, reviews: 124, badge: "sale" },
    { id: 2, name: "Inverter Split AC 1.5HP", category: "ac", icon: "❄️", price: 320000, oldPrice: 380000, rating: 4.9, reviews: 89, badge: "sale" },
    { id: 3, name: "55-inch 4K Ultra HD Smart TV", category: "tv", icon: "📺", price: 280000, oldPrice: 340000, rating: 4.7, reviews: 156, badge: "sale" },
    { id: 4, name: "Front Load Washing Machine 8kg", category: "washing", icon: "🌀", price: 240000, oldPrice: 290000, rating: 4.6, reviews: 72, badge: "sale" },
    { id: 5, name: "Silent Generator 5.5KVA", category: "generator", icon: "⚡", price: 580000, oldPrice: 650000, rating: 4.8, reviews: 45, badge: "sale" },
    { id: 6, name: "Digital Microwave Oven 30L", category: "microwave", icon: "🍳", price: 95000, oldPrice: 120000, rating: 4.5, reviews: 98, badge: "sale" },
    { id: 7, name: "Standing Fan 18-inch Remote", category: "fan", icon: "💨", price: 28000, oldPrice: 35000, rating: 4.4, reviews: 210, badge: "sale" },
    { id: 8, name: "Bluetooth Home Theater System", category: "audio", icon: "🔊", price: 180000, oldPrice: 220000, rating: 4.6, reviews: 67, badge: "sale" },
    { id: 9, name: "Mini Bar Fridge 90L", category: "refrigerator", icon: "🧊", price: 120000, oldPrice: null, rating: 4.3, reviews: 34, badge: "new" },
    { id: 10, name: "Portable AC 1HP", category: "ac", icon: "❄️", price: 190000, oldPrice: null, rating: 4.5, reviews: 28, badge: "new" },
    { id: 11, name: "43-inch Full HD LED TV", category: "tv", icon: "📺", price: 145000, oldPrice: 175000, rating: 4.4, reviews: 112, badge: "sale" },
    { id: 12, name: "Top Load Washing Machine 7kg", category: "washing", icon: "🌀", price: 165000, oldPrice: 200000, rating: 4.3, reviews: 54, badge: "sale" },
    { id: 13, name: "Heavy Duty Generator 10KVA", category: "generator", icon: "⚡", price: 980000, oldPrice: 1100000, rating: 4.9, reviews: 23, badge: "sale" },
    { id: 14, name: "Electric Oven 40L with Grill", category: "microwave", icon: "🍳", price: 75000, oldPrice: 95000, rating: 4.4, reviews: 41, badge: "sale" },
    { id: 15, name: "Rechargeable Table Fan", category: "fan", icon: "💨", price: 18000, oldPrice: 25000, rating: 4.2, reviews: 187, badge: "sale" },
    { id: 16, name: "Wireless Party Speaker", category: "audio", icon: "🔊", price: 65000, oldPrice: null, rating: 4.5, reviews: 52, badge: "new" },
    { id: 17, name: "Side-by-Side Refrigerator 550L", category: "refrigerator", icon: "🧊", price: 680000, oldPrice: 780000, rating: 4.9, reviews: 38, badge: "sale" },
    { id: 18, name: "Cassette AC 2HP Ceiling", category: "ac", icon: "❄️", price: 420000, oldPrice: 490000, rating: 4.7, reviews: 19, badge: "sale" },
    { id: 19, name: "65-inch QLED Smart TV", category: "tv", icon: "📺", price: 520000, oldPrice: null, rating: 4.8, reviews: 31, badge: "new" },
    { id: 20, name: "Washer Dryer Combo 10kg", category: "washing", icon: "🌀", price: 480000, oldPrice: 560000, rating: 4.7, reviews: 26, badge: "sale" },
];

const categoryLabels = {
    refrigerator: "Refrigerators", ac: "Air Conditioners", tv: "Televisions",
    washing: "Washing Machines", generator: "Generators", microwave: "Kitchen Appliances",
    fan: "Fans & Cooling", audio: "Audio Systems",
};

function formatPrice(price) { return "₦" + price.toLocaleString("en-NG"); }

function renderProducts(filter = "all") {
    const grid = document.getElementById("productGrid");
    const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
    grid.innerHTML = filtered.map(p => `
        <div class="product-card fade-in" data-category="${p.category}">
            <div class="product-image">
                ${p.badge ? `<span class="product-badge ${p.badge}">${p.badge === "sale" ? "SALE" : "NEW"}</span>` : ""}
                ${p.icon}
            </div>
            <div class="product-info">
                <div class="product-category">${categoryLabels[p.category]}</div>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-rating">
                    <span class="product-stars">${"★".repeat(Math.floor(p.rating))}${p.rating % 1 >= 0.5 ? "★" : ""}</span>
                    <span>${p.rating} (${p.reviews})</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">${formatPrice(p.price)}</span>
                    ${p.oldPrice ? `<span class="product-old-price">${formatPrice(p.oldPrice)}</span>` : ""}
                </div>
                <button class="add-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join("");
    observeFadeIn();
}

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderProducts(btn.dataset.filter);
    });
});

document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", (e) => {
        const filter = card.dataset.filter;
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add("active");
        renderProducts(filter);
    });
});

let cart = [];

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) { existing.qty++; } else { cart.push({ ...product, qty: 1 }); }
    updateCart();
    openCart();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) { cart = cart.filter(item => item.id !== id); updateCart(); }

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) { removeFromCart(id); } else { updateCart(); }
    }
}

function updateCart() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    document.getElementById("cartCount").textContent = count;
    document.getElementById("cartItemCount").textContent = count;
    document.getElementById("cartTotal").textContent = formatPrice(total);
    const cartBody = document.getElementById("cartBody");
    const cartFooter = document.getElementById("cartFooter");
    if (cart.length === 0) {
        cartBody.innerHTML = `<div class="cart-empty" id="cartEmpty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p><a href="#products" class="btn btn-small" id="cartShopBtn">Start Shopping</a></div>`;
        cartFooter.style.display = "none";
    } else {
        cartBody.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-icon">${item.icon}</div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                        <span class="cart-item-qty">${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑</button>
                    </div>
                </div>
            </div>
        `).join("");
        cartFooter.style.display = "block";
    }
}

function openCart() { document.getElementById("cartDrawer").classList.add("open"); document.getElementById("cartOverlay").classList.add("open"); }
function closeCart() { document.getElementById("cartDrawer").classList.remove("open"); document.getElementById("cartOverlay").classList.remove("open"); }

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) return;
    const message = cart.map(i => `• ${i.name} x${i.qty} - ${formatPrice(i.price * i.qty)}`).join("%0A");
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const text = `Hello Jaco Electrical! I'd like to order:%0A%0A${message}%0A%0ATotal: ${formatPrice(total)}`;
    window.open(`https://wa.me/2348000000000?text=${text}`, "_blank");
});

function showToast(message) {
    const toast = document.createElement("div");
    toast.style.cssText = `position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #0a1628; color: white; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; z-index: 3000; box-shadow: 0 8px 24px rgba(0,0,0,0.2); opacity: 0; transition: all 0.3s ease;`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "1"; toast.style.transform = "translateX(-50%) translateY(-8px)"; }, 10);
    setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateX(-50%) translateY(8px)"; setTimeout(() => toast.remove(), 300); }, 2500);
}

window.addEventListener("scroll", () => {
    document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 20);
});

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
hamburger.addEventListener("click", () => { navMenu.classList.toggle("open"); });
navMenu.querySelectorAll("a").forEach(link => { link.addEventListener("click", () => navMenu.classList.remove("open")); });

function animateCounter(el, target) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) { el.textContent = target.toLocaleString() + "+"; clearInterval(timer); }
        else { el.textContent = Math.floor(current).toLocaleString(); }
    }, 20);
}

function observeFadeIn() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll(".stat-number").forEach(el => { animateCounter(el, parseInt(el.dataset.target)); });
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector(".hero-stats");
if (heroStats) statsObserver.observe(heroStats);

document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const success = document.getElementById("formSuccess");
    success.classList.add("show");
    e.target.reset();
    setTimeout(() => success.classList.remove("show"), 5000);
});

document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Subscribed! Thank you for joining our newsletter.");
    e.target.reset();
});

renderProducts();
observeFadeIn();
