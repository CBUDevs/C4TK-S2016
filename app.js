// GLOBAL VARS
var root = 'https://c4tk.firebaseio.com/';
var user = "https://c4tk.firebaseio.com/users/0";
var loggedIn = false;


// MIDDLE FUNCTIONS


var login = function () {
    var uname = document.getElementById("email").value;
    var pass = document.getElementById("password").value;
    loginGet(uname, pass);
};

var doRevealFillIn = function (self) {
    console.log(self);
    self.style.background = "white";
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

    registerUserPost(bio, denomination, email, password, "", username);
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

var changeHeading = function (key) {
    var val = headingGet(key);
    $(".brand-logo").text(val);
};

var goFrontPage = function () { // Needs to be changed from console.log to the actual divs.
    var recommended, followed;
    var global = true;
    if (loggedIn) {
        if (!($("#global-choice").val())) {
            recommended = frontPageGet(false);
        }
        followed = frontPageActivityGet();
    }
    recommended = frontPageGet(true);

    for (var i = 0; i < recommended.length; i++) {
        console.log(recommended[i]);
    }

    for (var i = 0; i < followed.length; i++) {
        console.log(followed[i]);
    }
}


var doSearch = function () {
    var churches = searchData($('#search').val()[0]);
    var sermons = searchData($('#search').val()[1]);

    for (var i = 0; i < churches.length; i++) {
        console.log(churches[i]);
    }
    for (var i = 0; i < sermons.length; i++) {
        console.log(sermons[i]);
    }
}

var goProfilePage = function (key) {
    var profileInfo = profileGet(key);
    $("#profile-username").text(profileInfo.username);
    if (profileInfo.link)
        $("#profile-link").text(profileInfo.link);
    if (profile.followers)
        $("#follower-count").text(profileInfo.followers);
    $("#denomination").text(profileInfo.denomination);
    if (profileInfo.description)
        $("#description").text(profileInfo.description);
    else
        $("#bio").text(profileInfo.bio);
    if (profileInfo.sermons) {
        for (var i = 0; i < profileInfo.sermons; i++) {
            console.log(profileInfo.sermons[i]);
        }
    }
}

var doProfileEdit = function (key) {
    var profileInfo = profileGet(key);
    $("#profile-username").text(profileInfo.username);
    if (profileInfo.link)
        $("#profile-link").text(profileInfo.link);
    if (profile.followers)
        $("#follower-count").text(profileInfo.followers);
    $("#denomination").text(profileInfo.denomination);
    if (profileInfo.description)
        $("#description").text(profileInfo.description);
    else
        $("#bio").text(profileInfo.bio);
    if (profileInfo.sermons) {
        for (var i = 0; i < profileInfo.sermons; i++) {
            console.log(profileInfo.sermons[i]);
        }
    }
}

var doProfileSubmit = function (key, user) {
    var following = new Array();
    var bio = $("#bio").val();
    var denomination = $("#denomination").val();
    var email = $("#email").val();
    $(".following").each(function () {
        following.push($(this).val());
    });
    var password = $('#password').val();
    var picture = $('#picture').val();
    var username = $('#username').val();

    if (bio != "" && denomination != "" && email != "" && password != "" && picture != "" && username != "") {
        profilePost(key, bio, denomination, email, following, password, picture, username);
    }
}

var goChurchPage = function (key) {
    var church = churchGet(key);
    console.log(church.denomination);
    console.log(church.description);
    console.log(church.followers);
    console.log(church.link);
    console.log(church.sermons);
}

var doSwitchContext = function (context, target) {
    var templatesDir = "/Templates/";
    var translate = {
        "churchProfile": "churchProfile.html",
        "churchProfileTemplate": "churchProfileTemplate.html",
        "frontPage": "frontPage.html",
        "personalProfile": "personalProfile.html",
        "personalProfileTemplate": "personalProfileTemplate.html",
        "sermonPage": "sermonPage.html",
        "sermonPageTemplate": "sermonPageTemplate.html",
        "searchPage": "searchPage.html"
    };
    $(".container").load(templatesDir + translate[context]);

}

// FIREBASE FUNCTIONS
var loginGet = function (email, password) {
    var ref = new Firebase(root).child("users");
    ref.on("value", function (snapshot) {
        snapshot.forEach(function (user) {
            if (user.val().email.toLowerCase() == email.toLowerCase() && user.val().password.toLowerCase() == password.toLowerCase()) {
                loggedIn = true;
                user = user.val();
                return true;
            }
        });
    });
}

var registerUserPost = function (bio, denomination, email, password, picture, username, zipcode) {
    var ref = new Firebase(root).child("users");
    ref.on("value", function (snapshot) {
        snapshot.forEach(function (user) {
            if (user.val().email == email) {
                return false;
            }
        });
    });
    ref.push({
        bio: bio,
        denomination: denomination,
        email: email,
        password: password,
        picture: picture,
        username: username,
        zipcode: zipcode,
    });

    ref.endAt().limit(1).on('child_added', function (snapshot) {
        // all records after the last continue to invoke this function
        user = snapshot.val();
        console.log(user);
        return true;
    });
}

var registerChurchPost = function (denomination, description, email, link, password, picture, username, zipcode) {
    var ref = new Firebase(root).child("churches");
    ref.on("value", function (snapshot) {
        snapshot.forEach(function (church) {
            if (church.val().email == email) {
                return false;
            }
        });
    });
    ref.push({
        denomination: denomination,
        email: email,
        link: link,
        password: password,
        picture: picture,
        username: username,
        zipcode: zipcode,
    });

    ref.endAt().limit(1).on('child_added', function (snapshot) {
        // all records after the last continue to invoke this function
        user = snapshot.val();
        console.log(user);
        return true;
    });
}

var logout = function () {
    loggedIn = false;
}

var headingGet = function (userKey) { // Returns the username of the profile. 
    var ref = new Firebase(userKey).child('username');
    ref.on("value", function (snapshot) {
        return snapshot.val();
    });
};

var frontPageGet = function (global) {
    var topFollowed, topSermons, ref = new Firebase(root);
    ref.child("hot").on("value", function (snapshot) {
        snapshot.forEach(function (post) {
            var postRef = new Firebase(post.val().sermonReference).parent().parent();
            var userRef = new Firebase(user).child("zipcode");
            if (global) {
                topSermons.push(post.val());
            } else {
                postRef.on("value", function (postSnapshot) {
                    userRef.on("value", function (userSnapshot) {
                        if (postSnapshot.val().zipcode === userSnapshot.val()) {
                            topSermons.push(post.val());
                        }
                    });
                });
            }
        });
    });

    if (loggedIn) {
        topFollowed = frontPageActivityGet();
    }
    return topFollowed;
}

var frontPageActivityGet = function () { // Gathers the top 10 sermons from the users followed churches.
    var churchArray = [],
        top10 = [];

    var ref = new Firebase(user).child("following");
    console.log(ref.toString());
    ref.on("value", function (snapshot) {
        snapshot.forEach(function (church) {
            console.log(church.val());
            var churchRef = new Firebase(church.val()).child("sermons");
            churchRef.on("value", function (churchSnapshot) {
                churchSnapshot.forEach(function (churchVal) {
                    var churchObj = churchVal.val();
                    churchObj.key = church.val();
                    churchArray.push(churchObj);
                });
            });
        });
    });

    // Right now, the sorting seems to return before the values are given and sorted. :/
    churchArray.sort(function (a, b) {
        return b.time - a.time;
    });

    if (churchArray.length > 10) {
        var j = 10;
    } else {
        var j = churchArray.length;
    }

    for (var i = 0; i < j; i++) {
        top10[i] = churchArray[i];
    }
    console.log(churchArray);
    return top10;

}

var sermonGet = function (sermonKey) {
    var ref = new Firebase(sermonKey);
    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        return snapshot.val();
    });
}

