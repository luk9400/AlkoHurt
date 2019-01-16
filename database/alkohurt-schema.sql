CREATE DATABASE alkohurt;

USE alkohurt;

# creating tables

CREATE TABLE products (
  product_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  type       enum ('beer', 'liquor', 'wine'),
  price      decimal UNSIGNED,
  quantity   int UNSIGNED
);

CREATE TABLE liquors (
  product_id int NOT NULL PRIMARY KEY,
  type       enum ('vodka', 'whiskey', 'gin'),
  name       varchar(50),
  abv        float UNSIGNED,
  capacity   int UNSIGNED,
  FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE beers (
  product_id     int NOT NULL PRIMARY KEY,
  brewery        varchar(50),
  name           varchar(50),
  type           varchar(50),
  abv            float UNSIGNED,
  capacity       int UNSIGNED,
  container_type ENUM ('bottle', 'can', 'returnable'),
  FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE wines (
  product_id        int NOT NULL PRIMARY KEY,
  name              varchar(50),
  color             enum ('white', 'red', 'rose'),
  type              enum ('brut nature', 'extra brut', 'brut', 'extra dry', 'dry', 'medium dry', 'medium sweet', 'sweet'),
  abv               float UNSIGNED,
  country_of_origin varchar(30),
  FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE users (
  login    varchar(50) PRIMARY KEY,
  password varchar(30),
  type     enum ('admin', 'manager', 'worker')
);

CREATE TABLE suppliers (
  supplier_id       int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name              varchar(50),
  nip               char(10),
  street_and_number varchar(50),
  postal_code       varchar(8), # 8 for international postal codes (for example PL-00001),
  city              varchar(30),
  phone_number      varchar(12),
  email             varchar(50)
);

CREATE TABLE supplies (
  supply_id   int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  supply_date date,
  supplier_id int,
  done        boolean,
  FOREIGN KEY (supplier_id) REFERENCES suppliers (supplier_id)
);

CREATE TABLE supplies_info (
  id         int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id int,
  supply_id  int,
  quantity   int UNSIGNED,
  FOREIGN KEY (product_id) REFERENCES products (product_id),
  FOREIGN KEY (supply_id) REFERENCES supplies (supply_id)
);

CREATE TABLE clients (
  client_id         int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name              varchar(50),
  nip               char(10),
  street_and_number varchar(50),
  postal_code       varchar(8), # 8 for international postal codes (for example PL-00001),
  city              varchar(30),
  phone_number      varchar(12),
  email             varchar(50)
);

CREATE TABLE sales (
  sale_id   int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  sale_date date,
  client_id int,
  done      boolean,
  FOREIGN KEY (client_id) REFERENCES clients (client_id)
);

CREATE TABLE sales_info (
  id         int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id int,
  sale_id    int,
  quantity   int UNSIGNED,
  FOREIGN KEY (product_id) REFERENCES products (product_id),
  FOREIGN KEY (sale_id) REFERENCES sales (sale_id)
);