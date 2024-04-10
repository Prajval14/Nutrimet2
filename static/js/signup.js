
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
    var userId = document.getElementById("email").value;
    var passWordId = document.getElementById("password").value;
    sessionStorage.setItem("userName_R", userId);
    sessionStorage.setItem("password_R", passWordId);
    sessionStorage.setItem("f_name", f_Name);
    sessionStorage.setItem("l_name", l_Name);
    var myModal = new bootstrap.Modal(
      document.getElementById("successModal"),
      {}
    );
    myModal.show();
  }
 

  return false;
}
function closebutton() {
  toggleForms("loginForm");
  document.getElementById("form-data").reset();
}

function loginValidation() {
  var userName = document.getElementById("loginEmail").value;
  var l_Password = document.getElementById("loginPassword").value;

  var R_Id = sessionStorage.getItem("userName_R");
  var R_Pass = sessionStorage.getItem("password_R");

  if (R_Id == userName && l_Password == R_Pass) {
    window.location.href = "../index.html";
    sessionStorage.setItem("isValid", true);
  } else {
    if (userName === '') {
      document.getElementById('loginError').innerText = 'Please enter your Email';
      errors = true;
  } 
    else if(userName != R_Id)
    {
      document.getElementById('loginError').innerText = 'UserName Not Found!!!';
      errors = true;
    }
    else {
      document.getElementById('loginError').innerText = '';
    }
  
    if(l_Password === '')
    {
      document.getElementById('passError').innerText = 'Please enter your Password';
      errors = true;
    }
    else if (l_Password != R_Pass )
    {
      document.getElementById('passError').innerText = 'Wrong Password!!!';
      return false;
    }
    else {
      document.getElementById('passError').innerText = '';
    }
  }


  return false;
}