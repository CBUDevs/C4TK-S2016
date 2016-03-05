// GLOBAL VARS
var root = 'https://c4tk.firebaseio.com/';
var user = "https://c4tk.firebaseio.com/users/0";
var loggedIn = false;

// FIREBASE FUNCTIONS
var loginGet = function(email, password) {
  
}

var registerPost = function(email, password, username, denomination, church) {
  
}

var headingGet = function(userKey) { // Returns the username of the profile. 
  var ref = new Firebase(userKey).child('username');
  ref.on("value", function(snapshot) {
    return snapshot.val();
  });
}

var frontPageGet = function(global) {
  var topFollowed, topSermons;
  var ref = new Firebase(root);
  ref.child("hot").on("value", function(snapshot) {
    snapshot.forEach(function(post) {
      var postRef = new Firebase(post.val().sermonReference).parent().parent();
      var userRef = new Firebase(user).child("zipcode");
      if (global) {
        topSermons.push(post.val());
      } else {
        postRef.on("value", function(postSnapshot) {
          userRef.on("value", function(userSnapshot) {
            if (postSnapshot.val().zipcode == userSnapshot.val()) {
              topSermons.push(post.val());
            }
          });
        });
      }
    });
  });
    
  if(loggedIn)
    topFollowed = frontPageActivityGet();
}

var frontPageActivityGet = function() { // Gathers the top 10 sermons from the users followed churches.
  var churchArray = new Array();
  var top10 = new Array();
  
  var ref = new Firebase(user).child("following");
  console.log(ref.toString());
  ref.on("value", function(snapshot) {
    snapshot.forEach(function(church) {
      console.log(church.val());
      var churchRef = new Firebase(church.val()).child("sermons");
      churchRef.on("value", function(churchSnapshot) {
        churchSnapshot.forEach(function(churchVal) {
          var churchObj = churchVal.val();
          churchObj.key = church.val();
          churchArray.push(churchObj);
        });
      });
    });
  });
  
  // Right now, the sorting seems to return before the values are given and sorted. :/
  churchArray.sort(function(a,b) {
    return b.time-a.time;
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
  var sermon = new Firebase(sermonKey);
  var value;
  var checked = false;
  sermon.once("value", function(snapshot) {
    if (!checked) {
      value = snapshot.val().attendance + 1;
      checked = true;
    }
    sermon.update({
       attendance : value,
    });
  });
}

var upvote =  function(postKey, profileKey) { // Activates an upvote.
  var postRef = new Firebase(postKey);
  var profileRef = new Firebase(profileKey);
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
             upvotes : value,
          });
        });
        checked = false;
        profileRef.once("value", function(profileSnapshot) {
          if (!checked) {
            value = profileSnapshot.val().totalUpvotes + 1;
            checked = true;
          }
          profileRef.update({
            totalUpvotes : value,
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
                      downvotes : value,
                    });
                  });
                  checked = false;
                  profileRef.once("value", function(profileSnapshot) {
                    if(!checked) {
                      value = profileSnapshot.val().totalDownvotes - 1;
                    }
                    profileRef.update({
                      totalDownvotes : value,
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
                     upvotes : value,
                  });
                });
                checked = false;
                profileRef.once("value", function(profileSnapshot) {
                  if (!checked) {
                    value = profileSnapshot.val().totalUpvotes + 1;
                    checked = true;
                  }
                  profileRef.update({
                    totalUpvotes : value,
                  });
                });
                return 0;
              });
          });
        });
    });
  }
}

var downvote = function(postKey, profileKey) { // Activates an downvote.
  var postRef = new Firebase(postKey);
  var profileRef = new Firebase(profileKey);
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
             upvotes : value,
          });
        });
        checked = false;
        profileRef.once("value", function(profileSnapshot) {
          if (!checked) {
            value = profileSnapshot.val().totalDownvotes + 1;
            checked = true;
          }
          profileRef.update({
            totalDownvotes : value,
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
                      upvotes : value,
                    });
                  });
                  checked = false;
                  profileRef.once("value", function(profileSnapshot) {
                    if(!checked) {
                      value = profileSnapshot.val().totalUpvotes - 1;
                    }
                    profileRef.update({
                      totalUpvotes : value,
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
                     downvotes : value,
                  });
                });
                checked = false;
                profileRef.once("value", function(profileSnapshot) {
                  if (!checked) {
                    value = profileSnapshot.val().totalDownvotes + 1;
                    checked = true;
                  }
                  profileRef.update({
                    totalDownvotes : value,
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
    userRef.child("following").push({ churchKey });
    
    churchRef.once("value", function(snapshot) {
      if (!checked) {
        value = snapshot.val().followers + 1;
        checked = true;
      }
      churchRef.update({
         followers : value,
      });
    });
  }
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
         followers : value,
      });
    });
  }  
}

$(document).ready(function() {

    $('.modal-trigger').leanModal();

});