document.addEventListener('DOMContentLoaded', function() {
    //Footer JS
    const footerYear = document.getElementById('current_Year');
    footerYear.innerHTML = new Date().getFullYear();

    // Navbar JS
    document.getElementById('nav_login_button').addEventListener("click", () => window.location.href = '/profile');
    document.getElementById('search_input').addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            window.location.href = './products.html?searched_product=' + document.getElementById('search_input').value;
        }
    });
});