var churchGet = function (churchKey) {
    var ref = new Firebase(churchKey);
    ref.on("value", function (snapshot) {
        return snapshot.val();
    });
}

var searchData = function (search) {
    var churchArray = new Array();
    var sermonArray = new Array();
    var ref = new Firebase(root).child("churches");
    ref.on("value", function (snapshot) {
        snapshot.forEach(function (church) {
            if (church.val().username.toLowerCase().indexOf(search) >= 0 || church.val().zipcode.toLowerCase().indexOf(search) >= 0) {
                churchArray.push(church.val());
            }
            church.val().sermons.forEach(function (sermon) {
                if (sermon.title.toLowerCase().indexOf(search) >= 0) {
                    sermonArray.push(sermon);
                }
            });
        });
    });

    console.log(new Array(churchArray, sermonArray));
}

var profileGet = function (profileKey) {
    var ref = new Firebase(profileKey);
    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        return snapshot.val();
    });
}

var profilePost = function (profileKey, bio, denomination, email, following, password, picture, username) {
    var profile = new Firebase(profileKey);
    profile.update({
        bio: bio,
        denomination: denomination,
        email: email,
        following: null,
        password: password,
        picture: picture,
        username: username,
    });


    for (var i = 0; i < following.length; i++) {
        profile.child("following").push(following[i]);
    }
}

