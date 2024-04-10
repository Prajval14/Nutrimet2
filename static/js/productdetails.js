const selected_product = JSON.parse(new URLSearchParams(window.location.search).get('selected_product') ?? 'null');
// console.log(selected_product);
//debugger
import { gym_data_list, yoga_data_list, supplements_data_list } from './data.js';


const navbarBadge = document.getElementById("navbar_toggler_icon_badge");
const cartBadge = document.getElementById("cart_items_badge");

//Declaring empty array to send data to add to cart page
const myCart = [];

document.addEventListener('DOMContentLoaded', function() {
// Combine all product lists into one array
const allProducts = [...gym_data_list, ...yoga_data_list, ...supplements_data_list];

// Find the product with the matching name
const product = allProducts.find(prod => prod.productid === selected_product);
    //debugger
    createCards(product);
    
})

const gymContainer = document.getElementById('product_detail_container');

//Functions defined
function createCards(product) {    
    const cardDiv = document.createElement('div');
    cardDiv.className = 'container';
    gymContainer.innerHTML = `
    <div class="left">
        <!-- Carousel -->
        <div id="demo" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators" id="carousel_image">
                <button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
            </div>
            <!-- The slideshow/carousel -->
            <div class="carousel-inner">
                <div class="carousel-item active" id="carousel_img_1">
                <img src="${product.imageURL}" class="card-img-top" alt="${product.productname}">
                </div>
                <div class="carousel-item" id="carousel_img_2">
                <img src="${product.imageURL}" class="card-img-top" alt="${product.productname}">
                </div>
                <div class="carousel-item" id="carousel_img_3">
                <img src="${product.imageURL}" class="card-img-top" alt="${product.productname}">   
                </div>
            </div>
            <!-- Left and right controls/icons -->
            <button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>
        </div>
    </div>

    <div class="right">
        <h2>${product.productname}</h2>
        <h4>$${product.originalprice}</h4>
        <hr>
        <p>${product.productdetail}</p>
        <div class="rating">${product.rating + ' ' + generateStarRating(product.rating)}</div><br>
        <label>Quantity:&nbsp;&nbsp;</label><select class="quantity-select">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        <button class="add_to_cart_button">Add to cart</button>
    </div>
    `;

    handleAddToCart();
}

// Handling navbar cart and sign up on click event
document.getElementById('nav_cart_button').addEventListener("click", () => window.location.href = './html/cart.html?index_page_selected_products=' + JSON.stringify(myCart));
document.getElementById('nav_login_button').addEventListener("click", () => toggleValidation());




function handleAddToCart() {
    const addToCartButtons = document.querySelectorAll('.add_to_cart_button');
    addToCartButtons.forEach(button => button.addEventListener("click", (event) => addProductToCart(event)));
}

function addProductToCart(event) {
    //Set add to cart on click to addded for few seconds
    const button = event.target;
    const quantitySelect = event.target.closest('.right').querySelector('.quantity-select');
    const selectedQuantity = parseInt(quantitySelect.value);

    button.innerHTML = `Added <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg>`;
    button.classList.add('added');  
    setTimeout(function () {
      button.textContent = 'Add to Cart';
      button.classList.remove('added');
    }, 1000);
  
    //Add product ID to cart and a list 
    const productID = selected_product;
    for (let i = 0; i < selectedQuantity; i++) {
        myCart.push(productID);
    }
    navbarBadge.style.display = 'flex';
    cartBadge.innerHTML = myCart.length;
  }

function generateStarRating(rating) {
    const starTotal = 5;
    const roundedRating = Math.round(parseFloat(rating));
    let starHTML = "";
    for (let i = 0; i < starTotal; i++) {
      starHTML += i < roundedRating ? "⭐" : "☆";
    }
    return starHTML;
  }

  document
  .getElementById("nav_cart_button")
  .addEventListener(
    "click",
    () =>
    (window.location.href =
      "./cart.html?index_page_selected_products=" + JSON.stringify(myCart))
  );

  //toggle validation
  function toggleValidation() {
    var isValid = sessionStorage.getItem("isValid");
    // If isValid is null or false, redirect to signup.html
    if (!isValid || isValid === "false") {
        window.location.href = './html/signup.html';
    } else {
        window.location.href = './html/details.html';
    }
}

