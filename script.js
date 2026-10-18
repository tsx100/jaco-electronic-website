let products = [];
let settings = {};

async function loadData() {
    try {
        const [settingsRes, productsRes] = await Promise.all([
            fetch('settings.json'),
            fetch('products.json')
        ]);
        settings = await settingsRes.json();
        const productsData = await productsRes.json();
        products = productsData.products || [];
        applySettings();
        renderProducts();
    } catch (err) {
        console.error('Error loading data:', err);
        renderProducts();
    }
}

function applySettings() {
    document.getElementById('businessName').textContent = settings.businessName || 'JACO';
    document.getElementById('tagline').textContent = settings.tagline || 'Electrical Electronics';
    document.getElementById('footerBusinessName').textContent = settings.businessName || 'JACO';
    document.getElementById('footerTagline').textContent = settings.tagline || 'Electrical Electronics';
    if (settings.announcementText) {
        document.getElementById('announcementText').innerHTML = settings.announcementText + ' <a href="#products">Shop Now →</a>';
    }
    if (settings.heroTitle) {
        const parts = settings.heroTitle.split(' ');
        const lastWord = parts.pop();
        document.getElementById('heroTitle').innerHTML = parts.join(' ') + ' <span class="gradient-text">' + lastWord + '</span>';
    }
    if (settings.heroSubtitle) {
        document.getElementById('heroSubtitle').textContent = settings.heroSubtitle;
    }
    document.getElementById('statProducts').dataset.target = settings.productsSold || '5000';
    document.getElementById('statCustomers').dataset.target = settings.happyCustomers || '1200';
    document.getElementById('statYears').dataset.target = settings.yearsExperience || '15';
    document.getElementById('addressText').textContent = settings.address || '123 Market Road, Lagos, Nigeria';
    document.getElementById('phoneText').textContent = settings.phone || '+234 800 000 0000';
    document.getElementById('emailText').textContent = settings.email || 'info@jacoelectrical.com';
    document.getElementById('hoursText').textContent = settings.hours || 'Mon - Sat: 8:00 AM - 8:00 PM';
    if (settings.facebook) document.getElementById('facebookLink').href = settings.facebook;
    if (settings.instagram) document.getElementById('instagramLink').href = settings.instagram;
    if (settings.twitter) document.getElementById('twitterLink').href = settings.twitter;
    if (settings.whatsapp) document.getElementById('whatsappLink').href = 'https://wa.me/' + settings.whatsapp;
    const root = document.documentElement;
    if (settings.primaryColor) root.style.setProperty('--primary', settings.primaryColor);
    if (settings.primaryDark) root.style.setProperty('--primary-dark', settings.primaryDark);
    if (settings.primaryLight) root.style.setProperty('--primary-light', settings.primaryLight);
    if (settings.accentColor) root.style.setProperty('--accent', settings.accentColor);
    if (settings.accentDark) root.style.setProperty('--accent-dark', settings.accentDark);
    animateStats();
}

const categoryLabels = {
    refrigerator: "Refrigerators",
    ac: "Air Conditioners",
    tv: "Televisions",
    washing: "Washing Machines",
    generator: "Generators",
    microwave: "Kitchen Appliances",
    fan: "Fans & Cooling",
    audio: "Audio Systems",
};

function formatPrice(price) {
    return "₦" + price.toLocaleString("en-NG");
}

function renderProducts(filter = "all") {
    const grid = document.getElementById("productGrid");
    const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center; padding:40px; color:#64748b;">No products in this category yet.</p>';
        return;
    }
    grid.innerHTML = filtered.map(p => `
        <div class="product-card fade-in" data-category="${p.category}">
            <div class="product-image">
                ${p.badge ? `<span class="product-badge ${p.badge}">${p.badge === "sale" ? "SALE" : "NEW"}</span>` : ""}
                ${p.icon || "📦"}
            </div>
            <div class="product-info">
                <div class="product-category">${categoryLabels[p.category] || p.category}</div>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-rating">
                    <span class="product-stars">${"★".repeat(Math.floor(p.rating || 5))}${(p.rating || 5) % 1 >= 0.5 ? "★" : ""}</span>
                    <span>${p.rating || 5} (${p.reviews || 0})</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">${formatPrice(p.price)}</span>
                    ${p.oldPrice && p.oldPrice > 0 ? `<span class="product-old-price">${formatPrice(p.oldPrice)}</span>` : ""}
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
    card.addEventListener("click", () => {
        const filter = card.dataset.filter;
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        const filterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (filterBtn) filterBtn.classList.add("active");
        renderProducts(filter);
    });
});

let cart = [];

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const existing = cart.find(item => item.id === id);
    if (existing) { existing.qty++; } else { cart.push({ ...product, qty: 1 }); }
    updateCart();
    openCart();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

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
        cartBody.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p><a href="#products" class="btn btn-small">Start Shopping</a></div>`;
        cartFooter.style.display = "none";
    } else {
        cartBody.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-icon">${item.icon || "📦"}</div>
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

function openCart() {
    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("cartOverlay").classList.add("open");
}

function closeCart() {
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("open");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) return;
    const waNumber = settings.whatsapp || "2348000000000";
    const message = cart.map(i => `• ${i.name} x${i.qty} - ${formatPrice(i.price * i.qty)}`).join("%0A");
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const text = `Hello ${settings.businessName || 'Jaco Electrical'}! I'd like to order:%0A%0A${message}%0A%0ATotal: ${formatPrice(total)}`;
    window.open(`https://wa.me/${waNumber}?text=${text}`, "_blank");
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
hamburger.addEventListener("click", () => navMenu.classList.toggle("open"));
navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("open"));
});

function animateCounter(el, target) {
    let current = 0;
    const numTarget = parseInt(target);
    const increment = numTarget / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= numTarget) {
            el.textContent = numTarget.toLocaleString() + "+";
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
}

function animateStats() {
    document.querySelectorAll(".stat-number").forEach(el => {
        const target = el.dataset.target;
        if (target) animateCounter(el, target);
    });
}

function observeFadeIn() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

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

loadData();
observeFadeIn();
