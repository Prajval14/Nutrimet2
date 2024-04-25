document.addEventListener('DOMContentLoaded', function() {
    const cartBadge = document.getElementById('cart_items_badge');
    const navbarBadge = document.getElementById('navbar_toggler_icon_badge');
    
    //Footer JS
    const footerYear = document.getElementById('current_Year');
    footerYear.innerHTML = new Date().getFullYear();

    // Navbar JS
    document.getElementById('nav_login_button').addEventListener("click", () => window.location.href = '/profile');
    document.getElementById('nav_cart_button').addEventListener("click", () => window.location.href = '/mycart');
    document.getElementById('search_input').addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            window.location.href = './products.html?searched_product=' + document.getElementById('search_input').value;
        }
    });
});