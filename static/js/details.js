document.addEventListener("DOMContentLoaded", function (event) {
  var name = document.getElementById("Full_Name");
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  var phone = document.getElementById("mobileNumber");
  var updateAddress = document.getElementById("address");

  // Call onPageLoad when the DOM content is fully loaded
  onPageLoad(name, email, password, phone, updateAddress);

  //Footer JS
  const footerYear = document.getElementById('current_Year');
  footerYear.innerHTML = new Date().getFullYear();


  document.querySelector("#updateButton").addEventListener("click", function () {
    // Send the data in the fetch request
    var userNewDetails = {
      password: password.value,
      mobile: phone.value,
      address: updateAddress.value
    };
    userNewDetails.address = updateAddress.value != "" ? updateAddress.value : 'remove';
    userNewDetails.mobile = phone.value != "" ? phone.value : 'remove';
    if(userNewDetails.password == ""){
      document.getElementById('popOverLabel').innerHTML = 'Failed!';
      document.getElementById('popover-message').innerHTML = 'Password cannot be empty.';
      var myModal = new bootstrap.Modal(
        document.getElementById("popOver"),
        {}
      );
      myModal.show();
      document.getElementById('popover-close').addEventListener('click', () => {
        myModal.hide();
      });
    }
    else {
      fetch('/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Request-Type': 'updateuser'
        },
        body: JSON.stringify(userNewDetails)
      })
      .then(response => response.json())
      .then(data => {
        if (data.update_success) {
          document.getElementById('popOverLabel').innerHTML = 'Success!';
          document.getElementById('popover-message').innerHTML = data.message;
        }
        else {
          document.getElementById('popOverLabel').innerHTML = 'Failed!';
          document.getElementById('popover-message').innerHTML = data.message;
        }
        document.getElementById('popover-close').addEventListener('click', () => {
          window.location.reload();
        });
        var myModal = new bootstrap.Modal(
          document.getElementById("popOver"),
          {}
        );
        myModal.show();
      })
      .catch(error => console.error('Error:', error));
    }
  });
});

function onPageLoad(name, email, password, phone, updateAddress) {
  // debugger
  var F_Name = user_details[0].first_name;
  var L_Name = user_details[0].last_name;
  var Email = user_details[0].email;
  var Password = user_details[0].password;
  var Address  = user_details[0].address;
  var Phone = user_details[0].mobile;
  var Full_Name = F_Name + " " + L_Name;

  name.value = Full_Name;
  email.value = Email;
  password.value = Password;
  phone.value = Phone;
  updateAddress.value = Address;
}

function updateDetails() {

  var updateAddress = document.getElementById("address");
  var phoneNumber = document.getElementById("mobileNumber");
  var mobileNumberError = document.getElementById('mobileNumberError');
  var delAddress = updateAddress.value;

 

  var telNumber = phoneNumber.value;

  sessionStorage.setItem("phoneNumber",telNumber);
  sessionStorage.setItem("userAddress", delAddress);
  
  // Call displayMessage function with appropriate title and content
  var myModal = new bootstrap.Modal(
    document.getElementById("successModal"),
    {}
  );
  myModal.show();
}

function closeDetails() {
  window.location.href = "/";
}

function closeUpDetails()
{
  window.location.href = window.location.href;
}

function togglePasswordVisibility() {
  var passwordInput = document.getElementById("password");
  var buttontext = document.getElementById("btntext");
  if (passwordInput.type === "password") {
      passwordInput.type = "text";
      buttontext.innerText = 'Hide';
  } else {
      passwordInput.type = "password";
      buttontext.innerText = 'Show';
  }
}

//logout
function resetSession() {
  fetch('/', {
    method: 'GET',
    headers: {
        'X-Request-Type': 'logout'
    },
  })
  .then(response => (response.json()))
  .then(data => {
    if(data.logout_success)
    {
      window.location.href = "/";
    }
    else {
      document.getElementById('popOverLabel').innerHTML = 'Failed!';
      document.getElementById('popover-message').innerHTML = 'Logout Failed for some reason. Contact support! ';
      document.getElementById('popover-close').addEventListener('click', () => {
        window.location.reload();
      });
      var myModal = new bootstrap.Modal(
        document.getElementById("popOver"),
        {}
      );
      myModal.show();
    }
  })
  .catch(error => console.error('Error:', error));
}

function displayMessage(title, content) {
  var modalTitle = document.getElementById("commonMsgModalLabel");
  var modalContent = document.getElementById("commonMsgContent");

  modalTitle.innerText = title;
  modalContent.innerText = content;

  $("#commonMsgModal").modal("show");
}

// Example usage:
// displayMessage("Success!", "Registration successful! Your registration was successful. Thank you!");
