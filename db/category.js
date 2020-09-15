function getAllCategories(){
    var sql = "select * from category";
    return sql;
}

function createCategory(cat_name, parent_name){
    var sql = "insert into category (category_name, parent_name) VALUES ('" + cat_name + "', '" + parent_name + "')";
    return sql;
}

module.exports = {getAllCategories, createCategory};
