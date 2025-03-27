// Cart management
const cart = [];
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const closeModal = document.getElementById("closeModal");

// Total price display
const totalPriceElement = document.createElement("p");
totalPriceElement.id = "totalPrice";
totalPriceElement.style.fontWeight = "bold";
totalPriceElement.style.marginTop = "20px";

// Add to cart button logic
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", event => {
        const productName = event.target.getAttribute("data-name");
        const productPrice = parseFloat(event.target.getAttribute("data-price"));
        cart.push({ name: productName, price: productPrice });
        cartCount.textContent = cart.length;
        alert(`${productName} has been added to your cart!`);
    });
});

// Show cart modal
document.getElementById("cartBtn").addEventListener("click", () => {
    cartItems.innerHTML = "";

    // Add cart items to modal
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - N${item.price.toFixed(3)}`;
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
