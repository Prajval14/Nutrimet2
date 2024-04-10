function onPageLoad() {
  var F_Name = sessionStorage.getItem("f_name");
  var L_Name = sessionStorage.getItem("l_name");
  var Email = sessionStorage.getItem("userName_R");
  var Password = sessionStorage.getItem("password_R");
  var Address  = sessionStorage.getItem("userAddress");
  var Phone = sessionStorage.getItem("phoneNumber");
  var Full_Name = F_Name + " " + L_Name;

  var name = document.getElementById("Full_Name");
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  var phone = document.getElementById("mobileNumber");
  var updateAddress = document.getElementById("address");
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
  window.location.href = "../index.html";
}

function closeUpDetails()
{
  window.location.href = window.location.href;
}

function resetSession() {
  sessionStorage.clear();
  window.location.href = "../index.html";
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

document.addEventListener("DOMContentLoaded", function (event) {
  // Call onPageLoad when the DOM content is fully loaded
  onPageLoad();
});

document.querySelector("#updateButton").addEventListener("click", function () {
  updateDetails();
});