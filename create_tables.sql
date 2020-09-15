CREATE TABLE user
    (
    user_name VARCHAR(30) PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    email VARCHAR(30),
    password VARCHAR(30),
    user_type BOOLEAN, /* True for publisher, False for reader */
    active BOOLEAN
    );

CREATE TABLE category 
    (
    category_name VARCHAR(30) PRIMARY KEY,
    parent_name VARCHAR(30),

    FOREIGN KEY (parent_name)
        REFERENCES category(category_name)
        ON DELETE CASCADE
    );

CREATE TABLE sub_pref_publisher
    (
    reader_name VARCHAR(30),
    publisher_name VARCHAR(30),

    PRIMARY KEY (reader_name, publisher_name),
    FOREIGN KEY (reader_name)
        REFERENCES user(user_name)
        ON DELETE CASCADE,
    FOREIGN KEY (publisher_name)
        REFERENCES user(user_name)
        ON DELETE CASCADE
    );

CREATE TABLE sub_pref_category
    (
    reader_name VARCHAR(30),
    category_name VARCHAR(30),

    PRIMARY KEY (reader_name, category_name),
    FOREIGN KEY (reader_name)
        REFERENCES user(user_name)
        ON DELETE CASCADE,
    FOREIGN KEY (category_name)
        REFERENCES category(category_name)
        ON DELETE CASCADE
    );

CREATE TABLE message 
    (
    message_id INT(10) AUTO_INCREMENT PRIMARY KEY,
    publisher_name VARCHAR(30), 
    category_name VARCHAR(30),
    file_path VARCHAR(256), 
    location GEOMETRY, 
    extend INT(10),
    /* message will appear in reader's page between time_to_activate and time_to_archive */
    time_to_activate TIMESTAMP, /* time to send notifications, messages only get sent once at the time_to_activate */
    time_to_archive TIMESTAMP, /* time to expire */

    FOREIGN KEY (publisher_name) 
        REFERENCES user(user_name)
        ON DELETE CASCADE,
    FOREIGN KEY (category_name)
        REFERENCES category(category_name)
        ON DELETE CASCADE
    );

CREATE TABLE archive
    (
    archive_id INT(10) AUTO_INCREMENT PRIMARY KEY,
    publisher_name VARCHAR(30), 
    category_name VARCHAR(30),
    file_path VARCHAR(256), 
    location GEOMETRY,
    time_to_activate TIMESTAMP,
    time_to_archive TIMESTAMP, 

    FOREIGN KEY (publisher_name) 
        REFERENCES user(user_name)
        ON DELETE CASCADE,
    FOREIGN KEY (category_name)
        REFERENCES category(category_name)
        ON DELETE CASCADE
    );
