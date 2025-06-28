-- LOADING DATA
INSERT INTO car (
    make, model, year, engine_fuel_type, engine_cylinders,
    transmission_type, driven_wheels, num_doors,
    market_category, vehicle_size, vehicle_style, popularity
)
SELECT DISTINCT
    make, model, year, engine_fuel_type, engine_cylinders,
    transmission_type, driven_wheels, num_doors,
    market_category, vehicle_size, vehicle_style, popularity
FROM car_temp;

INSERT INTO car_specs (
    car_id, engine_hp, highway_mpg, city_mpg, msrp
)
SELECT
    c.car_id,
    t.engine_hp,
    t.highway_mpg,
    t.city_mpg,
    t.msrp
FROM car_temp t
JOIN car c
ON c.make = t.make
AND c.model = t.model
AND c.year = t.year
AND c.engine_fuel_type = t.engine_fuel_type
AND c.engine_cylinders = t.engine_cylinders
AND c.transmission_type = t.transmission_type
AND c.driven_wheels = t.driven_wheels
AND c.num_doors = t.num_doors
AND c.market_category = t.market_category
AND c.vehicle_size = t.vehicle_size
AND c.vehicle_style = t.vehicle_style
AND c.popularity = t.popularity;

-- CHECKING THE LOAD WORKED
Select * 
From car_data.car;
Select * 
From car_Data.car_temp;
select *
From car_data.car_specs;

-- EXPERIMENTING WITH SQL TO LEARN HOW TO USE IT
-- Most expensive car make (average price)
SELECT c.make, Round(AVG(s.msrp),2) AS avg_msrp
From car c
join car_specs s on c.car_id =s.car_id
group by c.make
order by avg_msrp desc;

-- car makes min and max retail price
select c.make, 
	max(s.msrp) as max_price,
	min(s.msrp) as min_price
from car c
join car_specs s on c.car_id = s.car_id
group by c.make
order by max_price desc;

-- avergae retail price by styl of car

select c.vehicle_style, Round(avg(msrp),2) as avg_msrp
from car c 
join car_specs s on c.car_id = s.car_id
group by c.vehicle_style
order by avg_msrp desc;

-- price vs horsepower
SELECT 
  c.make,
  c.model,
  s.engine_hp,
  ROUND(AVG(s.msrp), 2) AS avg_price
FROM car c
JOIN car_specs s ON c.car_id = s.car_id
GROUP BY c.make, c.model, s.engine_hp
ORDER BY s.engine_hp DESC, avg_price DESC;


select c.make, c.model, c.year, s.msrp
from car c
join car_specs s on c.car_id= s.car_id
order by s.msrp desc
limit 20;


-- popularity by price
select c.popularity, s.msrp
from car c 
join car_specs s on c.car_id = s.car_id
order by c.popularity DESC;

select * from car_temp;
-- price vs number of doors (probably unnecessary when you do price vs vehicle type)
select c.num_doors,round(avg(s.msrp),2) as avg_msrp
from car c
join car_specs s on c.car_id = s.car_id
group by c.num_doors
order by avg_msrp;

-- average number of doors per car style
select avg(c.num_doors), c.vehicle_style
from car c 
group by c.vehicle_style;


-- average price over time
select c.year, round(avg(msrp),2) as avg_msrp
from car c
join car_specs s on c.car_id = s.car_id
group by c.year
order by c.year;




-- STAKEHOLDER REQUEST Find out:
-- Which vehicle_style and vehicle_size categories have the highest average MSRP
-- Compare those categories’ popularity to see if popular = expensive

select 
c.vehicle_style,
c.vehicle_size,
Round(avg(s.msrp),2) as avg_msrp,
Round(avg(c.popularity),2) as avg_pop
from car_data.car c
join car_data.car_specs s on c.car_id = s.car_id
group by c.vehicle_style, c.vehicle_size
order by avg_msrp desc;

Create temporary table vehicle_summary AS (select 
c.vehicle_style,
c.vehicle_size,
Round(avg(s.msrp),2) as avg_msrp,
Round(avg(c.popularity),2) as avg_pop
from car_data.car c
join car_data.car_specs s on c.car_id = s.car_id
group by c.vehicle_style, c.vehicle_size
order by avg_msrp desc);
SELECT *,
  ROUND(100.0 * (RANK() OVER (ORDER BY avg_pop) - 1) / COUNT(*) OVER (), 2) AS popularity_percentile,
ROUND(100.0 * (RANK() OVER (ORDER BY avg_msrp) - 1) / COUNT(*) OVER (), 2) AS msrp_percentile
FROM vehicle_summary
order by popularity_percentile desc;
-- stakeholder task 2 HP vs PRICE
select 
 c.make,
 c.model, 
 c.vehicle_style,
 c.year, 
 s.engine_hp, 
 s.msrp, 
 round(s.engine_hp / ((s.msrp / 1000)) ,2) as hp_per_1000$
from car_data.car c
join car_data.car_specs s on c.car_id = s.car_id
where s.msrp>0
order by hp_per_1000$ desc;

-- Stakeholder task 3 does transmission impact price
SELECT 
  c.vehicle_style,
  c.transmission_type,
  ROUND(AVG(s.msrp), 2) AS avg_msrp
FROM car c
JOIN car_specs s ON c.car_id = s.car_id
WHERE c.transmission_type IN ('MANUAL', 'AUTOMATIC')
GROUP BY c.vehicle_style, c.transmission_type
ORDER BY c.vehicle_style, avg_msrp DESC;





