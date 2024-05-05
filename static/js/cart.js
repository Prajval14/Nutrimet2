// import { gym_data_list, yoga_data_list, supplements_data_list } from "../js/data.js";
var gym_products = gym_data_list;
var yoga_products = yoga_data_list;
var supplement_products = supplements_data_list;
var cartProductContainer = document.getElementById('p');   
var total_cart_price = 0; 
var quantity = [];
 


document.addEventListener('DOMContentLoaded',function(){ 
    var countedNames = []; // Array to keep track of counted names
    
    for (var i = 0; i < cart_data.length; i++) {
        var productName = cart_data[i];
        
        // Check if the name has already been counted
        if (!countedNames.includes(productName)) {
            var count = 0;
            for (var j = 0; j < cart_data.length; j++) {
                if (cart_data[j] === productName) {
                    count++;
                }
            }
            quantity.push(count);
            // Add the name to the list of counted names
            countedNames.push(productName);
        }
    }

    // set up the footer
    window.onload = function() {
        var footer = document.getElementById('footer');
        var hasScrollbar = document.documentElement.clientHeight < document.body.scrollHeight;
        
        if (hasScrollbar) {
          
        } else {
        //   footer.classList.toggle('fixed-bottom');
        footer.classList.toggle('fixed-bottom');
        
        }
      }


    // 1 -- checking weather the cart is empty or not
    if(cart_data.length <1){
        check_empty_cart(cart_data);
        var checkoutbtn = document.getElementById('btn_checkout');
        checkoutbtn.addEventListener('click', function(){
            document.getElementById('footer').classList.toggle('fixed-bottom');
            var total = document.getElementById('total_quantity');
            if(total.textContent == 0){
                alert('your cart is empty!!');
            }
        });
    }
    else{
        //if cart is not empty then this code will be executed.
        display_products(countedNames);
        total_price();
        // let proxy = new Proxy(countedNames, {
        // get(target, property, receiver) {
        //     if (property === 'splice') {
        //         return function (...args) {
        //             return Reflect.apply(target[property], target, args);
        //         }
        //     }
        //     return Reflect.get(target, property, receiver);
        // }
        // });
        var list_product1 = document.querySelectorAll('.product_card');
        list_product1.forEach(function(button){
            button.addEventListener('click', function(){
                var delete_btn = document.querySelectorAll('.delete_cart_product');        
                var list_product = document.querySelectorAll('.product_card');
                for (var i = 0; i < delete_btn.length; i++) {
                    (function(index) {
                        delete_btn[index].addEventListener('click', function() {
                            // proxy.splice(index, 1);
                                list_product[index].remove();
                                total_price();

                                var footer = document.getElementById('footer');
                                var hasScrollbar = document.documentElement.clientHeight < document.body.scrollHeight;
                                
                                if (hasScrollbar) {
                                    if(footer.classList.contains('fixed-bottom')){
                                        footer.classList.remove('fixed-bottom');
                                    }
                                
                                // You can take appropriate actions here if scrollbar is present
                                
                                } else {
                                    if(footer.classList.contains('fixed-bottom')){
                                        
                                    }
                                    else{
                                        footer.classList.add('fixed-bottom');
                                    }
                                }
                        });
                    })(i);   
                }
            });

            // prohibits the user to enter more than quantity and lessthan 0
            var cartQtyInputs = document.querySelectorAll('.cart-qty');

            cartQtyInputs.forEach(function(cartQtyInput) {
                // Store the initial value
                var initialValue = cartQtyInput.value;
                var currentMax = parseInt(cartQtyInput.getAttribute('max'));
        
                cartQtyInput.addEventListener('change', function() {
                    // If the input value is empty, not a number, less than 1, or greater than the max value, reset it to the initial value
                    if (!isValidNumber(cartQtyInput.value) || parseInt(cartQtyInput.value) < 1 || parseInt(cartQtyInput.value) > currentMax) {
                        cartQtyInput.value = initialValue;
                    }
                });
            });
        
            function isValidNumber(value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            }

            // s
            changed_qty();  
        });

        var checkoutbtn = document.getElementById('btn_checkout');
        checkoutbtn.addEventListener('click', function(){
            var total = document.getElementById('total_quantity');
            if(total.textContent == 0){
                alert('your cart is empty!!');
            }
            else{
                var checkout_form = document.getElementById('checkout_form');
                var row1_1 = document.getElementById('row1_1');
                var products = document.getElementById('p');
                
                if(checkoutbtn.innerHTML == 'Back'){
                    checkoutbtn.innerHTML = 'Checkout';
                }
                else{
                    checkoutbtn.innerHTML = 'Back';
                }
                row1_1.classList.toggle('hide');
                products.classList.toggle('hide');
                checkout_form.classList.toggle('hide');
                document.getElementById('footer').classList.toggle('fixed-bottom');
            } 
        });
        
       
    }    

    var btn_submit = document.getElementById('btn_submit');

    btn_submit.addEventListener('click', function(){

        

       // Get form input values
        var fullName = document.getElementById('fullName').value.trim();
        var address = document.getElementById('address').value.trim();
        var city = document.getElementById('city').value.trim();
        var province = document.getElementById('province').value.trim();
        var postalCode = document.getElementById('postalCode').value.trim();
        var phone = document.getElementById('phone').value.trim();

        var fullNameValidation = document.getElementById('fname_v');
        var addressValidation = document.getElementById('add_v');
        var cityValidation = document.getElementById('city_v');
        var provinceValidation = document.getElementById('province_v');
        var postalCodeValidation = document.getElementById('pos_v');
        var phoneValidation = document.getElementById('mob_v');

        fullNameValidation.textContent = '';
        addressValidation.textContent = '';
        cityValidation.textContent = '';
        provinceValidation.textContent = '';
        postalCodeValidation.textContent = '';
        phoneValidation.textContent = '';

        var validation = true;

        // Validate Full Name
        if (fullName === '') {
            fullNameValidation.textContent = 'Please enter your full name';
            validation = false;
            
        } else {
            fullNameValidation.textContent = '';
        }

        // Validate Address
        if (address === '') {
            addressValidation.textContent = 'Please enter your address';
            validation = false;
        } else {
            addressValidation.textContent = '';
        }

        // Validate City
        if (city === '') {
            cityValidation.textContent = 'Please enter your city';
            validation = false;
        } else {
            cityValidation.textContent = '';
        }

        // Validate Province
        if (province === '') {
            provinceValidation.textContent = 'Please enter your province';
            validation = false;
        } else {
            provinceValidation.textContent = '';
        }
        // Validate Postal Code
        var postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        if (postalCode === '' || !postalCodeRegex.test(postalCode)) {
            postalCodeValidation.textContent = 'Please enter a valid postal code (e.g., A1A 1A1)';
            validation = false;
        } else {
            postalCodeValidation.textContent = '';
        }
        // Validate Phone Number
        var phoneRegex = /^\d{10}$/;
        if (phone === '' || !phoneRegex.test(phone)) {
            phoneValidation.textContent = 'Please enter a valid 10-digit phone number';
            validation = false;
        } else {
            phoneValidation.textContent = '';
        }
        if(validation == true){
            $('#fullNameModal').modal('show');
        }
    });

    document.getElementById('nav_login_button').addEventListener("click", () => toggleValidation());
});

