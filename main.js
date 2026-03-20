// main.js - Interactive features for Sabina Perfumes

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Sticky Navigation smooth effect
    const nav = document.querySelector("nav");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            nav.style.padding = "16px 60px";
            nav.style.background = "rgba(5, 5, 5, 0.85)";
        } else {
            nav.style.padding = "24px 60px";
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

    // 3. Add to Bag Button Animation
    const addButtons = document.querySelectorAll(".add-btn");
    
    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const originalText = btn.innerText;
            btn.innerText = "Added to Bag";
            btn.style.background = "var(--primary)";
            btn.style.color = "#000";
            
            // Create a small toast notification system
            showToast("Product added to bag successfully");

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "transparent";
                btn.style.color = "var(--primary)";
            }, 2000);
        });
    });

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
