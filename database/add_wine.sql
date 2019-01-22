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

select * FROM beers;
SELECT * FROM wines;
select * FROM products;
DELETE FROM products;
DELETE FROM beers;
DELETE FROM wines;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE products;
SET FOREIGN_KEY_CHECKS=1;

DROP FUNCTION IF EXISTS wine_already_exists;
DROP PROCEDURE IF EXISTS add_wine;
DROP PROCEDURE IF EXISTS inner_add_wine;

DROP PROCEDURE IF EXISTS add_product;

CALL add_beer('piwko', 'browar', 5, 'mocne', 350, 'can', 3.99);
CALL add_wine('amarena', 'red', 11, 'sweet', 700, 'Poland', 3.99);

SELECT * FROM products;

DELETE FROM products