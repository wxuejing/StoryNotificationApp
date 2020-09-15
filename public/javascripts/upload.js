function populate() {
    document.getElementById("username").value = window.localStorage.getItem("user");

    fillOnly();
}

function fillSelect() {

    console.log("fillSelect");

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/publisher/edit/display/categories.json', true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        console.log(xhr.responseText);
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var categories = JSON.parse(xhr.responseText).result;

            makeSelect(categories);

            var select = document.getElementById("cat");

            var el = document.createElement("option");
            el.text = "no parent";
            el.value = "no parent";
            select.appendChild(el);

        } else {
            console.log(xhr.responseText);
        }
    }

    xhr.send();
}

function fillOnly() {

    console.log("fillSelect");

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/publisher/edit/display/categories.json', true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        console.log(xhr.responseText);
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var categories = JSON.parse(xhr.responseText).result;

            makeSelect(categories);

        } else {
            console.log(xhr.responseText);
        }
    }

    xhr.send();
}

function makeSelect(options) {
    var select = document.getElementById("cat");

    for (var opt in options) {
        console.log(options[opt].category_name);
        var el = document.createElement("option");
        el.text = options[opt].category_name;
        el.value = options[opt].category_name;
        select.appendChild(el);
    }
}