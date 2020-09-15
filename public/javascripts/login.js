function click_action() {
    var name;
    var pwd;
    name = document.getElementById("username-input").value;
    pwd = document.getElementById("password-input").value;
    document.getElementById("login").onclick = click_login(name, pwd);
}

function click_login() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // alert('Successfully logged in!');

            var user = JSON.parse(xhr.responseText);
            console.log('user type: ' + user.user_type);

            window.localStorage.setItem("user", user.user_name.replace(/['"]+/g, ''));

            if (user.user_type === 0) {
                // subscriber
                window.location.assign('/subscriber');
            } else {
                // publisher
                window.location.assign('/publisher');
            }

        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong, we could not log you in.');
        }
    }

    var name = document.getElementById("username").value;
    var psw = document.getElementById("psw").value;
    console.log("name:", name);
    console.log("password:", psw);

    var ll = JSON.stringify({
        username: name,
        password: psw
    });

    console.log(ll);
    xhr.send(ll);
}

function click_signup() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);

    xhr.setRequestHeader("Content-Type", "application/json");

    var ll = JSON.stringify({
        command: "redirect to signup page"
    });

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            window.location.assign('/signup');
        }
    }
    console.log(ll);
    xhr.send(ll);

}

function click_deregister() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);

    xhr.setRequestHeader("Content-Type", "application/json");

    var ll = JSON.stringify({
        command: "redirect to deregister page"
    });

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            window.location.assign('/deregister');
        }
    }
    console.log(ll);
    xhr.send(ll);

}