var sermonPost = function (churchKey, title, notes) {
    var church = new Firebase(churchKey);
    church.child("sermons").push({
        attendance: 0,
        downvotes: 0,
        notes: notes,
        time: Date.now(),
        title: title,
        upvotes: 0,
    });
}

var sermonDelete = function (sermonKey) {
    var sermon = new Firebase(sermonKey);
    sermon.remove();
}

var incrementAttendance = function (sermonKey) {
    var sermon = new Firebase(sermonKey);
    var value;
    var checked = false;
    sermon.once("value", function (snapshot) {
        if (!checked) {
            value = snapshot.val().attendance + 1;
            checked = true;
        }
        sermon.update({
            attendance: value,
        });
    });
}

var upvote = function (postKey, profileKey) { // Activates an upvote.
    var postRef = new Firebase(postKey);
    var profileRef = new Firebase(profileKey);
    var userRef = new Firebase(user);
    var value = 0;
    var checked = false;

    if (loggedIn) { // Checks if the user is logged in.
        // Checks to see how if the user has already upvoted and, if so, forbids them from upvoting again.
        userRef.child("upvoted").once("value", function (snapshot) {
            if (snapshot.val() == null) {
                userRef.child("upvoted").push(postKey);
                postRef.once("value", function (snapshot) {
                    if (!checked) {
                        value = snapshot.val().upvotes + 1;
                        checked = true;
                    }
                    postRef.update({
                        upvotes: value,
                    });
                });
                checked = false;
                profileRef.once("value", function (profileSnapshot) {
                    if (!checked) {
                        value = profileSnapshot.val().totalUpvotes + 1;
                        checked = true;
                    }
                    profileRef.update({
                        totalUpvotes: value,
                    });
                });
                return 0;
            }
            snapshot.forEach(function (sermon) {
                if (sermon.val() == postKey) {
                    return 0;
                }
                // Checks to see if the user has downvoted the post. If so, take away from the downvote variable rather than the upvote variable.
                userRef.child("downvoted").on("value", function (snapshot) {
                    snapshot.forEach(function (sermon) {
                        if (sermon.val() == postRef.val()) {
                            sermon.remove();
                            postRef.once("value", function (postSnapshot) {
                                if (!checked) {
                                    value = postSnapshot.val().downvotes - 1;
                                    checked = true;
                                }
                                postRef.update({
                                    downvotes: value,
                                });
                            });
                            checked = false;
                            profileRef.once("value", function (profileSnapshot) {
                                if (!checked) {
                                    value = profileSnapshot.val().totalDownvotes - 1;
                                }
                                profileRef.update({
                                    totalDownvotes: value,
                                });
                            });
                            return 0;
                        }
                        // Else,increment the upvote variables.
                        userRef.child("upvoted").push(postKey);
                        postRef.once("value", function (snapshot) {
                            if (!checked) {
                                value = snapshot.val().upvotes + 1;
                                checked = true;
                            }
                            postRef.update({
                                upvotes: value,
                            });
                        });
                        checked = false;
                        profileRef.once("value", function (profileSnapshot) {
                            if (!checked) {
                                value = profileSnapshot.val().totalUpvotes + 1;
                                checked = true;
                            }
                            profileRef.update({
                                totalUpvotes: value,
                            });
                        });
                        return 0;
                    });
                });
            });
        });
    }
}

