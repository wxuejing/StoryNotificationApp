function postChange() {
    console.log("form changed");

    var filter = document.getElementById("filter");
    console.log(filter);

    var startdate = document.getElementById("startdate");
    console.log(startdate.value);
    window.localStorage.setItem("startdate", startdate.value);

    var starttime = document.getElementById("starttime");
    console.log(starttime.value);
    window.localStorage.setItem("starttime", starttime.value);


    var enddate = document.getElementById("enddate");
    console.log(enddate.value);
    window.localStorage.setItem("enddate", enddate.value);


    var endtime = document.getElementById("endtime");
    console.log(endtime.value);
    window.localStorage.setItem("endtime", endtime.value);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(recordPosition);

        var longitude = document.getElementById("longitude");
        var latitude = document.getElementById("latitude");

        if (longitude.value !== '0') {
            window.localStorage.setItem("longitude", longitude.value);
        }

        if (latitude.value !== '0') {
            window.localStorage.setItem("latitude", latitude.value);
        }

    } else {
        var longitude = document.getElementById("longitude");
        var latitude = document.getElementById("latitude");

        window.localStorage.setItem("latitude", latitude.value);
        window.localStorage.setItem("longitude", longitude.value);
    }

    var cattags = document.getElementsByName("category");
    var cats = []

    for (cat in cattags) {
        if (cattags[cat].checked) {
            console.log(cattags[cat].value);
            cats.push(cattags[cat].value);
        }
    }

    window.localStorage.setItem("categories", cats);

    return false;
}

function recordPosition(position) {
    window.localStorage.setItem("latitude", position.coords.latitude);
    window.localStorage.setItem("longitude", position.coords.longitude);
}

function getPubCat() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/publisher/edit/display/categories.json', true);

    xhr.setRequestHeader("Content-Type",
        "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // alert('We have your messages');
            console.log("js: ", xhr.responseText);
            var response = JSON.parse(xhr.responseText).result;

            createInputCat(response);

            var form = document.getElementById('filter');
            form.append(document.createElement('br'));
            var submit = document.createElement('input');

            submit.type = "submit";
            submit.id = "submit";
            submit.value = "submit";

            form.append(submit);

            if (form.attachEvent) {
                form.attachEvent("submit", postChange);
            } else {
                form.addEventListener("submit", postChange);
            }

        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong.');
            console.log(xhr.responseText);
        }
    }

    var info = JSON.stringify({
        user: window.localStorage.getItem("user")
    });

    console.log(info);
    xhr.send(info);
}

function createInputCat(categories) {

    console.log("createInputCat");

    var filter = document.getElementById("filter");
    var h = document.createElement("h3");
    var t = document.createTextNode("Categories");

    h.appendChild(t);

    var b = document.createElement("br");

    filter.append(h);
    filter.append(b);

    console.log(categories);

    if (categories.length == 0) {
        var t = document.createTextNode("you're not subscribed to any categories");
        filter.append(t);
    } else {

        for (cat in categories) {
            var el = document.createElement("input");
            el.type = "checkbox";
            el.name = "category";
            el.value = categories[cat].category_name;

            console.log(el);

            var text = document.createTextNode(categories[cat].category_name);


            filter.appendChild(el);
            filter.appendChild(text);
        }
    }
}

function getmessages() {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/publisher/message.json', true);

    xhr.setRequestHeader("Content-Type",
        "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {

            window.localStorage.setItem("latitude", "");
            window.localStorage.setItem("longitude", "");
            window.localStorage.setItem("startdate", "");
            window.localStorage.setItem("starttime", "");
            window.localStorage.setItem("enddate", "");
            window.localStorage.setItem("endtime", "");
            window.localStorage.setItem("categories", "");

            var rep = JSON.parse(xhr.response);
            var messages = rep.result;
            var archive = rep.arcResult;

            //console.log("messages: ", messages);
            makeUL(messages, archive);

        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong');
            console.log(xhr.responseText);
        }
    }

    getPubCat();

    var info = JSON.stringify({
        user: window.localStorage.getItem("user"),
        lat: window.localStorage.getItem("latitude"),
        lng: window.localStorage.getItem("longitude"),
        startdate: window.localStorage.getItem("startdate"),
        starttime: window.localStorage.getItem("starttime"),
        enddate: window.localStorage.getItem("enddate"),
        endtime: window.localStorage.getItem("endtime"),
        categories: window.localStorage.getItem("categories"),
    });
    console.log("info: ", info);
    xhr.send(info);
}

function makeUL(messages, archive) {
    //if (message) {
    for (var i = 0; i < messages.length; i++) {
        addRow(messages[i]);
    }
    //}

    //if (archive) {
    for (var i = 0; i < archive.length; i++) {
        addRowArchive(archive[i]);
    }
    //}

}

function addRow(oneMessage) {
    var message_table = document.getElementById("messages");

    var row = message_table.insertRow(-1);

    var publisherName = row.insertCell(0);
    var catName = row.insertCell(1);
    var filePath = row.insertCell(2);
    var loc = row.insertCell(3);
    var timeac = row.insertCell(4);
    var timearc = row.insertCell(5);

    publisherName.innerHTML = oneMessage.publisher_name;
    catName.innerHTML = oneMessage.category_name;
    filePath.innerHTML = '<a href="' + oneMessage.file_path + '"> click to read the message </a>';
    loc.innerHTML = 'Latitude: ' + oneMessage.location.x + '<br>Longitude: ' + oneMessage.location.y;
    timeac.innerHTML = new Date(oneMessage.time_to_activate);
    timearc.innerHTML = new Date(oneMessage.time_to_archive);
}

function addRowArchive(oneMessage) {
    var message_table = document.getElementById("messages");

    var row = message_table.insertRow(-1);
    row.style.backgroundColor = "gray";

    var publisherName = row.insertCell(0);
    var catName = row.insertCell(1);
    var filePath = row.insertCell(2);
    var loc = row.insertCell(3);
    var timeac = row.insertCell(4);
    var timearc = row.insertCell(5);

    publisherName.innerHTML = oneMessage.publisher_name;
    catName.innerHTML = oneMessage.category_name;
    filePath.innerHTML = '<a href="' + oneMessage.file_path + '"> click to read the message </a>';
    loc.innerHTML = 'Latitude: ' + oneMessage.location.x + '<br>Longitude: ' + oneMessage.location.y;
    timeac.innerHTML = new Date(oneMessage.time_to_activate);
    timearc.innerHTML = new Date(oneMessage.time_to_archive);
}

function create_category() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/publisher/category.json', true);

    xhr.setRequestHeader("Content-Type",
        "application/json");

    var new_category = document.getElementById('category_name').value;
    var parent_category = document.getElementById('cat').value;

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            alert('Category created!');

        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong');
        }
    }

    var cat = JSON.stringify({
        user: window.localStorage.getItem("user"),
        newCat: new_category,
        parentCat: parent_category
    });
    console.log("cat: ", cat);
    xhr.send(cat);

}