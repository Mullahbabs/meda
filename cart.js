// Cart management
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const closeModal = document.getElementById("closeModal");
const flashMessage = document.createElement("div"); // Flash message element

// Style for the flash message
flashMessage.id = "flashMessage";
flashMessage.style.position = "fixed";
flashMessage.style.top = "10px";
flashMessage.style.right = "10px";
flashMessage.style.padding = "10px 20px";
flashMessage.style.backgroundColor = "#0796fe";
flashMessage.style.color = "#fff";
flashMessage.style.borderRadius = "5px";
flashMessage.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
flashMessage.style.display = "none";
flashMessage.style.zIndex = "1000";
document.body.appendChild(flashMessage);

// Total price display
const totalPriceElement = document.createElement("p");
totalPriceElement.id = "totalPrice";
totalPriceElement.style.fontWeight = "bolder ";
totalPriceElement.style.fontStyle = "arial";
totalPriceElement.style.marginTop = "20px";

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartDisplay();

// Add to cart button logic
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", event => {
        const productName = event.target.getAttribute("data-name");
        const productPrice = parseFloat(event.target.getAttribute("data-price"));
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                name: productName, 
                price: productPrice,
                quantity: 1 
            });
        }
        
        saveCart();
        updateCartDisplay();

        // Show flash message
        showFlashMessage("Added to cart!");
    });
});

// Show cart modal
document.getElementById("cartBtn").addEventListener("click", () => {
    cartItems.innerHTML = "";
if (cart.length === 0) {
    const emptyCart = document.createElement("div");
    emptyCart.textContent = "Your cart is empty";
    emptyCart.style.textAlign = "center";
    emptyCart.style.padding = "20px";
    emptyCart.style.fontStyle = "italic";
    cartItems.appendChild(emptyCart);
    cartItems.appendChild(totalPriceElement);
    cartModal.style.display = "flex";
    return;
}

    // Add cart items to modal with remove buttons
    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "10px";
        
        // Quantity controls container
        const quantityControls = document.createElement("div");
        quantityControls.style.display = "flex";
        quantityControls.style.alignItems = "center";
        quantityControls.style.gap = "10px";
        
        // Decrease quantity button
        const decreaseBtn = document.createElement("button");
        decreaseBtn.textContent = "-";
        decreaseBtn.style.padding = "2px 8px";
        decreaseBtn.style.backgroundColor = "#f0f0f0";
        decreaseBtn.style.border = "1px solid #ddd";
        decreaseBtn.style.borderRadius = "3px";
        decreaseBtn.style.cursor = "pointer";
        decreaseBtn.addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            document.getElementById("cartBtn").click(); // Refresh modal
        });
        
        // Quantity display
        const quantityDisplay = document.createElement("span");
        quantityDisplay.textContent = item.quantity;
        quantityDisplay.style.minWidth = "20px";
        quantityDisplay.style.textAlign = "center";
        
        // Increase quantity button
        const increaseBtn = document.createElement("button");
        increaseBtn.textContent = "+";
        increaseBtn.style.padding = "2px 8px";
        increaseBtn.style.backgroundColor = "#f0f0f0";
        increaseBtn.style.border = "1px solid #ddd";
        increaseBtn.style.borderRadius = "3px";
        increaseBtn.style.cursor = "pointer";
        increaseBtn.addEventListener("click", () => {
            item.quantity += 1;
            saveCart();
            document.getElementById("cartBtn").click(); // Refresh modal
        });
        
        quantityControls.appendChild(decreaseBtn);
        quantityControls.appendChild(quantityDisplay);
        quantityControls.appendChild(increaseBtn);
        
        // Item info
        const itemInfo = document.createElement("div");
        itemInfo.textContent = `${item.name} - ₦ ${(item.price * item.quantity).toFixed(3)} (${item.price.toFixed(3)} each)`;
        
        // Remove button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.style.marginLeft = "10px";
        removeButton.style.padding = "5px 10px";
        removeButton.style.backgroundColor = "#dc3545";
        removeButton.style.color = "#fff";
        removeButton.style.border = "none";
        removeButton.style.borderRadius = "3px";
        removeButton.style.cursor = "pointer";
        removeButton.style.fontSize = "12px";
        removeButton.addEventListener("click", () => {
            removeItemFromCart(index);
        });

        li.appendChild(quantityControls);
        li.appendChild(itemInfo);
        li.appendChild(removeButton);
        cartItems.appendChild(li);
    });

    // Calculate total price
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalPriceElement.textContent = `Total (${totalItems} items): ₦ ${totalPrice.toFixed(3)}`;
    cartItems.appendChild(totalPriceElement);

    cartModal.style.display = "flex";
    
});

