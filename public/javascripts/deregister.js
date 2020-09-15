function click_deregister() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/deregister/dereg.json', true);

    xhr.setRequestHeader("Content-Type", "application/json");

    var user_name = document.getElementById("username").value;
    var password = document.getElementById("psw").value;
    var email = document.getElementById("email").value;

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            alert('Deregistered successfully');

            location.reload();
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong, could not deregister');
            console.log(xhr.responseText);
        }
    }

    var userToDelete = JSON.stringify({
        user_name: user_name,
        password: password,
        email: email
    });
    console.log(userToDelete);
    xhr.send(userToDelete);
}