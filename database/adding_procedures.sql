DELIMITER //
CREATE PROCEDURE add_beer(IN name VARCHAR(50), IN brewery VARCHAR(50), IN abv FLOAT UNSIGNED, IN type VARCHAR(50),
  IN capacity INT UNSIGNED, IN container_type ENUM('bottle', 'can', 'returnable'), IN price DECIMAL UNSIGNED)
  BEGIN
    IF beer_already_exists(name, brewery, abv, type, capacity, container_type) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Beer already exists';
    ELSE
      CALL add_product('beer', price, 0, @id);
      CALL inner_add_beer(@id, name, brewery, abv, type, capacity, container_type);
    END IF;
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
CREATE PROCEDURE add_product(IN type_in ENUM('beer', 'liquor', 'wine'), IN price_in DECIMAL UNSIGNED,
  IN quantity_in INT UNSIGNED, OUT id INT)
  BEGIN
    INSERT INTO products(type, price, quantity)
    VALUES (
      type_in,
      price_in,
      quantity_in
    );
    SELECT last_insert_id() INTO id;
  END //
DELIMITER ;

DROP FUNCTION IF EXISTS beer_already_exists;
DROP PROCEDURE IF EXISTS add_beer;
DROP PROCEDURE IF EXISTS inner_add_beer;
DROP PROCEDURE IF EXISTS add_product

SELECT * FROM products;
CALL add_beer('piwko', 'browarex', 6.9, 'mocne', 500, 'can', 2.99);

# TODO
# triggery po usuwaniu, modyfikacji tabeli trunkow
