$('.modal-trigger').leanModal();
console.log(root);


var login = function () {
    var uname = document.getElementById("email").value;
    var pass = document.getElementById("password").value;
    loginGet(uname, pass);
};

var changeHeading = function() {
    return 0;
};

var doRevealFillIn = function() {
    this[0].style.Color = "red";
};

var loginSwitch = function (num) {
    if (num > 0) {
        $(".login-content").show();
        $(".register-content").hide();
    } else {
        $(".register-content").show();
        $(".login-content").hide();
    }
};

var registerUser = function () {
    var email = $("#user-email").val();
    var password = $("#user-password").val();
    var username = $("#user-username").val();
    var denomination = $("#user-denomination").val();
    var zipcode = $("#user-zipcode");
    var bio = $("#bio").val();
};
var loginSwitch = function(num) {
  if (num > 0) {
    $(".login-content").show();
    $(".register-content").hide();
  } else {
    $(".register-content").show();
    $(".login-content").hide();
  }
};

var registerChurch = function () {
    var email = $("#church-email").val();
    var password = $("#church-password").val();
    var username = $("#church-username").val();
    var denomination = $("#church-denomination").val();
    var link = $("#church-link").val();
    var zipcode = $("#church-zipcode");
    var description = $("#bio").val();

    registerChurchPost(denomination, description, email, link, password, "", username, zipcode);

}

var changeHeading = function(key) {
  var val = headingGet(key);
  $(".brand-logo").text(val);
}

var goFrontPage = function() {
  var global = true;
  if (loggedIn && !($("#global-choice").val())) {
    
  }
}

$(document).ready(function () {
    $(".register-content").hide(); // hides the registration content on the login modal.
    $('.modal-trigger').leanModal();

});
