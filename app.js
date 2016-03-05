
    $('.modal-trigger').leanModal();
    console.log(root);
});

var login = function () {
    var uname = document.getElementById("email").value;
    var pass = document.getElementById("password").value;
    loginGet(uname, pass);
};

var register(){
    
};

var changeHeading(){
    
};

var

var loginSwitch = function(num) {
  if (num > 0) {
    $(".login-content").show();
    $(".register-content").hide();
  } else {
    $(".register-content").show();
    $(".login-content").hide();
  }
}

$(document).ready(function () {
  $(".register-content").hide(); // hides the registration content on the login modal.
  $('.modal-trigger').leanModal();
  
});
