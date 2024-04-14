document.addEventListener('DOMContentLoaded', function() {
    //Footer JS
    const footerYear = document.getElementById('current_Year');
    footerYear.innerHTML = new Date().getFullYear();

    // Navbar JS
    document.getElementById('search_input').addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            window.location.href = './products.html?searched_product=' + document.getElementById('search_input').value;
        }
    });
    document.getElementById('nav_login_button').addEventListener("click", () => toggleUserPage());
});

function toggleUserPage() {
    // debugger
    if (is_user_logged_in) {
        window.location.href = '/profile/' + user_email;
    } else {
        window.location.href = '/signup';
    }
}