// 1 -- function to check weather the cart is empty or not
function check_empty_cart(product_list){
    
        var empty_div = document.createElement('div');
        empty_div.classList = 'empty';
        
        // fetching the products div from cart.html
        var products = document.querySelector('.products');
        products.style.position = 'relative';
        products.appendChild(empty_div);
        products.style.minHeight = '100px'; 
        // products.style.border = '1px solid black';

        empty_div.innerHTML = '<h3>Cart is Empty</h3>';
        
}

// 2-- function to display product on the screen
function display_products(product_list){
    product_list.forEach((item, index) => {
        var cart_single_product1 = gym_products.filter(product => {
            if(product.productid === item){
                createCards(product, index);
                total_cart_price = total_cart_price + product.discountPrice;
            }
        });
        var cart_yoga_product1 = yoga_products.filter(product => {
            if(product.productid === item){
                createCards(product, index);
                total_cart_price = total_cart_price + product.discountPrice;
            }
        });
        var cart_supplement_product1 = supplement_products.filter(product => {
            if(product.productid === item){
                createCards(product, index);
                total_cart_price = total_cart_price + product.discountPrice;
            }
        });
    });
}

// 3-- function to create design for the product in the cart
function createCards(data, index){
    const cardDiv = document.createElement('div');
        cardDiv.classList.add('product_card');
    cardDiv.innerHTML = `
        <div class="card" style="border: none">
            <div class="row no-gutters">
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <img class="card-img img-thumbnail" id="product_image_${data.productid}" src="${data.imageURL}" alt="product Image" width="100%">
                </div>
                <div class="col-xl-9 col-lg-8 col-md-6 col-sm-6">
                    <div class="card-body">
                        <h5 class="card-title">${data.productname}</h5>
                        <p class="card-text mb-1"><small class="text-muted">${data.productdetail}</small></p>
                        <p class="price-cart fs-5 fw-bold p-0 m-0" id="discounted-price">$ <span class="only-price">${data.discountPrice}</span></p>
                        <div class="d-flex justify-content-between align-items-end mt-auto"  id="edit-product-cart">
                            <span>
                            <label for="cart_qty">Qty:</label>
                            <input type="number" id="cart_qty" class="cart-qty" min="1" max="${data.totalquantity}" value="${quantity[index]}">
                            </span>
                            <span>
                                <i class="bi bi-trash3 fs-4 p-2 bg delete_cart_product" data-toggle="tooltip" data-placement="bottom" title="Delete from the cart"></i>
                            </span>                                    
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
     `;
    cartProductContainer.appendChild(cardDiv);
    //Handling on click event for product images - navigate to product details page
    document.getElementById(`product_image_${data.productid}`).addEventListener("click", (event) => {
        window.location.href = '/product/' + data.productid;
    });
}

