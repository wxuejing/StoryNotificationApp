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

    var pubtags = document.getElementsByName("publisher");
    var pubs = []

    for (pub in pubtags) {
        if (pubtags[pub].checked) {
            console.log(pubtags[pub].value);
            pubs.push(pubtags[pub].value);
        }
    }

    window.localStorage.setItem("categories", cats);
    window.localStorage.setItem("publishers", pubs);

    return false;
}

function getPubCat() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/subscriber/sub_opt.json', true);

    xhr.setRequestHeader("Content-Type",
        "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // alert('We have your messages');
            console.log("js: ", xhr.responseText);
            var response = JSON.parse(xhr.responseText);

            var publishers = response.publishers;
            var categories = response.categories;
            var unpubs = response.unpubs;
            var uncats = response.uncats;

            console.log("js publishers: ", publishers);
            console.log("js categories: ", categories);
            console.log("js unpubs: ", unpubs);
            console.log("js uncats:", uncats);

            createInputCat(categories);
            createInputPub(publishers);

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
            // ('Something went wrong, could not get messages');
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

function createInputPub(publishers) {

    var filter = document.getElementById("filter");
    var h = document.createElement("h3");
    var t = document.createTextNode("Publishers");

    h.appendChild(t);

    var b = document.createElement("br");

    filter.append(h);
    filter.append(b);

    if (publishers.length == 0) {
        var t = document.createTextNode("you're not subscribed to any publishers");
        filter.append(t);
    } else {
        for (pub in publishers) {
            var el = document.createElement("input");
            el.type = "checkbox";
            el.name = "publisher";
            el.value = publishers[pub].publisher_name;

            console.log(el);

            var text = document.createTextNode(publishers[pub].publisher_name);


            filter.appendChild(el);
            filter.appendChild(text);
        }
    }
}

function getPublishersCategories() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/subscriber/sub_opt.json', true);

    xhr.setRequestHeader("Content-Type",
        "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // alert('We have your messages');
            console.log("js: ", xhr.responseText);
            var response = JSON.parse(xhr.responseText);

            var publishers = response.publishers;
            var categories = response.categories;
            var unpubs = response.unpubs;
            var uncats = response.uncats;

            console.log("js publishers: ", publishers);
            console.log("js categories: ", categories);
            console.log("js unpubs: ", unpubs);
            console.log("js uncats:", uncats);

            makeUL_p(publishers);
            makeUL_c(categories);
            makeUL_up(unpubs);
            makeUL_uc(uncats);

        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong');
            console.log(xhr.responseText);
        }
    }

    var info = JSON.stringify({
        user: window.localStorage.getItem("user")
    });

    console.log(info);
    xhr.send(info);
}

function recordPosition(position) {
    window.localStorage.setItem("latitude", position.coords.latitude);
    window.localStorage.setItem("longitude", position.coords.longitude);
}

function makeUL_p(array) {
    for (var i = 0; i < array.length; i++) {
        addRow_p(array[i]);
    }
}

function makeUL_c(array) {
    for (var i = 0; i < array.length; i++) {
        addRow_c(array[i]);
    }
}

function makeUL_up(array) {
    for (var i = 0; i < array.length; i++) {
        addRow_up(array[i]);
    }
}

function makeUL_uc(array) {
    for (var i = 0; i < array.length; i++) {
        addRow_uc(array[i]);
    }
}

function addRow_p(oneMessage) {
    var publisher_table = document.getElementById("publishers");

    var row = publisher_table.insertRow(-1);

    var publisher = row.insertCell(0);

    publisher.innerHTML = oneMessage.publisher_name;
}

function addRow_c(oneMessage) {
    var category_table = document.getElementById("categories");

    var row = category_table.insertRow(-1);

    var category = row.insertCell(0);

    category.innerHTML = oneMessage.category_name;
}

function addRow_up(oneMessage) {
    var publisher_table = document.getElementById("un_publishers");

    var row = publisher_table.insertRow(-1);

    var publisher = row.insertCell(0);

    publisher.innerHTML = oneMessage.user_name;
}


function addRow_uc(oneMessage) {
    var category_table = document.getElementById("un_categories");

    var row = category_table.insertRow(-1);

    var category = row.insertCell(0);

    category.innerHTML = oneMessage.category_name;
}

function getmessages() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/subscriber/sub_message.json', true);

    xhr.setRequestHeader("Content-Type",
        "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var messages = JSON.parse(xhr.response).messages;
            console.log(messages);

            window.localStorage.setItem("latitude", "");
            window.localStorage.setItem("longitude", "");
            window.localStorage.setItem("startdate", "");
            window.localStorage.setItem("starttime", "");
            window.localStorage.setItem("enddate", "");
            window.localStorage.setItem("endtime", "");
            window.localStorage.setItem("categories", "");
            window.localStorage.setItem("publishers", "");

            makeUL_m(messages);

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
        publishers: window.localStorage.getItem("publishers")
    });
    console.log("info: ", info);
    xhr.send(info);
}

function makeUL_m(array) {
    for (var i = 0; i < array.length; i++) {
        addRow_m(array[i]);
    }
}

function addRow_m(oneMessage) {
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

function unsubscribe_publisher() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/subscriber/sub_opt/delete_publisher.json', true);

    xhr.setRequestHeader("Content-Type", "application/json");

    var publisher = document.getElementById("unsubscribe_publisher").value;

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // alert('Deleted successfully');

            location.reload();
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong');
            console.log(xhr.responseText);
        }
    }

    var pubToDelete = JSON.stringify({
        user: window.localStorage.getItem("user"),
        delete: publisher
    });
    xhr.send(pubToDelete);
}

function unsubscribe_category() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/subscriber/sub_opt/delete_category.json', true);

    xhr.setRequestHeader("Content-Type", "application/json");

    var category = document.getElementById("unsubscribe_category").value;

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // alert('Deleted successfully');

            location.reload();

        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong');
            console.log(xhr.responseText);
        }
    }

    var catToDelete = JSON.stringify({
        user: window.localStorage.getItem("user"),
        delete: category
    });
    xhr.send(catToDelete);
}

function subscribe_publisher() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/subscriber/sub_opt/add_publisher.json', true);

    xhr.setRequestHeader("Content-Type", "application/json");

    var publisher = document.getElementById("subscribe_publisher").value;

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // alert('subscribed successfully');

            location.reload();
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong');
            console.log(xhr.responseText);
        }
    }

    var pubToAdd = JSON.stringify({
        user: window.localStorage.getItem("user"),
        add: publisher
    });
    xhr.send(pubToAdd);
}

function subscribe_category() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/subscriber/sub_opt/add_category.json', true);

    xhr.setRequestHeader("Content-Type", "application/json");

    var category = document.getElementById("subscribe_category").value;

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // alert('subscribed successfully');

            location.reload();

        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong');
            console.log(xhr.responseText);
        }
    }

    var catToAdd = JSON.stringify({
        user: window.localStorage.getItem("user"),
        add: category
    });
    xhr.send(catToAdd);
}