document.addEventListener("DOMContentLoaded", function () {
    // Hämta produkterna från localStorage
    const cart = JSON.parse(localStorage.getItem('cart'));

    // Återställ cartCount från localStorage eller sätt till 0 om det inte finns något sparad
    const storedCartCount = localStorage.getItem("cart-count");
    if (storedCartCount) {
        cartCount = parseInt(storedCartCount);
    } else {
        cartCount = 0;
    }

    // Uppdatera gränssnittet med antalet produkter i varukorgen
    updateCartCount();

    // Kontrollera om det finns några produkter i varukorgen
    if (cart && cart.length > 0) {
        // Loopa igenom varje produkt i varukorgen och rendera den på sidan
        cart.forEach((product) => {
            renderProduct(product);
        });
    }

    // Uppdatera totalbeloppet
    updateTotal();

    // Lägg till händelselyssnare för att öka och minska kvantiteten efter att produkterna har renderats
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
});

    // Lägg till händelselyssnare för att ta bort en produkt från varukorgen
    const checkoutButton = document.getElementById("checkout-btn");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", function () {
            location.href = "order.html";
        });
    }

    // Funktion för att rendera en produkt i varukorgen
    function renderProduct(product) {
        const productElement = document.createElement('div');
        productElement.classList.add('cart-item');
        productElement.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${product.image}" alt="${product.name}" class="product-image img-fluid rounded border mb-3 me-1" width="200" height="200">
                </div>
                <div class="col-md-8">
                
                    <h3 class="fw-bold">${product.name}</h3>
                    <div class="d-flex justify-content-between align-items-center">
                    <div class="quantity-controls d-flex align-items-center">
                        <button class="btn btn-sm btn-primary decrease-quantity me-1" data-name="${product.name}"><</button>
                        <span class="product-quantity me-1 fw-bold" id="product-quantity-${product.name}">${product.quantity}</span>
                        <button class="btn btn-sm btn-primary increase-quantity me-1" data-name="${product.name}">></button>
                        <span class="fw-bold fs-5 italic-text">$</span>
                        <span class="price fw-bold fs-5 italic-text" id="amount-${product.name}">${(product.price * product.quantity).toFixed(2)}</span>
                        </div>
                        <button class="btn btn-sm btn-secondary remove-product" data-name="${product.name}">Ta bort</button>
                    </div>
                </div>
            </div> 
        `;
    
        // Lägg till produkt-elementet i varukorgen
        document.getElementById('cart').appendChild(productElement);
    }
    
    // Eventlyssnare för att ta bort en produkt från varukorgen
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-product')) {
            const productName = event.target.getAttribute('data-name');
            removeProduct(productName);
        }
    });
    

// Funktion för att beräkna den totala summan för produkterna i varukorgen
function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let total = 0;

    if(cart && cart.length > 0) {
        cart.forEach((product) => {
            total += product.price * product.quantity;
        });
    }
    return total.toFixed(2); 
}

function updateTotal() {
    const total = calculateTotal();
    const totalElement = document.getElementById("total");
    if(totalElement) {
        totalElement.innerText = total;
    } else {
        console.error("Element with ID 'total' not found.");
    }
}

// Funktion för att uppdatera summan för en specifik produkt när antalet ändras
function calculateAmount() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let amount = 0;

    if(cart && cart.length > 0) {
        cart.forEach((product) => {
            amount += product.price * product.quantity;
        });
    }
    return amount; 
}

function updateAmount(productName) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const product = cart.find((p) => p.name === productName);

    const amountElement = document.getElementById(`amount-${productName}`);
    if (amountElement) {
        amountElement.innerText = `$${(product.price * product.quantity).toFixed(2)}`; 
    }
}

// Funktion för att öka kvantiteten för en produkt
function increaseQuantity(event) {
    const productName = event.target.getAttribute('data-name');
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart && cart.length > 0) {
        const productIndex = cart.findIndex((p) => p.name === productName);
        if (productIndex !== -1) {
            cart[productIndex].quantity += 1;
            cart[productIndex].amount = cart[productIndex].price * cart[productIndex].quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            // Uppdatera HTML-elementet för produktens kvantitet
            const quantityElement = document.getElementById(`product-quantity-${productName}`);
            if (quantityElement) {
                quantityElement.innerText = cart[productIndex].quantity;
            }
            // Uppdatera HTML-elementet för produktens pris
            const amountElement = document.getElementById(`amount-${productName}`);
            if (amountElement) {
                amountElement.innerText = cart[productIndex].amount.toFixed(2);
            }
            updateAmount();
            updateTotal();
            updateCartCount();
        }
    }
}

// Funktion för att minska kvantiteten för en produkt
function decreaseQuantity(event) {
    const productName = event.target.getAttribute('data-name');
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart && cart.length > 0) {
        const productIndex = cart.findIndex((p) => p.name === productName);
        if (productIndex !== -1 && cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
            cart[productIndex].amount = cart[productIndex].price * cart[productIndex].quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            // Uppdatera HTML-elementet för produktens kvantitet
            const quantityElement = document.getElementById(`product-quantity-${productName}`);
            if (quantityElement) {
                quantityElement.innerText = cart[productIndex].quantity;
            }
            // Uppdatera HTML-elementet för produktens pris
            const amountElement = document.getElementById(`amount-${productName}`);
            if (amountElement) {
                amountElement.innerText = cart[productIndex].amount.toFixed(2);
            }
            updateAmount();
            updateTotal();
            updateCartCount();
        }
    }
}

// Funktion för att ta bort en produkt från varukorgen
function removeProduct(productName) {
    const cart = JSON.parse(localStorage.getItem("cart"));

    if (cart && cart.length > 0) {
        const updatedCart = cart.filter((product) => product.name !== productName);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        updateTotal(); // Uppdatera totalbeloppet efter borttagning av produkt
        updateCartCount(); // Uppdatera antalet produkter i varukorgen

        // Uppdatera varukorgen på sidan efter borttagning av produkt
        const cartElement = document.getElementById('cart');
        cartElement.innerHTML = '';
        updatedCart.forEach(product => {
            renderProduct(product);
        });
    }
}

// Funktion för att tömma varukorgen helt
function emptyCart() {
    // Ta bort hela varukorgen från localStorage
    localStorage.removeItem("cart");
    localStorage.removeItem("cart-count");
    // Nollställ summan
    const totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.innerText = "0.00";
    }
    // Uppdatera gränssnittet
    const cartContent = document.getElementById("cart");
    cartContent.innerHTML = "";

    // Uppdatera antelet produkter i varukorgen
    cartCount = 0;
    updateCartCount();
}

// Hantera klickhändelsen för att tömma varukorgen
const emptyCartBtn = document.getElementById("empty-btn");
if (emptyCartBtn) {
    emptyCartBtn.addEventListener("click", function () {
        emptyCart();
    });
}

