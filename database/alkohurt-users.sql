USE alkohurt;

CREATE USER IF NOT EXISTS 'app'@'localhost' IDENTIFIED BY 'apppassword';
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'adminpassword';
CREATE USER IF NOT EXISTS 'manager'@'localhost' IDENTIFIED BY 'managerpassword';
CREATE USER IF NOT EXISTS 'worker'@'localhost' IDENTIFIED BY 'workerpassword';

CREATE ROLE IF NOT EXISTS worker;
CREATE ROLE IF NOT EXISTS manager;
CREATE ROLE IF NOT EXISTS admin;

GRANT worker TO manager;
GRANT manager TO admin;

GRANT manager TO `manager`@`localhost`;
GRANT worker TO `worker`@`localhost`;
GRANT admin TO `admin`@`localhost`;

SET DEFAULT ROLE worker FOR `worker`@`localhost`;
SET DEFAULT ROLE manager FOR `manager`@`localhost`;
SET DEFAULT ROLE admin FOR `admin`@`localhost`;

GRANT SELECT ON alkohurt.products TO worker;
GRANT SELECT ON alkohurt.beers TO worker;
GRANT SELECT ON alkohurt.wines TO worker;
GRANT SELECT ON alkohurt.liquors TO worker;
GRANT SELECT ON alkohurt.suppliers TO worker;
GRANT INSERT ON alkohurt.clients TO worker;
GRANT INSERT ON alkohurt.supplies TO worker;
GRANT INSERT ON alkohurt.sales TO worker;
GRANT INSERT ON alkohurt.supplies_info TO worker;
GRANT INSERT ON alkohurt.sales_info TO worker;

GRANT EXECUTE ON FUNCTION alkohurt.quantity_on_date TO worker;
GRANT EXECUTE ON PROCEDURE alkohurt.update_sale TO worker;
GRANT EXECUTE ON PROCEDURE alkohurt.update_supply TO worker;

GRANT EXECUTE ON PROCEDURE alkohurt.add_beer TO manager;
GRANT EXECUTE ON PROCEDURE alkohurt.add_liquor TO manager;
GRANT EXECUTE ON PROCEDURE alkohurt.add_wine TO manager;

GRANT INSERT ON alkohurt.users TO admin;
GRANT DELETE ON alkohurt.users TO admin;

GRANT SELECT on alkohurt.users TO 'app'@'localhost';
