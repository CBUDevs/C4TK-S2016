$(document).ready(function () {

    $('.modal-trigger').leanModal();
    console.log(root);
});

var login = function () {
    var uname = document.getElementById("Usernanme").value;
    var pass = document.getElementById("Password").value;
    loginGet(uname, pass);
};