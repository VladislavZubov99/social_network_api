create TABLE person(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

create TABLE post(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);

create TABLE comment(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    user_id INTEGER,
    post_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id),
    FOREIGN KEY (post_id) REFERENCES post (id)
);
