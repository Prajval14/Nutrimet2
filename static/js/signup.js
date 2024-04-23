
function toggleForms(formId) {
  var signupForm = document.getElementById("signupForm");
  var loginForm = document.getElementById("loginForm");
  const cylindricalContainer = document.getElementById('cylindricalContainer');
  const slider = document.getElementById('slider');
  var indicator = document.querySelector('.indicator');
  var signupButton = document.getElementById("signupButton");
  var loginButton = document.getElementById("loginButton");

  if (formId === "signupForm") {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    slider.style.transform = 'translateX(0)';
    signupButton.classList.add('active-button');
    loginButton.classList.remove('active-button');
  } else if (formId === "loginForm") {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    slider.style.transform = 'translateX(100%)';
    signupButton.classList.remove('active-button');
    loginButton.classList.add('active-button');
  }
}

function changeText() {
  var textHeadings = ["TRACK YOUR ORDERS", "SHOP YOUR WAY","SAVE WHAT YOU SEE", 
                      "FREE NUTRIMET TRAIN ACCESS"];
  var textDescriptions = ["Keep track the status of your orders", 
                        "Discover the latest launches and be the first to get notifications for new drops",
                        "Save your most-loved activewear pieces to build your perfect outfit",
                        "Level up your training, with The Nutrimets Product"];
  var index = Math.floor(Math.random() * textHeadings.length);

  document.getElementById('textHeading').textContent = textHeadings[index];
  document.getElementById('textDescription').textContent = textDescriptions[index];
}

// Change text content every 3 seconds
// setInterval(changeText, 3000);


function errorValidate(isError)
{ 

  var f_Name = document.getElementById("f_name").value.trim();
  var l_Name = document.getElementById("l_name").value.trim();
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("cnfpassword").value;
  var email = document.getElementById("email").value.trim();
  var containsSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
  var emailVerify =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  var errors = false;
  
    
    if (f_Name === '') {
        document.getElementById('firstNameError').innerText = 'Please enter your first name';
        errors = true;
    } else {
        document.getElementById('firstNameError').innerText = '';
    }
    if (l_Name === '') {
        document.getElementById('lastNameError').innerText = 'Please enter your last name';
        errors = true;
    } else {
        document.getElementById('lastNameError').innerText = '';
    }
    if (password === '') {
        document.getElementById('passwordError').innerText = 'Please enter a password';
        errors = true;
    }
    else if(!containsSpecialChar){
        document.getElementById('passwordError').innerText=("Password must contain at least one number and one special character.");
        return false;  
    } 
    else {
        document.getElementById('passwordError').innerText = '';
    }

    if (confirmPassword === '') {
        document.getElementById('confirmPasswordError').innerText = 'Please confirm your password';
        errors = true;
    } 
    else if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').innerText = 'Passwords do not match';
        errors = true;
    } else {
        document.getElementById('confirmPasswordError').innerText = '';
    }

    if (email === '') {
      document.getElementById('emailError').innerText = 'Please enter your email';
      errors = true;
  }
  else if(!emailVerify){
      document.getElementById('emailError').innerText=("Not a Valid Email.");
      return false;  
  }  
  else {
      document.getElementById('emailError').innerText = '';
  }

    if(!errors)
    {
      isError = true;
    }
return isError;
}

function validateForms() {
  var f_Name = document.getElementById("f_name").value;
  var l_Name = document.getElementById("l_name").value;

  var isError = false;
  isError = errorValidate(isError);

  if(isError)
  {
    // Send the data in the fetch request
    var signinDetails = {
      first_name: f_Name,
      last_name: l_Name,
      email: email.value,
      password: password.value
    };
    
    fetch('/profile', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-Request-Type': 'signup'
      },
      body: JSON.stringify(signinDetails)
    })
    .then(response => response.json())
    .then(data => {
      
      if(!data.signup_success) {
        document.getElementById('popOverLabel').innerHTML = 'Failed!';
        document.getElementById('popover-message').innerHTML = 'Registration Un-successful! Try Again!';
        document.getElementById('popover-close').addEventListener('click', () => {
          window.location.reload();
        });
      } else {
        document.getElementById('popOverLabel').innerHTML = 'Success!';
        document.getElementById('popover-message').innerHTML = 'Registration successful! Your registration was successful. Thank you!';
        document.getElementById('popover-close').addEventListener('click', () => {
          toggleForms("loginForm");
        });
      }
      var myModal = new bootstrap.Modal(
        document.getElementById("popOver"),
        {}
      );
      myModal.show();
    })
    .catch(error => console.error('Error:', error));
  }
  return false;
}

function closebutton() {
  toggleForms("loginForm");
  document.getElementById("form-data").reset();
}

function loginValidation() {
  // debugger
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;
  var isError = false;
  
  if (email === '') {
    document.getElementById('loginError').innerText = 'Please enter your email';
    isError = true;
  }
  else {
    document.getElementById('loginError').innerText = null;
    isError = false;
  }
  if(password === '') {
    document.getElementById('passError').innerText = 'Please enter your password';
    isError = true;
  }
  else {
    document.getElementById('passError').innerText = null;
    isError = false;
  }

  if(!isError)
  {
    // Send the data in the fetch request
    var loginDetails = {
      email: email,
      password: password
    };
    fetch('/profile', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-Request-Type': 'login'
      },
      body: JSON.stringify(loginDetails)
    })
    .then(response => response.json())
    .then(data => {
      if (data.user_exists) {
        if (data.correct_password) {
            document.getElementById('popOverLabel').innerHTML = 'Success!';
            document.getElementById('popover-message').innerHTML = data.message;
            document.getElementById('popover-close').addEventListener('click', () => {
              window.location.href = "/";
            });
        } else {
            document.getElementById('popOverLabel').innerHTML = 'Failed!';
            document.getElementById('popover-message').innerHTML = data.message;
        }
      } else {
          document.getElementById('popOverLabel').innerHTML = 'Failed!';
          document.getElementById('popover-message').innerHTML = data.message;
      }
      var myModal = new bootstrap.Modal(
        document.getElementById("popOver"),
        {}
      );
      myModal.show();
    })
    .catch(error => console.error('Error:', error));
    }
  return false;
}