// Close cart modal
closeModal.addEventListener("click", () => {
    cartModal.style.display = "none";
}); 

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count and localStorage
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    saveCart();
}

// Remove item from cart
function removeItemFromCart(index) {
    cart.splice(index, 1); // Remove item by index
    saveCart();
    updateCartDisplay();

    // Re-render modal content
    if (cartModal.style.display === "flex") {
        document.getElementById("cartBtn").click();
    }
}

// Show flash message
function showFlashMessage(message) {
    flashMessage.textContent = message;
    flashMessage.style.display = "block";

    setTimeout(() => {
        flashMessage.style.display = "none";
    }, 2000);
}
// Ensure cart is updated on page load
updateCartDisplay();
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Add animation class
    cartCount.classList.add("cart-count-animate");
    setTimeout(() => {
        cartCount.classList.remove("cart-count-animate");
    }, 500);
    
    saveCart();
}

// Add this to your JavaScript
const miniCart = document.getElementById("miniCart");
const miniCartItems = document.getElementById("miniCartItems");
const closeMiniCart = document.getElementById("closeMiniCart");

function updateMiniCart() {
    if (cart.length === 0) {
        miniCart.style.display = "none";
        return;
    }
    
    miniCartItems.innerHTML = "";
    cart.slice(0, 3).forEach(item => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.marginBottom = "8px";
        div.textContent = `${item.name} × ${item.quantity}`;
        miniCartItems.appendChild(div);
    });
    
    if (cart.length > 3) {
        const moreItems = document.createElement("div");
        moreItems.textContent = `+${cart.length - 3} more items...`;
        moreItems.style.fontSize = "0.8em";
        moreItems.style.color = "#666";
        miniCartItems.appendChild(moreItems);
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiv = document.createElement("div");
    totalDiv.style.fontWeight = "bold";
    totalDiv.style.marginTop = "10px";
    totalDiv.style.borderTop = "1px solid #eee";
    totalDiv.style.paddingTop = "10px";
    totalDiv.textContent = `Total: ₦${totalPrice.toFixed(3)}`;
    miniCartItems.appendChild(totalDiv);
    
    miniCart.style.display = "block";
}

// Show mini cart when adding items
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        setTimeout(updateMiniCart, 100);
    });
});

closeMiniCart.addEventListener("click", () => {
    miniCart.style.display = "none";
});

// Show mini cart when hovering over cart button
document.getElementById("cartBtn").addEventListener("mouseenter", updateMiniCart);
miniCart.addEventListener("mouseleave", () => {
    setTimeout(() => {
        if (!miniCart.matches(":hover")) {
            miniCart.style.display = "none";
        }
    }, 200);
});


document.querySelectorAll(".product-card").forEach(card => {
    const quickViewBtn = document.createElement("button");
    quickViewBtn.textContent = "Quick View";
    quickViewBtn.style.position = "absolute";
    quickViewBtn.style.bottom = "60px";
    quickViewBtn.style.left = "50%";
    quickViewBtn.style.transform = "translateX(-50%)";
    quickViewBtn.style.padding = "8px 15px";
    quickViewBtn.style.backgroundColor = "#0796fe";
    quickViewBtn.style.color = "white";
    quickViewBtn.style.border = "none";
    quickViewBtn.style.borderRadius = "4px";
    quickViewBtn.style.cursor = "pointer";
    quickViewBtn.style.opacity = "0";
    quickViewBtn.style.transition = "opacity 0.3s";
    quickViewBtn.style.zIndex = "2";
    
    card.style.position = "relative";
    card.appendChild(quickViewBtn);
    
    card.addEventListener("mouseenter", () => {
        quickViewBtn.style.opacity = "1";
    });
    
    card.addEventListener("mouseleave", () => {
        quickViewBtn.style.opacity = "0";
    });
    
    quickViewBtn.addEventListener("click", () => {
        // You would implement actual quick view functionality here
        alert("Quick view for " + card.querySelector("h3").textContent);
    });
});