// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {ref, remove, push, get, getDatabase } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaifW8hdYs4y55Rg6Yea0wIqE1edWrRDQ",
  authDomain: "ecommerce-authentication-c22c3.firebaseapp.com",
  projectId: "ecommerce-authentication-c22c3",
  storageBucket: "ecommerce-authentication-c22c3.appspot.com",
  messagingSenderId: "23573203616",
  appId: "1:23573203616:web:c2cc4e1b0b5af5ab8657c5",
  measurementId: "G-MS3W1PC1SR",
  databaseURL: "https://ecommerce-authentication-c22c3-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// Get Auth instance
const auth = getAuth(app); // Ensure 'auth' is initialized properly

//dummy products
const products = [
  { id: 1, name: 'Product 1', price: 10, description: 'This is a great product.' },
  { id: 2, name: 'Product 2', price: 20, description: 'This is another great product.' },
  { id: 3, name: 'Product 3', price: 30, description: 'You will love this product.' },
  {id: 4, name: 'Product 4', price: 40, description: 'This is a great product.' },
  { id: 5, name: 'Product 5', price: 45, description: 'This is a great product.' },
  { id: 6, name: 'Product 6', price: 50, description: 'You will love this product.' },
  {id: 7, name: 'Product 7', price: 55, description: 'This is a great product.' },
  { id: 8, name: 'Product 8', price: 60, description: 'This is another great product.' },
  { id: 9, name: 'Product 9', price: 65, description: 'You will love this product.' }
];
// Cart items
let cart = [];

// Function to display products on the page
function displayProducts() {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';  // Clear previous content

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <h3>${product.name}</h3>
      <div><p>${product.description}</p></div>
      <p class="price">$${product.price}</p>
      <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(productCard);
  });
}


// Function to add a product to the cart
function addToCart(productId) {
   const user = checkCurrentUser();
   const userCartRef = ref(database, 'carts/' + user.uid);

   const product = products.find(p => p.id === productId);
   cart.push(product);

  // Use push() to add a new product ID under the user's cart node
  push(userCartRef, { productId: product.id })
    .then(() => {
      console.log("Product added to the cart in the database.");
      // Update cart count in the navigation bar
      document.getElementById('cart-count').innerText = ncart.length;
      updateCartUI();
      alert(`${product.name} has been added to your cart.`);
    })
    .catch((error) => {
      console.error("Error adding product to the cart:", error);
    });

  alert(`${product.name} has been added to your cart.`);
}

// Function to update the cart UI
function updateCartUI() {
  const cartItemsDiv = document.getElementById('cartItems');
  const cartTotalDiv = document.getElementById('cartTotal');
  
  cartItemsDiv.innerHTML = '';  // Clear previous items

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<p>No items in the cart.</p>`;
    cartTotalDiv.innerHTML = `<p>Total: $0</p>`;
    return;
  }

  let total = 0;

  // Display each item in the cart
  cart.forEach((product) => {
    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = `
      <p>${product.name} - $${product.price} <button onclick="removeFromCart('${product.firebaseKey}')">Remove</button></p>
    `;
    cartItemsDiv.appendChild(itemDiv);
    total += product.price;
  });

  // Update the total price
  cartTotalDiv.innerHTML = `<p>Total: $${total}</p>`;
}

// Function to remove a product from the cart
function removeFromCart(firebaseKey) {
  const user = checkCurrentUser();

  // Reference to the specific product in the user's cart
  const productRef = ref(database, `carts/${user.uid}/${firebaseKey}`);
  // Remove the product from the database
  remove(productRef)
    .then(() => {
      alert("Product removed from the cart in the database.");
      // Optionally update UI here
    })
    .catch((error) => {
      alert("Error removing product from the cart:", error);
    });
  
  // Update cart count
  document.getElementById('cart-count').innerText = cart.length;
  
  // Update the cart UI after removal
  retrieveUserCart();
}

// Function to handle checkout
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Checkout successful!");
  cart = [];
  
  // Reset cart UI and count after checkout
  document.getElementById('cart-count').innerText = 0;
  updateCartUI();
}

// Attach checkout functionality to button
document.getElementById('checkoutBtn').addEventListener('click', checkout);


// Call this function to display products when the page loads
displayProducts();

// Update the `retrieveUserCart` function
function retrieveUserCart() {
  const user = checkCurrentUser();

  const userCartRef = ref(database, 'carts/' + user.uid);

  get(userCartRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const cartData = snapshot.val();
        cart = []; // Clear current cart

        // Loop through the cart items and add them to the cart array
        for (let key in cartData) {
          const productId = cartData[key].productId;
          const product = products.find(p => p.id === productId);
          if (product) {
           
            cart.push({...product,firebaseKey: key });
          }
        }

        // Update the UI
        updateCartUI();
        document.getElementById('cart-count').innerText = cart.length;
      } else {
        console.log("No items in the cart.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving cart data:", error);
    });
}

function checkCurrentUser(){
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to view your cart.");
    return;
  }
  return user;
}


// Call this function when the user logs in or when the page loads
auth.onAuthStateChanged((user) => {
  if (user) {
    retrieveUserCart();
  }
});


window.addToCart=addToCart;
window.updateCartUI=updateCartUI;
window.removeFromCart=removeFromCart;