// GLOBAL VARS
var root = 'https://c4tk.firebaseio.com/';
var user = "https://c4tk.firebaseio.com/users/0";
var loggedIn = false;

// FIREBASE FUNCTIONS
var loginGet = function(email, password) {
  
}

var registerPost = function(email, password, username, denomination) {
  
}

var headingGet = function(userKey) {
  var ref = new Firebase(userKey).child('username');
  ref.on("value", function(snapshot) {
    return snapshot.val();
  });
}

var frontPageGet = function(loggedIn, global) {
  
}

var frontPageActivityGet = function() {
  var top10Times = new Array();
  var top10 = new Array();
  var ref = new Firebase(username).child("following");
  console.log(ref.toString());
  ref.on("value", function(snapshot) {
    snapshot.forEach(function(church) {
      console.log(church.val());
      var churchRef = new Firebase(church.val()).child("sermons");
      churchRef.on("value", function(churchSnapshot) {
        churchSnapshot.forEach(function(churchVal) {
          if (top10.length < 10) {
            console.log(churchVal.val());
            top10Times.push(churchVal.val().time);
            top10.push(churchVal.val());
          } else {
            for (var i=0; i < 10; i++) {
              if (churchVal.val().time > top10[i]) { // This needs work, but it's fine for now.
                top10Times[i] == churchVal.val().time;
                top10[i] == churchVal.val();
              }
            }
          }
        });
      });
    });
  });
  
  return top10;
  
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
      if (church.val().username.toLowerCase().indexOf(search) >= 0) {
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
    bio : bio,
    denomination : denomination,
    email: email,
    following: null,
    password: password,
    picture: picture,
    username : username,
  });
  
  
  for (var i=0; i<following.length; i++) {
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
    
}

var upvote =  function(key) {
  var postRef = new Firebase(key);
  var userRef = new Firebase(user);
  var pass = true;
  
    userRef.child("downvoted").on("value", function(snapshot) {
        snapshot.forEach(function(sermon) {
            if (sermon.val() == postRef.val()) {
                pass = false;
                sermon.remove();
                postRef.on("value", function(postSnapshot) {
                   postRef.update({
                       downvotes: postSnapshot.val().downvotes - 1,
                       totalDownvotes: postSnapshot.val().downvotes - 1,
                   });
                });
            }
        });
    });
     if (pass) {
        userRef.child("upvoted").push;
     }
    
    userRef.child("upvoted").on("value", function(snapshot) {
        snapshot.forEach(function(sermon) {
            if (sermon.val() == postRef.val()) {
                sermon.remove();
                postRef.on("value", function(postSnapshot) {
                   postRef.update({
                       downvotes: postSnapshot.val().downvotes - 1,
                       totalDownvotes: postSnapshot.val().downvotes - 1,
                   });
                });
            }
        });
    });
}

var downvote = function(key) {
  
}

var follow = function(churchKey) {
    
}

var unfollow = function(churchKey) {
    
}

$(document).ready(function() {
    $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });
})