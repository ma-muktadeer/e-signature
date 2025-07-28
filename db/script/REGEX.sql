-- Drop the table if it exists
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE T_REGEX';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN
      RAISE;
    END IF;
END;
/

-- Create the table
CREATE TABLE T_REGEX (
  id_regex_key NUMBER PRIMARY KEY,
  tx_name VARCHAR2(20),
  tx_regex VARCHAR2(100)
);

-- Insert data into the table
INSERT INTO T_REGEX (id_regex_key, tx_name, tx_regex) VALUES (1, 'name', '^[a-zA-Z0-9-_ .]+$');
INSERT INTO T_REGEX (id_regex_key, tx_name, tx_regex) VALUES (2, 'email', '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
INSERT INTO T_REGEX (id_regex_key, tx_name, tx_regex) VALUES (3, 'phoneNumber', '^\d{11}$');
INSERT INTO T_REGEX (id_regex_key, tx_name, tx_regex) VALUES (4, 'numericNumber', '^[0-9]+$');
INSERT INTO T_REGEX (id_regex_key, tx_name, tx_regex) VALUES (5, 'template', '^[a-zA-Z0-9-_. #@&!$%^`~*()+=/?,:|;''"\\]+$');

COMMIT;
-- Select all rows from the table
SELECT * FROM T_REGEX;
