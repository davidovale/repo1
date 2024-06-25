select * from inventory;

select * from inventory where inv_id = 4;

update inventory set inv_make = 'Cat' where inv_id = 4;

insert into inventory (inv_make,inv_model, inv_year, inv_description, 
	inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
	values ('Bob', 'Car', 1995, 'Blablablab blablablablab', '/images/dogs-car-tn.png', 
	'/images/dogs-car-tn.png', 30000, 54321, 'Gray', 1);

delete from inventory where inv_id = 16;

-- Task one

select * from account;
--1
insert into account (account_firstname, account_lastname, account_email, account_password) 
	values ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--2
update account set account_type = 'Admin' where account_id = 1;

--3
delete from account where account_id = 1;

select * from inventory;

--4
update inventory set inv_description = 
	replace(inv_description,'the small interiors','a huge interior') where inv_id = 10;

select * from classification;

--5
select inv. inv_make, inv.inv_model, cla.classification_name from inventory inv 
	inner join classification cla on inv.classification_id = cla.classification_id 
	where cla.classification_id = 2;

--6
update inventory set inv_image = replace(inv_image, '/images', '/images/vehicles'), 
	inv_thumbnail = replace(inv_thumbnail, '/images', '/images/vehicles');


