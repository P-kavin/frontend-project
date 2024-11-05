// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaifW8hdYs4y55Rg6Yea0wIqE1edWrRDQ",
  authDomain: "ecommerce-authentication-c22c3.firebaseapp.com",
  projectId: "ecommerce-authentication-c22c3",
  storageBucket: "ecommerce-authentication-c22c3.appspot.com",
  messagingSenderId: "23573203616",
  appId: "1:23573203616:web:c2cc4e1b0b5af5ab8657c5",
  measurementId: "G-MS3W1PC1SR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
const auth = getAuth(app); // Ensure 'auth' is initialized properly

// Function to toggle between login and registration
let isLogin = true;
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

function toggleForm() {
    isLogin = !isLogin;
    const formTitle = document.getElementById('form-title');
    const actionButton = document.querySelector('.container button');
    const toggleButton = document.querySelector('.toggle-btn');
    email.value='';
    password.value='';
    errorMessage.style.display = 'none';

    if (isLogin) {
        formTitle.textContent = 'Login';
        actionButton.textContent = 'Login';
        toggleButton.textContent = "Don't have an account? Register";
    } else {
        formTitle.textContent = 'Register';
        actionButton.textContent = 'Register';
        toggleButton.textContent = 'Already have an account? Login';
    }
}

// Function to handle login and registration
function handleAction() {
    if(email.value!="" && password.value!=""){
    if (isLogin) {
        // Login user
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                alert('Login successful!');
                window.location.href = 'products.html'; // Redirect to your dashboard
            })
            .catch((error) => {
                handleError(error);
            });
    } else {
        // Register user
        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                alert('Registration successful! Please login.');
                toggleForm(); // Switch to login form
            })
            .catch((error) => {
               handleError(error);
            });
    }
}else{
    errorMessage.style.display = 'block';
    errorMessage.textContent = 'Fields should not be empty';
}
}

function handleError(error){
    if (error.code === 'auth/email-already-in-use') {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'This email is already registered. Please use a different email or log in.';
    }else if(error.code ==='auth/invalid-email'){
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Please enter a valid email';
    }else if(error.code ==='auth/invalid-login-credentials'){
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Inavild email or password';
    }else{
    errorMessage.style.display = 'block';
    errorMessage.textContent = error.message;
    }
}

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log(user);
      window.location.href = 'products.html';
    }
  });

// Attach functions to the window object
window.handleAction = handleAction;
window.toggleForm = toggleForm;













