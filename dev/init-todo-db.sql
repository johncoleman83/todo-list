-- Drop database
DROP DATABASE IF EXISTS todo_dev_db;

-- Create database + user if doesn't exist
CREATE DATABASE IF NOT EXISTS todo_dev_db;
GRANT ALL PRIVILEGES ON todo_dev_db.* To 'todo_dv'@'172.17.0.2'
      IDENTIFIED BY 'todo_dev_pwd';
FLUSH PRIVILEGES;
