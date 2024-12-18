// Select DOM elements
const menuIcon = document.querySelector('#menu-icon'); // Menu icon for toggling navbar
const navbar = document.querySelector('.navbar'); // Navbar element
const navLinks = document.querySelectorAll('.navbar li a'); // Navbar links for additional behavior

// Ensure DOM elements exist before attaching functionality
if (menuIcon && navbar) {
    // Toggle the 'active' class on the navbar when menu icon is clicked
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('bx-x'); // Optional: change icon to 'close' when active
    });
}

// Close the navbar when any link is clicked (for mobile experience)
if (navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active'); // Close the navbar
            menuIcon.classList.remove('bx-x'); // Reset menu icon to default
        });
    });
}

// Optional: Enhance UX by removing 'active' class when resizing the window
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navbar.classList.remove('active');
        menuIcon.classList.remove('bx-x');
    }
});

function performSearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase().trim();

    // Convert spaces to hyphens for matching IDs
    const formattedInput = searchInput.replace(/\s+/g, '-'); // e.g., "Sansrival Cake" becomes "sansrival-cake"

    // Check if the element with that ID exists
    const productElement = document.getElementById(formattedInput);

    if (productElement) {
        // Scroll to the product section
        productElement.scrollIntoView({ behavior: 'smooth' });

        // Optionally highlight the found product (for user feedback)
        productElement.style.border = "2px solid red"; // Highlighting effect
        setTimeout(() => {
            productElement.style.border = ""; // Remove highlight after 2 seconds
        }, 2000);

        // Show a modal or alert with product details (optional)
        showProductDetails(productElement);
    } else {
        alert('Product not found!'); // Notify user if no matching product is found
    }
}

function showProductDetails(productElement) {
    // Create a modal or a detailed view for the product
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>${productElement.querySelector('h3').innerText}</h2>
            <img src="${productElement.querySelector('img').src}" alt="${productElement.querySelector('h3').innerText}">
            <p>Price: ${productElement.querySelector('.content span').innerText}</p>
            <p>Description: This is where you can add a description of the product.</p>
        </div>
    `;
    
    document.body.appendChild(modal);

    // Close button functionality
    modal.querySelector('.close-button').onclick = () => {
        modal.remove();
    };

    // Close modal when clicking outside of it
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    };
}


// Define an array to hold the cart items
let cart = [];

// Function to add items to the cart
function addToCart(productName, productPrice) {
    const product = {
        name: productName,
        price: productPrice,
        quantity: 1
    };

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if already in cart
    } else {
        cart.push(product); // Add new product to cart
    }
    updateCartTotal();
}

// Function to remove items from the cart
function removeFromCart(productName) {
    const productIndex = cart.findIndex(item => item.name === productName);
    if (productIndex > -1) {
        const product = cart[productIndex];
        if (product.quantity > 1) {
            product.quantity -= 1; // Decrease quantity if more than one
        } else {
            cart.splice(productIndex, 1); // Remove item if quantity is one
        }
    }
    updateCartTotal();
}

// Function to update the total price of items in the cart
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').innerText = `Total: ₱${total}`;
}

// Function to display the cart items
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Clear previous items

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerText = `${item.name} - ₱${item.price} x ${item.quantity}`;
        
        // Create a remove button for each item
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.onclick = () => {
            removeFromCart(item.name); // Call remove function on click
            displayCart(); // Refresh displayed cart
        };
        
        itemElement.appendChild(removeButton); // Append button to item element
        cartContainer.appendChild(itemElement); // Append item element to cart container
    });
}

// Attach event listeners to all "Add to Cart" buttons
document.querySelectorAll('.products .box a').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        const box = event.target.closest('.box');
        const productName = box.querySelector('h3').innerText;
        const productPrice = parseFloat(box.querySelector('span').innerText.replace('₱', ''));
        
        addToCart(productName, productPrice); // Add item to cart
        displayCart(); // Display updated cart
    });
});