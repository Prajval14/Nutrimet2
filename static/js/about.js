document.addEventListener("DOMContentLoaded", function(event) {
    // animateOnScroll();
  });
  
  function animateOnScroll() {
    var images = document.querySelectorAll('#leadership-image');
  
    function fadeIn(element, duration) {
      var opacity = 0;
      var interval = 50;
      var gap = interval / duration;
  
      function func() {
        opacity += gap;
  
        if (opacity >= 1) {
          clearInterval(fading);
        }
  
        element.style.opacity = opacity;
      }
  
      var fading = setInterval(func, interval);
    }
  
    function checkInView(element) {
      var bounding = element.getBoundingClientRect();
      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  
    function handleScroll() {
      images.forEach(function(image) {
        if (checkInView(image) && !image.classList.contains('animated')) {
          fadeIn(image, 1000);
          image.classList.add('animated');
        }
      });
    }
  
    // Initial check when the page loads
    handleScroll();
  
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
  }
  