// 4 -- function to calculate total price

function total_price(){
    var price = document.getElementsByClassName('only-price');
    var cart_quantity = document.querySelectorAll('.cart-qty');
    var total_product = document.getElementById('total_quantity');
    var badge = document.getElementById('cart_items_badge');
    var total_count = 0;
    var price_of_cart = parseFloat(0);
    for(var i=0; i<price.length; i++){
        price_of_cart = price_of_cart + (price[i].textContent * cart_quantity[i].value);
        total_count = total_count + parseInt(cart_quantity[i].value); 
    }
    var sub_total = document.getElementById('sub_total');
    var tax = document.getElementById('taxes');
    sub_total.innerHTML = `${price_of_cart}`
    var tax_calculation = price_of_cart * 0.13;
    tax_calculation = tax_calculation;
    tax.innerHTML = `${tax_calculation.toFixed(2)}`; 
    var sum = tax_calculation + price_of_cart;
    var total = document.getElementById('total');
    total.innerHTML = `${sum.toFixed(2)}`;
    total_product.innerHTML = total_count;
    badge.innerHTML = total_count;

    if(total_count == 0){
        check_empty_cart();
    }
}

// 5 - function to keep any eye on the quantity
function changed_qty(){
    var qty = document.getElementsByClassName('cart-qty');
    var total_product = document.getElementById('total_quantity');
    // var total_count = 0;
    var title = document.getElementsByClassName('card-title');
    var changed_q = 0;
    for (var i = 0; i < qty.length; i++) {
        // Create a closure to capture the value of i for each iteration
        // total_count = total_count + parseInt(qty[i].value); 
        (function(index) {
            qty[index].addEventListener('change', function() {
                changed_q = this.value; //this will set the variabel with new quantity
                total_price();
            });
        })(i); // Pass current value of i to the closure
        // total_count = total_count + parseInt(qty[i].value); 
    }
    // total_product.innerHTML = total_count;
    
}
//Urvesh Patel
function toggleValidation() {
    var isValid = sessionStorage.getItem("isValid");
    // If isValid is null or false, redirect to signup.html
    if (!isValid || isValid === "false") {
        window.location.href = '../html/signup.html';
    } else {
        window.location.href = '../html/details.html';
    }
}