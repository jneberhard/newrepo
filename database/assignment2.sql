-- 1. Insert a new record
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. change the account type
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';


-- 3. delete a record using email
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4. use PostgreSQL to modify record
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'a huge interior', 'small interiors' )


-- 5. Use an inner join to select the make and model fields from the inventory table 
--and the classification name field from the classification table for inventory items that belong to the "Sport" category. 
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id 
WHERE classification.classification_name = 'Sport'


-- 6. Update all records in the inventory table to add "/vehicles" to the middle of the file path 
--in the inv_image and inv_thumbnail columns
UPDATE inventory 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');