var downvote = function (postKey, profileKey) { // Activates an downvote.
    var postRef = new Firebase(postKey);
    var profileRef = new Firebase(profileKey);
    var userRef = new Firebase(user);
    var value = 0;
    var checked = false;

    if (loggedIn) { // Checks if the user is logged in.
        // Checks to see how if the user has already downvoted and, if so, forbids them from downvoting again.
        userRef.child("downvoted").once("value", function (snapshot) {
            if (snapshot.val() == null) {
                userRef.child("downvoted").push(postKey);
                postRef.once("value", function (snapshot) {
                    if (!checked) {
                        value = snapshot.val().downvotes + 1;
                        checked = true;
                    }
                    postRef.update({
                        upvotes: value,
                    });
                });
                checked = false;
                profileRef.once("value", function (profileSnapshot) {
                    if (!checked) {
                        value = profileSnapshot.val().totalDownvotes + 1;
                        checked = true;
                    }
                    profileRef.update({
                        totalDownvotes: value,
                    });
                });
                return 0;
            }
            snapshot.forEach(function (sermon) {
                if (sermon.val() == postKey) {
                    return 0;
                }
                // Checks to see if the user has upvoted the post. If so, take away from the upvote variable rather than the downvote variable.
                userRef.child("upvoted").on("value", function (snapshot) {
                    snapshot.forEach(function (sermon) {
                        if (sermon.val() == postRef.val()) {
                            sermon.remove();
                            postRef.once("value", function (postSnapshot) {
                                if (!checked) {
                                    value = postSnapshot.val().upvotes - 1;
                                    checked = true;
                                }
                                postRef.update({
                                    upvotes: value,
                                });
                            });
                            checked = false;
                            profileRef.once("value", function (profileSnapshot) {
                                if (!checked) {
                                    value = profileSnapshot.val().totalUpvotes - 1;
                                }
                                profileRef.update({
                                    totalUpvotes: value,
                                });
                            });
                            return 0;
                        }
                        // Else,increment the upvote variables.
                        userRef.child("downvoted").push(postKey);
                        postRef.once("value", function (snapshot) {
                            if (!checked) {
                                value = snapshot.val().downvotes + 1;
                                checked = true;
                            }
                            postRef.update({
                                downvotes: value,
                            });
                        });
                        checked = false;
                        profileRef.once("value", function (profileSnapshot) {
                            if (!checked) {
                                value = profileSnapshot.val().totalDownvotes + 1;
                                checked = true;
                            }
                            profileRef.update({
                                totalDownvotes: value,
                            });
                        });
                        return 0;
                    });
                });
            });
        });
    }
}

var follow = function (churchKey) {
    var churchRef = new Firebase(churchKey);
    var userRef = new Firebase(user);
    var value;
    var checked = false;

    if (loggedIn) {
        userRef.child("following").push({
            churchKey
        });

        churchRef.once("value", function (snapshot) {
            if (!checked) {
                value = snapshot.val().followers + 1;
                checked = true;
            }
            churchRef.update({
                followers: value,
            });
        });
    }
}

var unfollow = function (churchKey) {
    var churchRef = new Firebase(churchKey);
    var userRef = new Firebase(user);
    var value;
    var checked = false;

    if (loggedIn) {
        userRef.child("following").on("value", function (snapshot) {
            snapshot.forEach(function (church) {
                if (church.val() == churchKey)
                    church.remove();
            });
        });

        churchRef.once("value", function (snapshot) {
            if (!checked) {
                value = snapshot.val().followers - 1;
                checked = true;
            }
            churchRef.update({
                followers: value,
            });
        });
    }
}

$(document).ready(function () {
    $(".register-content").hide(); // hides the registration content on the login modal.
    $('ul.tabs').tabs();
    $('.modal-trigger').leanModal();
    doSwitchContext("frontPage");
});

$("#search").keyup(function(event){
    if(event.keyCode == 13){
        doSwitchContext("searchPage");
    }
});