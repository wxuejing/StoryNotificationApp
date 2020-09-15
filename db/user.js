function insertUser(email, username, first, last, password, type) {
    notpub = false;
    if (type === 'publisher') {
        notpub = true;
    }

    var sql = "insert into user (user_name, first_name, last_name, email, password, user_type, active) VALUES ('" +
        username + "','" +
        first + "','" +
        last + "','" +
        email + "','" +
        password + "'," +
        notpub + "," +
        false + ")";
    console.log(sql);
    return sql;
};

function getUser(userName) {
    var sql = "select * from user where user_name='" + userName + "'";
    return sql;
};

function loginUser(userName, passWord) {
    var sql = "select * from user where user_name='" + userName + "' AND password='" + passWord + "' AND active=" + 1;
    return sql;
};

function isActivePub(userName) {
    var sql = "select * from user where user_name='" + userName + "' AND active=" + 1 + " AND user_type=" + 1;
    return sql;
};

function isActiveSub(userName) {
    var sql = "select * from user where user_name='" + userName + "' AND active=" + 1 + " AND user_type=" + 0;
    return sql;
};

function makeActive(userName) {
    var sql = "update user set active=true where user_name='" + userName + "'";
    return sql;
}

function deleteUser(user, password, email) {
    var sql = "delete from user where user_name='" + user + "' and password='" + password + "' and email='" + email + "'";
    return sql;
}

module.exports = {
    insertUser,
    getUser,
    loginUser,
    makeActive,
    deleteUser,
    isActivePub,
    isActiveSub
};