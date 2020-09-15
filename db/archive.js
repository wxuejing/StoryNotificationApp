function insertMessage(pubName, catName, file_path, latitude, longitude, time_act, time_arch) {
    var sql = "insert into archive (publisher_name, category_name, file_path, location," +
        "time_to_activate, time_to_archive) VALUES ('" +
        pubName + "','" +
        catName + "','" +
        file_path + "', POINT('" +
        latitude + "','" +
        longitude + "'),'" +
        time_act + "','" +
        time_arch + "')";
    return sql;
};

function getAllByCategory(category_name) {
    var sql = "select * from archive where category_name='" + category_name +
        "'";
    return sql;
};

function getAllMessages() {
    var sql = "select * from archive";
    return sql;
}

function getMessagesByPublisher(pub_name) {
    var sql = "select * from archive where publisher_name ='" + pub_name + "'";
    return sql;
}

function getMessagesNotByPublisher(pub_name) {
    var sql = "select * from archive where archive.publisher_name <> '" + pub_name + "'";
    return sql;
}

function getAllForUser(user) {
    var sql =
        "select *" +
        " from" +
        " (" +
        "select category_name, publisher_name" +
        " from" +
        "(" +
        "select *" +
        " from sub_pref_category" +
        " where sub_pref_category.reader_name = \"" + user + "\"" +
        ") t1," +
        "(" +
        "select * " +
        " from sub_pref_publisher" +
        " where sub_pref_publisher.reader_name = \"" + user + "\"" +
        ") t2" +
        ") t, archive" +
        " where t.category_name = archive.category_name and t.publisher_name = archive.publisher_name";
    console.log(sql);
    return sql;
};

function filterMessagesForPublisher(pub_name, lat, lng, startdate, starttime, enddate, endtime, categories) {
    var sql = getAllMessages(pub_name);

    if (lat && lng) {
        sql += " where 3961*DEGREES(ACOS(COS(RADIANS(X(message.location))) *COS(RADIANS(" + lat +
            ")) * COS(RADIANS(" + lng +
            ") - RADIANS(Y(message.location))) + SIN(RADIANS(X(message.location))) * SIN(RADIANS(" + lat +
            ")))) <= message.extend";
    }

    if (startdate && starttime) {
        var start = (startdate + ' ' + starttime);
        console.log(start);

        sql += " and message.time_to_activate >= UNIX_TIMESTAMP('" + start + "')"
    }

    if (enddate && endtime) {
        var end = (enddate + ' ' + endtime);
        console.log(end);

        sql += " and message.time_to_archive <= UNIX_TIMESTAMP('" + end + "')"
    }

    if (categories) {
        cats = categories.split(',');
        var cat = "";

        if (cats.length == 1) {
            cat += "'" + cats[0] + "'";
        } else {
            for (var i = 0; i < cats.length; i++) {
                cat += "'" + cats[i] + "',";
            }
            cat = cat.replace(/\s/g, '');
            cat = cat.substr(0, cat.length - 1);
        }

        sql += " and message.category_name in (" + cat + ")"
    }

    console.log(sql);

    return sql;
};

function filterMessagesForSubscriber(sub_name, lat, lng, startdate, starttime, enddate, endtime, categories, publishers) {
    var sql = getAllForUser(sub_name);

    if (lat && lng) {
        sql += " and 3961*DEGREES(ACOS(COS(RADIANS(X(message.location))) *COS(RADIANS(" + lat +
            ")) * COS(RADIANS(" + lng +
            ") - RADIANS(Y(message.location))) + SIN(RADIANS(X(message.location))) * SIN(RADIANS(" + lat +
            ")))) <= message.extend";
    }

    if (startdate && starttime) {
        var start = (startdate + ' ' + starttime);
        console.log(start);

        sql += " and message.time_to_activate >= UNIX_TIMESTAMP('" + start + "')"
    }

    if (enddate && endtime) {
        var end = (enddate + ' ' + endtime);
        console.log(end);

        sql += " and message.time_to_archive <= UNIX_TIMESTAMP('" + end + "')"
    }

    if (categories) {
        cats = categories.split(',');
        var cat = "";

        if (cats.length == 1) {
            cat += "'" + cats[0] + "'";
        } else {
            for (var i = 0; i < cats.length; i++) {
                cat += "'" + cats[i] + "',";
            }
            cat = cat.replace(/\s/g, '');
            cat = cat.substr(0, cat.length - 1);
        }

        sql += " and message.category_name in (" + cat + ")"
    }

    if (publishers) {
        pubs = publishers.split(',');
        var pub = "";

        if (pubs.length == 1) {
            pub += "'" + pubs[0] + "'";
        } else {
            for (var i = 0; i < pubs.length; i++) {
                pub += "'" + pubs[i] + "',";
            }
            pub = pub.replace(/\s/g, '');
            pub = pub.substr(0, pub.length - 1);
        }

        sql += " and message.publisher_name in (" + pub + ")"
    }

    console.log(sql);

    return sql;
};

module.exports = {
    insertMessage,
    getAllByCategory,
    getAllMessages,
    getAllForUser,
    getMessagesByPublisher,
    getMessagesNotByPublisher,
    filterMessagesForPublisher,
    filterMessagesForSubscriber
};