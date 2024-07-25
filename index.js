document.addEventListener("DOMContentLoaded", function () {
    let cart = [];

    const mealThumbnails = {
        "Waffle": "images/image-waffle-thumbnail.jpg",
        "Crème Brûlée": "images/image-creme-brulee-thumbnail.jpg",
        "Macaron": "images/image-macaron-thumbnail.jpg",
        "Tiramisu": "images/image-tiramisu-thumbnail.jpg",
        "Baklava": "images/image-baklava-thumbnail.jpg",
        "Pie": "images/image-meringue-thumbnail.jpg",
        "Cake": "images/image-cake-thumbnail.jpg",
        "Brownie": "images/image-brownie-thumbnail.jpg",
        "Panna Cotta": "images/image-panna-cotta-thumbnail.jpg"
    };

    // Initialize product cards
    document.querySelectorAll(".image-card").forEach(card => {
        const addButton = card.querySelector(".add-cart-btn");
        addButton.addEventListener("click", function () {
            initializeQuantityControls(card);
            handleAddToCart(card);
        });
    });

    function initializeQuantityControls(card) {
        const addButton = card.querySelector(".add-btn");
        addButton.classList.add("active");
        addButton.innerHTML = `
            <div class="quantity-container">
                <button type="button" class="minus-btn">-</button>
                <input min="1" value="1" class="quantity-input">
                <button type="button" class="plus-btn">+</button>
            </div>
        `;

        // Minus button functionality
        addButton.querySelector(".minus-btn").addEventListener("click", function (e) {
            e.stopPropagation();
            const input = addButton.querySelector(".quantity-input");
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
                updateCartItemQuantity(card.dataset.meal, parseInt(input.value));
            }
        });

        // Plus button functionality
        addButton.querySelector(".plus-btn").addEventListener("click", function (e) {
            e.stopPropagation();
            const input = addButton.querySelector(".quantity-input");
            input.value = parseInt(input.value) + 1;
            updateCartItemQuantity(card.dataset.meal, parseInt(input.value));
        });
    }

    function handleAddToCart(card) {
        const meal = card.dataset.meal;
        const description = card.dataset.description;
        const price = parseFloat(card.dataset.price);
        const quantity = parseInt(card.querySelector(".quantity-input")?.value || 1);

        addToCart({ meal, description, price }, quantity);
    }

    function addToCart(product, quantity) {
        const existingItem = cart.find(item => item.product.meal === product.meal);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ product, quantity });
        }
        updateCartUI();
    }

    function updateCartItemQuantity(productName, newQuantity) {
        const item = cart.find(item => item.product.meal === productName);
        if (item) {
            item.quantity = newQuantity;
            updateCartUI();
        }
    }

    function removeFromCart(productName) {
        cart = cart.filter(item => item.product.meal !== productName);
        updateCartUI();
    }

    function updateCartUI() {
        const cartElement = document.querySelector('.cart');
        if (cart.length === 0) {
            cartElement.innerHTML = `
                <h1>Your Cart(0)</h1>
                <img src="/images/illustration-empty-cart.svg" alt="empty cart">
                <p class="added-items">Your added items will appear here</p>
            `;
        } else {
            let cartHTML = `<h1>Your Cart(${cart.length})</h1>`;
            let total = 0;
            cart.forEach(item => {
                const itemTotal = item.product.price * item.quantity;
                total += itemTotal;
                cartHTML += `
                    <div class="cart-item">
                        <p>${item.product.meal}</p>
                        <p class="meals-details">
                            <strong class="item-quantity">${item.quantity} x </strong>
                            <span class="item-price">$${item.product.price.toFixed(2)}</span> 
                            <span class="item-total">$${itemTotal.toFixed(2)}</span>
                            <button class="remove-item" data-meal="${item.product.meal}">
                                <img src="/images/icon-remove-item.svg" alt="remove">
                            </button>
                        </p>
                    </div>
                `;
            });
            cartHTML += `
                <p>Order Total:<strong class="orders-total">$${total.toFixed(2)}</strong></p>

                <div class="delivery">
                    <img src="/images/icon-carbon-neutral.svg" alt="delivery">
                    <p>This is a carbon-neutral delivery</p>
                </div>
                <button id="confirm-order">Confirm Order</button>
            `;
            cartElement.innerHTML = cartHTML;

            // Add event listeners for remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function () {
                    removeFromCart(this.dataset.meal);
                });
            });

            // Add event listener for confirm order button
            document.getElementById('confirm-order').addEventListener('click', showOrderConfirmation);
        }
    }

    function showOrderConfirmation() {
        const modal = document.getElementById('orderConfirmationModal');
        const orderSummary = document.getElementById('orderSummary');
        let summaryHTML = '<h3>Order Summary:</h3>';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.product.price * item.quantity;
            total += itemTotal;
            summaryHTML += `
                <div class="meal-details">
                    <img src="${mealThumbnails[item.product.meal]}" alt="${item.product.meal}">
                    <div class="meal-description">
                        <p>${item.product.meal}</p>
                        <p>${item.quantity} x $${item.product.price.toFixed(2)} = $${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
            `;
        });
        summaryHTML += `<p>Order Total: $${total.toFixed(2)}</p>`;
        orderSummary.innerHTML = summaryHTML;
        modal.style.display = 'block';

        // Add event listener for "Start New Order" button
        document.getElementById('startNewOrder').addEventListener('click', startNewOrder);
    }

    function startNewOrder() {
        cart = [];
        updateCartUI();
        document.getElementById('orderConfirmationModal').style.display = 'none';
        
        
        document.querySelectorAll(".image-card").forEach(card => {
            const addButton = card.querySelector(".add-btn");
            addButton.classList.remove("active");
            addButton.innerHTML = `
                <button class="add-cart-btn">
                    <img src="/images/icon-add-to-cart.svg" alt="add-icon"> Add to Cart
                </button>
            `;
        });
    }
});