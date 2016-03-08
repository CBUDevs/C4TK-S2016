// GLOBAL VARS
var root = 'https://c4tk.firebaseio.com/';
user = 'https://c4tk.firebaseio.com/users/0'; //reference to logged in user
this.church = false; //whether user is a church
var loggedIn = false; //is logged in
var topGlobal = [];
var topFollowed = [];
var topRecommended = [];
var currentContext = undefined;

// MIDDLE FUNCTIONS


var login = function() {
    var uname = document.getElementById("email").value;
    var pw = document.getElementById("password").value;
    loginGet(uname, pw);
};

var doRevealFillIn = function(self) {
    console.log(self);
    self.style.background = "white";
};

var loginSwitch = function(num) {
    if (num > 0) {
        $(".login-content").show();
        $(".register-content").hide();
    }
    else {
        $(".register-content").show();
        $(".login-content").hide();
    }
};

var registerUser = function() {
    var email = $("#user-email").val();
    var password = $("#user-password").val();
    var username = $("#user-username").val();
    var denomination = $("#user-denomination").val();
    var zipcode = $("#user-zipcode");
    var bio = $("#bio").val();

    registerUserPost(bio, denomination, email, password, "", username);
};

var registerChurch = function() {
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
};

var goFrontPage = function() { // Needs to be changed from console.log to the actual divs.
    var global = true;
    if (!loggedIn) {
        $("#Recommended").hide();
    }
    // console.log(topGlobal);
    // console.log(topFollowed);
    // console.log(topRecommended);

    if (topGlobal.sermons.controversial.length < 1) {
        console.log("eyyy");
        $("<a onclick='doSwitchContext('sermonPage')'><div class='col s12'><div class='card'>" + "<div class='card-content'><h1>").text("No Posts Available").append("#Popular");
    }
    else {
      var  postList = [];
        for (var i = 0; i < topGlobal.sermons.controversial.length; i++) {
               postList.push(undefined);
        }
        
        for (var i = 0; i < topGlobal.sermons.controversial.length; i++) {
            // console.log(topGlobal.sermons.controversial);
            var ref = topGlobal.sermons.controversial[i].sermonReference.toString();
            // console.log("Ref: " + ref.toString());
            var attendance;
            var points;
            var date;
            var day;
            var month;
            var title;
            var preview;
            var denom;


            // ref.on("value", function(ss) {
            // });
            console.log("Getting ref: " + ref);

            (function(n) {
                var j = n;
                $.get(ref + ".json", function(snapshot) {
                    // console.log("Snapshot: " + JSON.stringify(snapshot));
                    postList[n] = snapshot;
                    points = snapshot['upvotes'];
                    // console.log("sadasg");
                    attendance = snapshot.attendance;
                    points = snapshot.upvotes - snapshot.downvotes;
                    date = new Date(snapshot.parenttime * 1000);
                    day = date.getDay();
                    month = date.getMonth();
                    title = snapshot.title;
                    preview = snapshot["notes"];

                    // console.log(attendance);
                    // console.log(points);
                    // console.log(date);
                    // console.log(month);
                    // console.log(title);
                    // console.log(preview);

                    //setTimeout(function() {
                    $.get("/Cards/FPPB.html", function(cardTemplate) {
                        var name = "card" + j.toString();
                        console.log("Card: " + name);
                        // console.log(response.toString());
                        var newChild = document.createElement('div');
                        document.getElementById("Popular").appendChild(newChild);
                        newChild.id = name;
                        newChild.innerHTML = cardTemplate;
                        $(name + " #views").text(attendance);
                        $("#card" + j + " #points").text(points);
                        $("#card" + j + " #day").text(day);
                        $("#card" + j + " #month").text(month);
                        $("#" + name + " #title").text(title);
                        $("#" + name + " #preview").text(preview);

                    }, 'html');
                    //}, 1000);
                }, 'json');


            })(i);
        }
    }

    //  if (topGlobal.length < 1) {

    // } else {
    //     for (var i = 0; i < topGlobal.length; i++) {

    //     }
    // }

    //  if (topGlobal.length < 1) {

    // } else {
    //     for (var i = 0; i < topGlobal.length; i++) {

    //     }
    // }
    // console.log(topGlobal.toString());
}

