function insertSubsciptionByPublisher(reader_name, publisher_name) {
    var sql = "insert into sub_pref_publisher (reader_name, publisher_name) VALUES (" +
        reader_name + "," +
        publisher_name + ",";

    return sql;
};

function insertSubscriptionByCategory(reader_name, category_name) {
    var sql = "insert into sub_pref_category (reader_name, category_name) VALUES (" +
        reader_name + "," +
        category_name + ",";

    return sql;
};

function getPublishersByUser(reader_name) {
    var sql = "select publisher_name from sub_pref_publisher where reader_name = \"" + reader_name + "\"";

    return sql;
}

function getCategoriesByUser(reader_name) {
    var sql = "select category_name from sub_pref_category where reader_name = \"" + reader_name + "\"";

    return sql;
}

function getUnsubscribedCategoriesByUser(reader_name) {
    var sql =
        "select category_name " +
        "from category " +
        " where category.category_name not in " +
        " (select category_name from sub_pref_category where reader_name = \"" + reader_name + "\")";

    return sql;
}

function getUnsubscribedPublishersByUser(reader_name) {
    var sql =
        "select user_name " +
        "from user " +
        "where user_type = 1 and user.user_name not in " +
        "(select publisher_name from sub_pref_publisher where reader_name = \"" + reader_name + "\")";

    return sql;
}

function deletePublisherByUser(user, publisher) {
    var sql = "delete from sub_pref_publisher where reader_name = \'" + user + "\' and publisher_name = \'" + publisher + "\'";

    return sql;
}

function deleteCategoryByUser(user, category) {
    var sql = "delete from sub_pref_category where reader_name = \'" + user + "\' and category_name = \'" + category + "\'";

    return sql;
}

function addPublisherByUser(user, publisher) {
    var sql = "insert into sub_pref_publisher (reader_name, publisher_name) values (\"" + user + "\",\"" + publisher + "\")";

    return sql;
}

function addCategoryByUser(user, category) {
    var sql = "insert into sub_pref_category (reader_name, category_name) values (\"" + user + "\",\"" + category + "\")";

    return sql;
}

function isActiveSub(userName) {
    var sql = "select * from user where user_name='" + userName + "' AND active=" + 1 + " AND user_type=" + 0;
    return sql;
}


module.exports = {
    insertSubsciptionByPublisher,
    insertSubscriptionByCategory,
    getPublishersByUser,
    getCategoriesByUser,
    getUnsubscribedCategoriesByUser,
    getUnsubscribedPublishersByUser,
    deletePublisherByUser,
    deleteCategoryByUser,
    addPublisherByUser,
    addCategoryByUser
};