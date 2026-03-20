// main.js - Interactive features for Sabina Perfumes

document.addEventListener("DOMContentLoaded", () => {
    
    // 0. Burger Menu Toggle (Mobile)
    const burgerBtn = document.getElementById("burger-btn");
    const navMenu = document.getElementById("nav-menu");

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            burgerBtn.classList.toggle("active");
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                burgerBtn.classList.remove("active");
            });
        });
    }

    // 1. Sticky Navigation smooth effect
    const nav = document.querySelector("nav");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            nav.style.padding = "8px 60px";
            nav.style.background = "rgba(5, 5, 5, 0.85)";
        } else {
            nav.style.padding = "12px 60px";
            nav.style.background = "rgba(10, 10, 10, 0.7)";
        }
    });

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                scrollObserver.unobserve(entry.target); // Animation runs once
            }
        });
    }, observerOptions);

    // Targets for scroll animations
    const targets = document.querySelectorAll(".note-card, .product-card, .story-image, .story-content");
    
    targets.forEach(target => {
        // Initial state before animation
        target.style.opacity = "0";
        target.style.transform = "translateY(40px)";
        target.style.transition = "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
        scrollObserver.observe(target);
    });

    // 3. Add to Bag Trigger & Cart Logic
    const addButtons = document.querySelectorAll(".add-btn");
    let cart = [];
    
    // Core Elements from Overlay Drawer
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCountBadge = document.getElementById("cart-count");
    const cartTotalNode = document.getElementById("cart-total");

    addButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Get product name & price from cards
            const card = e.target.closest(".product-card");
            const name = card.querySelector("h3").innerText;
            const priceText = card.querySelector(".price").innerText;
            const price = parseFloat(priceText.replace('$', ''));
            const image = card.querySelector("img").src;

            addToCart({ name, price, image });

            const originalText = btn.innerText;
            btn.innerText = "Added to Bag";
            btn.style.background = "var(--primary)";
            btn.style.color = "#000";
            
            showToast(`${name} added to bag`);

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "transparent";
                btn.style.color = "var(--primary)";
            }, 2000);
        });
    });

    function addToCart(item) {
        const existingItem = cart.find(i => i.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        renderCart();
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        // Count total items
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (totalItems > 0) {
            cartCountBadge.style.display = "flex";
            cartCountBadge.style.transform = "scale(1)";
            cartCountBadge.innerText = totalItems;
        } else {
            cartCountBadge.style.transform = "scale(0)";
        }

        // Generate Item Blocks
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 40px;">Your bag is empty.</p>`;
            cartTotalNode.innerText = "$0.00";
            return;
        }

        let html = '';
        let totalSum = 0;
        cart.forEach((item, index) => {
            totalSum += item.price * item.quantity;
            html += `
                <div style="display: flex; gap: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); align-items: center;">
                    <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 0.95rem; margin-bottom: 4px;">${item.name}</h4>
                        <p style="color: var(--primary); font-size: 0.85rem; font-weight: 600;">$${item.price.toFixed(2)}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                        <button onclick="changeQty(${index}, -1)" style="background: none; border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty(${index}, 1)" style="background: none; border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">+</button>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;
        cartTotalNode.innerText = `$${totalSum.toFixed(2)}`;
    }

    // Global Qty Changer
    window.changeQty = function(index, delta) {
        if (cart[index]) {
            cart[index].quantity += delta;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            renderCart();
        }
    };

    // 4. Click handlers for overlays
    const searchBtn = document.getElementById("search-btn");
    const cartBtn = document.getElementById("cart-btn");
    const searchOverlay = document.getElementById("search-overlay");
    const cartDrawer = document.getElementById("cart-drawer");
    const closeSearch = document.getElementById("close-search");
    const closeCart = document.getElementById("close-cart");

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener("click", () => {
            searchOverlay.style.opacity = "1";
            searchOverlay.style.pointerEvents = "auto";
        });
        closeSearch.addEventListener("click", () => {
            searchOverlay.style.opacity = "0";
            searchOverlay.style.pointerEvents = "none";
        });
    }

    if (cartBtn && cartDrawer) {
        cartBtn.addEventListener("click", () => { cartDrawer.style.right = "0"; });
        closeCart.addEventListener("click", () => { cartDrawer.style.right = "-400px"; });
    }

    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerText = message;
        
        // Inline styles for absolute simplicity and guaranteed looks
        toast.style.position = "fixed";
        toast.style.bottom = "30px";
        toast.style.right = "30px";
        toast.style.background = "#d4af37";
        toast.style.color = "#000";
        toast.style.padding = "12px 24px";
        toast.style.borderRadius = "4px";
        toast.style.fontWeight = "600";
        toast.style.fontSize = "0.9rem";
        toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
        toast.style.zIndex = "2000";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        toast.style.transition = "all 0.3s ease";

        document.body.appendChild(toast);

        // Animate In
        setTimeout(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
        }, 100);

        // Animate Out
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(20px)";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

});