var frontPageSwitch = function(num) {
    if (num == 0) {
        $("#Popular").show();
        $("#Subscribed").hide();
        $("#Recommended").hide();
    }
    else if (num == 1) {
        $("#Popular").hide();
        $("#Subscribed").show();
        $("#Recommended").hide();
    }
    else {
        $("#Popular").hide();
        $("#Subscribed").hide();
        $("#Recommended").show();
    }
};

var doSearch = function() {
    var churches = searchData($('#search').val()[0]);
    var sermons = searchData($('#search').val()[1]);

    for (var i = 0; i < churches.length; i++) {
        console.log(churches[i]);
    }
    for (var i = 0; i < sermons.length; i++) {
        console.log(sermons[i]);
    }
}

var goProfilePage = function(key) {
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

var doProfileEdit = function(key) {
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

var doProfileSubmit = function() {
    var following = new Array();
    var bio = $("#bio").val();
    var denomination = $("#denomination").val();
    var email = $("#email").val();
    $(".following").each(function() {
        following.push($(this).val());
    });
    var password = $('#password').val();
    var picture = $('#picture').val();
    var username = $('#username').val();

    if (bio != "" && denomination != "" && email != "" && password != "" && picture != "" && username != "") {
        profilePost(user, bio, denomination, email, following, password, picture, username);
    }
}

var goChurchPage = function(key) {
    var church = churchGet(key);
    console.log(church.denomination);
    console.log(church.description);
    console.log(church.followers);
    console.log(church.link);
    console.log(church.sermons);
}

var doSwitchContext = function(context, target) {
    var templatesDir = "/Templates/";
    var translate = {
        "churchProfile": "churchProfile.html",
        "churchProfileTemplate": "churchProfileTemplate.html",
        "frontPage": "frontPage.html",
        "personalProfile": "personalProfile.html",
        "personalProfileTemplate": "personalProfileTemplate.html",
        "sermonPage": "sermonPage.html",
        "sermonTemplate": "sermonTemplate.html",
        "searchPage": "searchPage.html",
        "myChurchProfile": "myChurchProfile.html"
    };
    $(".container").load(templatesDir + translate[context]);

}

// FIREBASE FUNCTIONS
var loginGet = function(email, password) {
    var pass = false;

    var ref = new Firebase(root).child("churches");
    ref.on("value", function(snapshot) {
        snapshot.forEach(function(c) {
            if (c.val().email === email && c.val().password === password) {
                //                console.log("Matched:" + c.val());
                loggedIn = true;
                pass = true;
                church = true;
                user = c;
                alert("Logged in as " + c.val().username);
                doSwitchContext("profilePage");
                return pass;
            }
        });
        // changeHeading(user.val().username);
    });

    ref = new Firebase(root).child("users");
    ref.on("value", function(snapshot) {
        console.log(snapshot.val().toString());
        snapshot.forEach(function(u) {
            //            console.log(u.val());
            if (u.val().email == email && u.val().password == password) {
                //                console.log("Matched:" + u.val());
                //                console.log(u.ref().toString());
                //                loggedIn = true;
                pass = true;
                church = false;
                user = u;
                doSwitchContext("profilePage");
                alert("Logged in as " + u.val().username);
                return pass;
            }
        });
        // changeHeading(user.val().username);
    });

    return pass;

}

var registerUserPost = function(bio, denomination, email, password, picture, username, zipcode) {
    var ref = new Firebase(root).child("users");
    ref.on("value", function(snapshot) {
        snapshot.forEach(function(user) {
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

    ref.endAt().limit(1).on('child_added', function(snapshot) {
        // all records after the last continue to invoke this function
        user = snapshot.val();
        church = false;
        console.log(user);
        return true;
    });
}

var registerChurchPost = function(denomination, description, email, link, password, picture, username, zipcode) {
    var ref = new Firebase(root).child("churches");
    ref.on("value", function(snapshot) {
        snapshot.forEach(function(church) {
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

    ref.endAt().limit(1).on('child_added', function(snapshot) {
        // all records after the last continue to invoke this function
        user = snapshot.val();
        church = true;
        console.log(user);
        return true;
    });
}

var logout = function() {
    loggedIn = false;
}

var headingGet = function(userKey) { // Returns the username of the profile. 
    var ref = new Firebase(userKey).child('username');
    ref.on("value", function(snapshot) {
        return snapshot.val();
    });
};

var frontPageGet = function(global) {
    var ref = new Firebase(root);
    console.log(global + ref.toString());
    ref.child("hot").on("value", function(snapshot) {
        //console.log(snapshot.val());
        if (global) {
            //console.log(snapshot.val());
            topGlobal = snapshot.val();
        }
        else {
            for (var i = 0; i < snapshot.val().sermons.controversial.length; i++) {
                var sermon = snapshot.val().sermons.controversial[i].sermonReference;
                var postRef = new Firebase(snapshot.val().sermons.controversial[i].sermonReference.toString()).parent().parent();
                var userRef = new Firebase("https://c4tk.firebaseio.com/users/0");
                postRef.once("value", function(postSnapshot) {
                    userRef.once("value", function(userSnapshot) {
                        if (userSnapshot.val().zipcode.toString() == postSnapshot.val().zipcode.toString()) {
                            topFollowed.push(sermon);
                        }
                    });
                });
            }
        }
    });
}

var frontPageActivityGet = function() { // Gathers the top 10 sermons from the users followed churches.
    var churchArray = [],
        top10 = [];

    var ref = new Firebase(user).child("following");
    console.log(ref.toString());
    ref.once("value", function(snapshot) {
        snapshot.forEach(function(c) {
            console.log(c.val());
            var churchRef = new Firebase(c.val()).child("sermons");
            console.log(churchRef.toString());
            churchRef.on("value", function(churchSnapshot) {
                console.log(churchSnapshot.val())

                churchSnapshot.forEach(function(churchVal) {
                    console.log(churchVal.val());
                    var churchObj = churchVal.val();
                    churchObj["key"] = churchVal.ref().toString();
                    churchArray.push(churchObj);
                    console.log(churchArray);
                });
                churchArray.sort(function(a, b) {
                    return b.time - a.time;
                });
                if (churchArray.length > 10) {
                    var j = 10;
                }
                else {
                    var j = churchArray.length;
                }

                for (var i = 0; i < j; i++) {
                    topRecommended[i] = churchArray[i];
                }
                // console.log(churchArray);
                // topRecommended = top10;
            });
        });
    });
}

var sermonGet = function(sermonKey) {
    var ref = new Firebase(sermonKey);
    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        return snapshot.val();
    });
}

var churchGet = function(churchKey) {
    var ref = new Firebase(churchKey);
    ref.on("value", function(snapshot) {
        return snapshot.val();
    });
}

var searchData = function(search) {
    var churchArray = new Array();
    var sermonArray = new Array();
    var ref = new Firebase(root).child("churches");
    ref.on("value", function(snapshot) {
        snapshot.forEach(function(church) {
            if (church.val().username.toLowerCase().indexOf(search) >= 0 || church.val().zipcode.toLowerCase().indexOf(search) >= 0) {
                churchArray.push(church.val());
            }
            church.val().sermons.forEach(function(sermon) {
                if (sermon.title.toLowerCase().indexOf(search) >= 0) {
                    sermonArray.push(sermon);
                }
            });
        });
    });

    console.log(new Array(churchArray, sermonArray));
}

var profileGet = function(profileKey) {
    var ref = new Firebase(profileKey);
    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        return snapshot.val();
    });
}

var profilePost = function(profileKey, bio, denomination, email, following, password, picture, username) {
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

var sermonPost = function(churchKey, title, notes) {
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

var sermonDelete = function(sermonKey) {
    var sermon = new Firebase(sermonKey);
    sermon.remove();
}

var incrementAttendance = function(sermonKey) {
    var sermon = new Firebase(sermonKey);
    var value;
    var checked = false;
    sermon.once("value", function(snapshot) {
        if (!checked) {
            value = snapshot.val().attendance + 1;
            checked = true;
        }
        sermon.update({
            attendance: value,
        });
    });
}

var upvote = function(postKey) { // Activates an upvote.
    var postRef = new Firebase(postKey);
    //var profileRef = new Firebase(profileKey);
    var userRef = new Firebase(user);
    var value = 0;
    var checked = false;

    if (loggedIn) { // Checks if the user is logged in.
        // Checks to see how if the user has already upvoted and, if so, forbids them from upvoting again.
        userRef.child("upvoted").once("value", function(snapshot) {
            if (snapshot.val() == null) {
                userRef.child("upvoted").push(postKey);
                postRef.once("value", function(snapshot) {
                    if (!checked) {
                        value = snapshot.val().upvotes + 1;
                        checked = true;
                    }
                    postRef.update({
                        upvotes: value,
                    });
                });
                checked = false;
                profileRef.once("value", function(profileSnapshot) {
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
            snapshot.forEach(function(sermon) {
                if (sermon.val() == postKey) {
                    return 0;
                }
                // Checks to see if the user has downvoted the post. If so, take away from the downvote variable rather than the upvote variable.
                userRef.child("downvoted").on("value", function(snapshot) {
                    snapshot.forEach(function(sermon) {
                        if (sermon.val() == postRef.val()) {
                            sermon.remove();
                            postRef.once("value", function(postSnapshot) {
                                if (!checked) {
                                    value = postSnapshot.val().downvotes - 1;
                                    checked = true;
                                }
                                postRef.update({
                                    downvotes: value,
                                });
                            });
                            checked = false;
                            profileRef.once("value", function(profileSnapshot) {
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
                        postRef.once("value", function(snapshot) {
                            if (!checked) {
                                value = snapshot.val().upvotes + 1;
                                checked = true;
                            }
                            postRef.update({
                                upvotes: value,
                            });
                        });
                        checked = false;
                        profileRef.once("value", function(profileSnapshot) {
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

var downvote = function(postKey) { // Activates an downvote.
    var postRef = new Firebase(postKey);
    //var profileRef = new Firebase(profileKey);
    var userRef = new Firebase(user);
    var value = 0;
    var checked = false;

    if (loggedIn) { // Checks if the user is logged in.
        // Checks to see how if the user has already downvoted and, if so, forbids them from downvoting again.
        userRef.child("downvoted").once("value", function(snapshot) {
            if (snapshot.val() == null) {
                userRef.child("downvoted").push(postKey);
                postRef.once("value", function(snapshot) {
                    if (!checked) {
                        value = snapshot.val().downvotes + 1;
                        checked = true;
                    }
                    postRef.update({
                        upvotes: value,
                    });
                });
                checked = false;
                profileRef.once("value", function(profileSnapshot) {
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
            snapshot.forEach(function(sermon) {
                if (sermon.val() == postKey) {
                    return 0;
                }
                // Checks to see if the user has upvoted the post. If so, take away from the upvote variable rather than the downvote variable.
                userRef.child("upvoted").on("value", function(snapshot) {
                    snapshot.forEach(function(sermon) {
                        if (sermon.val() == postRef.val()) {
                            sermon.remove();
                            postRef.once("value", function(postSnapshot) {
                                if (!checked) {
                                    value = postSnapshot.val().upvotes - 1;
                                    checked = true;
                                }
                                postRef.update({
                                    upvotes: value,
                                });
                            });
                            checked = false;
                            profileRef.once("value", function(profileSnapshot) {
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
                        postRef.once("value", function(snapshot) {
                            if (!checked) {
                                value = snapshot.val().downvotes + 1;
                                checked = true;
                            }
                            postRef.update({
                                downvotes: value,
                            });
                        });
                        checked = false;
                        profileRef.once("value", function(profileSnapshot) {
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

var follow = function(churchKey) {
    var churchRef = new Firebase(churchKey);
    var userRef = new Firebase(user);
    var value;
    var checked = false;

    if (loggedIn) {
        userRef.child("following").push({
            churchKey
        });

        churchRef.once("value", function(snapshot) {
            if (!checked) {
                value = snapshot.val().followers + 1;
                checked = true;
            }
            churchRef.update({
                followers: value,
            });
        });
    }
};

var churchOrPerson = function() {
    if (church == true)
        doSwitchContext("myChurchProfile");
    else
        doSwitchContext("personalProfile");
}

var unfollow = function(churchKey) {
    var churchRef = new Firebase(churchKey);
    var userRef = new Firebase(user);
    var value;
    var checked = false;

    if (loggedIn) {
        userRef.child("following").on("value", function(snapshot) {
            snapshot.forEach(function(church) {
                if (church.val() == churchKey)
                    church.remove();
            });
        });

        churchRef.once("value", function(snapshot) {
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

var yass = function(yas) {
    var yass = yas;
    return yass;
}

var print = function() {
    return yass("yaaasssss");
}

$(document).ready(function() {
    $(".register-content").hide(); // hides the registration content on the login modal.
    $('ul.tabs').tabs();
    $('.modal-trigger').leanModal();
    doSwitchContext("frontPage");
    frontPageSwitch(0);
    frontPageActivityGet();
    frontPageGet(true);
    frontPageGet(false);
    setTimeout(function() {
        goFrontPage();
    }, 1000);
});

function SetPlaceHolder(input) {
    if (input.value == "") {
        input.value = input.defaultValue;
    }
}