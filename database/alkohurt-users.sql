USE alkohurt;

CREATE USER 'app'@'%' IDENTIFIED BY 'apppassword';
CREATE USER 'admin'@'%' IDENTIFIED BY 'adminpassword';
CREATE USER 'manager'@'%' IDENTIFIED BY 'managerpassword';
CREATE USER 'worker'@'%' IDENTIFIED BY 'workerpassword';

GRANT ALL PRIVILEGES ON 'alkohurt'.'users' TO 'app'@'%';

GRANT SELECT, INSERT, DELETE, UPDATE ON 'alkohurt'.* TO 'admin'@'%';

FLUSH PRIVILEGES;