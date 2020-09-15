// When the user clicks on the password field, show the message box
function psw_onfocus() {
    document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
function psw_onblur() {
    document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
function psw_onkeyup() {
    var myInput = document.getElementById("psw");
    var letter = document.getElementById("letter");
    var capital = document.getElementById("capital");
    var number = document.getElementById("number");
    var length = document.getElementById("length");
    console.log(myInput);
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if (myInput.value.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (myInput.value.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
    } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (myInput.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    // Validate length
    if (myInput.value.length >= 8) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }
}

function validatePassword() {
    var password = document.getElementById("psw");
    var confirm_password = document.getElementById("re_psw");
    console.log(password.value, confirm_password.value);
    if (password.value === confirm_password.value) {
        validate.classList.remove("nomatch");
        validate.classList.add("match");
    }
}

// When the user clicks on the repeat password field, show the message box
function repsw_onfocus() {
    document.getElementById("match").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
function repsw_onblur() {
    document.getElementById("match").style.display = "none";
}

function click_signup() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/signup', true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function (name, pwd) {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            alert('You will be able to login once you confirm your email!');

            window.location.assign('/login');
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong, could not sign you up, try again');

            document.getElementById("signupform").reset();

            window.location.reload();
        }
    }

    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var psw = document.getElementById("psw").value;
    var re_psw = document.getElementById("re_psw");

    var type;
    if (document.getElementById("choice1").checked) {
        type = document.getElementById("choice1").value;
    } else if (document.getElementById("choice2").checked) {
        type = document.getElementById("choice2").value;
    }

    var ll = JSON.stringify({
        email: email,
        username: username,
        first: firstname,
        last: lastname,
        password: psw,
        type: type
    });

    console.log(ll);
    xhr.send(ll);
}