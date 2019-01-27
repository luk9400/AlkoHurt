CREATE DATABASE alkohurt;

USE alkohurt;

# creating tables

CREATE TABLE products (
  product_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name       varchar(50),
  type       enum ('beer', 'liquor', 'wine'),
  capacity   int UNSIGNED,
  abv        float UNSIGNED,
  price      decimal(4, 2) UNSIGNED,
  quantity   int UNSIGNED
);

CREATE TABLE liquors (
  product_id int NOT NULL PRIMARY KEY,
  type       enum ('vodka', 'whiskey', 'gin'),
  name       varchar(50),
  abv        float UNSIGNED,
  capacity   int UNSIGNED,
  FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

CREATE TABLE beers (
  product_id     int NOT NULL PRIMARY KEY,
  brewery        varchar(50),
  name           varchar(50),
  type           varchar(50),
  abv            float UNSIGNED,
  capacity       int UNSIGNED,
  container_type ENUM ('bottle', 'can', 'returnable'),
  FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

CREATE TABLE wines (
  product_id        int NOT NULL PRIMARY KEY,
  name              varchar(50),
  color             enum ('white', 'red', 'rose'),
  type              enum ('brut nature', 'extra brut', 'brut', 'extra dry', 'dry', 'medium dry', 'medium sweet', 'sweet'),
  abv               float UNSIGNED,
  capacity          int UNSIGNED,
  country_of_origin varchar(30),
  FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

CREATE TABLE users (
  login    varchar(50) PRIMARY KEY,
  password varchar(255),
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
  FOREIGN KEY (supply_id) REFERENCES supplies (supply_id) ON DELETE CASCADE
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
  FOREIGN KEY (sale_id) REFERENCES sales (sale_id) ON DELETE CASCADE
);

DELIMITER //
CREATE PROCEDURE add_product(IN name_in VARCHAR(50), IN type_in ENUM('beer', 'liquor', 'wine'), IN capacity_in INT UNSIGNED,
  IN abv_in FLOAT UNSIGNED, IN price_in DECIMAL(4, 2) UNSIGNED, IN quantity_in INT UNSIGNED, OUT id INT)
  BEGIN
    INSERT INTO products(name, type, capacity, abv, price, quantity)
    VALUES (
      name_in,
      type_in,
      capacity_in,
      abv_in,
      price_in,
      quantity_in
    );
    SELECT last_insert_id() INTO id;
  END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION beer_already_exists(name VARCHAR(50), brewery VARCHAR(50), abv FLOAT UNSIGNED, type VARCHAR(50),
  capacity INT UNSIGNED, container_type ENUM('bottle', 'can', 'returnable')) RETURNS BOOLEAN
  BEGIN
    RETURN !ISNULL ((
      SELECT product_id
      FROM beers b
      WHERE
        b.name = name AND
        b.brewery = brewery AND
        b.abv = abv AND
        b.type = type AND
        b.capacity = capacity AND
        b.container_type = container_type
    ));
  END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE inner_add_beer(IN id INT, IN name_in VARCHAR(50), IN brewery_in VARCHAR(50), IN abv_in FLOAT UNSIGNED,
  IN type_in VARCHAR(50), IN capacity_in INT UNSIGNED, IN container_type_in ENUM('bottle', 'can', 'returnable'))
  BEGIN
    INSERT INTO beers(product_id, brewery, name, type, abv, capacity, container_type)
    VALUES (
      id,
      brewery_in,
      name_in,
      type_in,
      abv_in,
      capacity_in,
      container_type_in
    );
  END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE add_beer(IN name VARCHAR(50), IN brewery VARCHAR(50), IN abv FLOAT UNSIGNED, IN type VARCHAR(50),
  IN capacity INT UNSIGNED, IN container_type ENUM('bottle', 'can', 'returnable'), IN price DECIMAL(4, 2) UNSIGNED)
  BEGIN
    IF beer_already_exists(name, brewery, abv, type, capacity, container_type) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Beer already exists';
    ELSE
      CALL add_product(name, 'beer', capacity, abv, price, 0, @id);
      CALL inner_add_beer(@id, name, brewery, abv, type, capacity, container_type);
    END IF;
  END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION wine_already_exists(name VARCHAR(50), color ENUM('white', 'red', 'rose'), abv FLOAT UNSIGNED,
  type enum ('brut nature', 'extra brut', 'brut', 'extra dry', 'dry', 'medium dry', 'medium sweet', 'sweet'),
  capacity INT UNSIGNED, country_of_origin VARCHAR(30)) RETURNS BOOLEAN
  BEGIN
    RETURN !ISNULL ((
      SELECT product_id
      FROM wines w
      WHERE
        w.name = name AND
        w.color = color AND
        w.abv = abv AND
        w.type = type AND
        w.capacity = capacity AND
        w.country_of_origin = country_of_origin
      ));
  END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE inner_add_wine(IN id INT, IN name_in VARCHAR(50), IN color_in ENUM('white', 'red', 'rose'), IN abv_in FLOAT UNSIGNED,
  IN type_in enum ('brut nature', 'extra brut', 'brut', 'extra dry', 'dry', 'medium dry', 'medium sweet', 'sweet'),
  IN capacity_in INT UNSIGNED, IN country_of_origin_in VARCHAR(30))
  BEGIN
    INSERT INTO wines(product_id, name, color, type, abv, capacity, country_of_origin)
    VALUES (
      id,
      name_in,
      color_in,
      type_in,
      abv_in,
      capacity_in,
      country_of_origin_in
    );
  END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE add_wine(IN name VARCHAR(50), IN color ENUM('white', 'red', 'rose'), IN abv FLOAT UNSIGNED,
  IN type ENUM('brut nature', 'extra brut', 'brut', 'extra dry', 'dry', 'medium dry', 'medium sweet', 'sweet'),
  IN capacity INT UNSIGNED, IN country_of_origin VARCHAR(30), IN price DECIMAL(4, 2) UNSIGNED)
  BEGIN
    IF wine_already_exists(name, color, abv, type, capacity, country_of_origin) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wine already exists';
    ELSE
      CALL add_product(name, 'wine',capacity, abv, price, 0, @id);
      CALL inner_add_wine(@id, name, color, abv, type, capacity, country_of_origin);
    END IF;
  END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION liquor_already_exists(name VARCHAR(50), type enum ('vodka', 'whiskey', 'gin'), abv FLOAT UNSIGNED,
  capacity INT UNSIGNED) RETURNS BOOLEAN
  BEGIN
    RETURN !ISNULL ((
      SELECT product_id
      FROM liquors l
      WHERE
        l.name = name AND
        l.type = type AND
        l.abv = abv AND
        l.capacity = capacity
    ));
  END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE inner_add_liquor(IN id INT, IN name_in VARCHAR(50), IN type_in enum('vodka', 'whiskey', 'gin'),
  IN abv_in FLOAT UNSIGNED, IN capacity_in INT UNSIGNED)
  BEGIN
    INSERT INTO liquors(product_id, name, type, abv, capacity)
    VALUES (
      id,
      name_in,
      type_in,
      abv_in,
      capacity_in
    );
  END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE add_liquor(IN name VARCHAR(50), IN type ENUM('vodka', 'whiskey', 'gin'), IN abv FLOAT UNSIGNED,
  IN capacity INT UNSIGNED, IN price DECIMAL(4, 2) UNSIGNED)
  BEGIN
    IF liquor_already_exists(name, type, abv, capacity) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Liquor already exists';
    ELSE
      CALL add_product(name, 'liquor', capacity, abv, price, 0, @id);
      CALL inner_add_liquor(@id, name, type, abv, capacity);
    END IF;
  END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE plan_supply(IN supply_date DATE, IN supplier VARCHAR(50))
BEGIN

INSERT INTO supplies (supply_date, done) VALUES (supply_date, supplier);
END //

DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_quantity_supplies AFTER UPDATE ON supplies FOR EACH ROW
  BEGIN
    IF NEW.done AND NOT OLD.done THEN
      CREATE TEMPORARY TABLE prods AS (
        SELECT product_id, quantity FROM supplies JOIN supplies_info si ON supplies.supply_id = si.supply_id
        WHERE supplies.supply_id = NEW.supply_id
      );
      UPDATE products p JOIN prods ON  p.product_id = prods.product_id
        SET p.quantity = p.quantity + prods.quantity;
    END IF;
  END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS delete_products AFTER DELETE ON products FOR EACH ROW
  BEGIN
    DELETE FROM beers WHERE beers.product_id = OLD.product_id;
    DELETE FROM liquors WHERE liquors.product_id = OLD.product_id;
    DELETE FROM wines WHERE wines.product_id = OLD.product_id;
  END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_quantity_sales AFTER UPDATE ON sales FOR EACH ROW
  BEGIN
    IF NEW.done AND NOT OLD.done THEN
      CREATE TEMPORARY TABLE prods AS (
        SELECT product_id, quantity FROM sales s JOIN sales_info si ON s.sale_id = si.sale_id
        WHERE s.sale_id = NEW.sale_id
      );
      UPDATE products p JOIN prods ON  p.product_id = prods.product_id
        SET p.quantity = p.quantity - prods.quantity;
    END IF;
  END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION IF NOT EXISTS quantity_on_date(in_product_id INT, in_date DATE) RETURNS INT
BEGIN
  DECLARE supplied INT;
  DECLARE sold INT;

  IF in_date < DATE(now()) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Please enter future date';
  END IF;

  SELECT SUM(quantity)
  FROM supplies_info si JOIN supplies s ON si.supply_id = s.supply_id
  WHERE si.product_id = in_product_id AND
        supply_date BETWEEN NOW() AND in_date AND
        NOT done
  INTO supplied;

  SELECT SUM(quantity)
  FROM sales_info si JOIN sales s ON si.sale_id = s.sale_id
  WHERE si.product_id = in_product_id AND
        sale_date BETWEEN NOW() AND in_date AND
        NOT done
  INTO sold;

  IF sold IS NULL THEN
    SET sold = 0;
  END IF;

  IF supplied IS NULL THEN
    SET supplied = 0;
  END IF;

  RETURN (SELECT quantity + supplied - sold
  FROM products
  WHERE product_id = in_product_id);
END //
DELIMITER ;

DROP FUNCTION quantity_on_date;
