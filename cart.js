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
totalPriceElement.style.fontWeight = "bold";
totalPriceElement.style.marginTop = "20px";

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartDisplay();

// Add to cart button logic
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", event => {
        const productName = event.target.getAttribute("data-name");
        const productPrice = parseFloat(event.target.getAttribute("data-price"));
        cart.push({ name: productName, price: productPrice });
        saveCart();
        updateCartDisplay();

        // Show flash message
        showFlashMessage("Added to cart!");
    });
});

// Show cart modal
document.getElementById("cartBtn").addEventListener("click", () => {
    cartItems.innerHTML = "";

    // Add cart items to modal with remove buttons
    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "10px";
        li.textContent = `${item.name} - N${item.price.toFixed(3)}`;
        
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

        li.appendChild(removeButton);
        cartItems.appendChild(li);
    });

    // Calculate total price
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    totalPriceElement.textContent = `Total Price: N${totalPrice.toFixed(3)}`;
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
    cartCount.textContent = cart.length;
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
