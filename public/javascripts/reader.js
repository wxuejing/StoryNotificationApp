function getMessages() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/reader/messages.json', true);

    xhr.setRequestHeader("Content-Type",
        "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // alert('We have your messages');
            var respArray = JSON.parse(xhr.responseText).result;
            console.log(respArray);

            makeUL(respArray);
        } else if (this.readyState == XMLHttpRequest.DONE && this.status == 500) {
            alert('Something went wrong');
            console.log(xhr.responseText);
        }
    }

    xhr.send();
}

function makeUL(array) {
    for (var i = 0; i < array.length; i++) {
        addRow(array[i]);
    }
}

function addRow(oneMessage) {
    var table = document.getElementById("messages");

    var row = table.insertRow(-1);

    var messageID = row.insertCell(0);
    var publisherName = row.insertCell(1);
    var catName = row.insertCell(2);
    var filePath = row.insertCell(3);
    var loc = row.insertCell(4);
    var timeac = row.insertCell(5);
    var timearc = row.insertCell(6);

    messageID.innerHTML = oneMessage.message_id;
    publisherName.innerHTML = oneMessage.publisher_name;
    catName.innerHTML = oneMessage.category_name;
    filePath.innerHTML = '<a href="' + oneMessage.file_path + '"> click to read the message </a>';
    loc.innerHTML = 'Latitude: ' + oneMessage.location.x + '<br>Longitude: ' + oneMessage.location.y;
    timeac.innerHTML = oneMessage.time_to_activate;
    timearc.innerHTML = oneMessage.time_to_archive;
}