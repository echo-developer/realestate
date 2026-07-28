-- ============================================================================
--  Dutch (nl) language seed for the pref_*_names translation tables
-- ----------------------------------------------------------------------------
--  WHY: The API returns localized dynamic content by querying the pref_*_names
--       tables filtered by `lang`. Only `en` rows exist, so `?lang=nl` returns
--       empty. This script:
--         STEP 1  clones every en row -> nl (idempotent) so nothing is empty.
--         STEP 2  overwrites the nl rows of the finite, translatable enum
--                 tables with real Dutch, keyed by the English text.
--
--  SAFE TO RE-RUN: STEP 1 uses NOT EXISTS guards; STEP 2 UPDATEs only lang='nl'
--                  rows and matches on English source text (non-matches are
--                  no-ops).
--
--  NOT TRANSLATED here (left as cloned English, translate in admin):
--    - cms / email_templates / notification_templates  (long site-specific content)
--    - testimonials                                    (user quotes)
--    - cities / localities / states                    (proper place names)
--    - advertisement_packages_names                    (non-standard schema; handle manually)
--
--  Review before running on production. Back up first.
-- ============================================================================

START TRANSACTION;

-- ============================================================================
-- STEP 1 — clone en -> nl for every standard pref_*_names table
-- ============================================================================

-- property categories
INSERT INTO pref_property_category_names (category_id, lang, name, created_at, updated_at)
SELECT s.category_id, 'nl', s.name, NOW(), NOW()
FROM pref_property_category_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_property_category_names d
                  WHERE d.category_id = s.category_id AND d.lang = 'nl');

-- property sub-categories
INSERT INTO pref_property_sub_category_names (sub_category_id, lang, name, created_at, updated_at)
SELECT s.sub_category_id, 'nl', s.name, NOW(), NOW()
FROM pref_property_sub_category_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_property_sub_category_names d
                  WHERE d.sub_category_id = s.sub_category_id AND d.lang = 'nl');

-- furnish types
INSERT INTO pref_property_furnish_names (furnish_id, lang, name, created_at, updated_at)
SELECT s.furnish_id, 'nl', s.name, NOW(), NOW()
FROM pref_property_furnish_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_property_furnish_names d
                  WHERE d.furnish_id = s.furnish_id AND d.lang = 'nl');

-- transaction types
INSERT INTO pref_property_transaction_names (transaction_id, lang, name, created_at, updated_at)
SELECT s.transaction_id, 'nl', s.name, NOW(), NOW()
FROM pref_property_transaction_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_property_transaction_names d
                  WHERE d.transaction_id = s.transaction_id AND d.lang = 'nl');

-- recommended types
INSERT INTO pref_property_recommended_names (recommended_id, lang, name, created_at, updated_at)
SELECT s.recommended_id, 'nl', s.name, NOW(), NOW()
FROM pref_property_recommended_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_property_recommended_names d
                  WHERE d.recommended_id = s.recommended_id AND d.lang = 'nl');

-- property status
INSERT INTO pref_property_status_names (status_id, lang, name, created_at, updated_at)
SELECT s.status_id, 'nl', s.name, NOW(), NOW()
FROM pref_property_status_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_property_status_names d
                  WHERE d.status_id = s.status_id AND d.lang = 'nl');

-- project amenities
INSERT INTO pref_project_amenity_names (amenity_id, lang, name, created_at, updated_at)
SELECT s.amenity_id, 'nl', s.name, NOW(), NOW()
FROM pref_project_amenity_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_project_amenity_names d
                  WHERE d.amenity_id = s.amenity_id AND d.lang = 'nl');

-- countries
INSERT INTO pref_country_names (name, country_id, lang, created_at, updated_at)
SELECT s.name, s.country_id, 'nl', NOW(), NOW()
FROM pref_country_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_country_names d
                  WHERE d.country_id = s.country_id AND d.lang = 'nl');

-- states  (place names -> kept as source)
INSERT INTO pref_state_names (state_id, lang, name, created_at, updated_at)
SELECT s.state_id, 'nl', s.name, NOW(), NOW()
FROM pref_state_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_state_names d
                  WHERE d.state_id = s.state_id AND d.lang = 'nl');

-- cities  (no timestamps; place names -> kept as source)
INSERT INTO pref_city_names (city_id, lang, name)
SELECT s.city_id, 'nl', s.name
FROM pref_city_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_city_names d
                  WHERE d.city_id = s.city_id AND d.lang = 'nl');

-- localities  (no timestamps; place names -> kept as source)
INSERT INTO pref_locality_names (locality_id, lang, name)
SELECT s.locality_id, 'nl', s.name
FROM pref_locality_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_locality_names d
                  WHERE d.locality_id = s.locality_id AND d.lang = 'nl');

-- testimonials  (translate quotes in admin later)
INSERT INTO pref_testimonial_names (testimonial_id, lang, name, subname, description, created_at, updated_at)
SELECT s.testimonial_id, 'nl', s.name, s.subname, s.description, NOW(), NOW()
FROM pref_testimonial_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_testimonial_names d
                  WHERE d.testimonial_id = s.testimonial_id AND d.lang = 'nl');

-- CMS pages  (no timestamps; translate long content in admin later)
INSERT INTO pref_cms_names (cms_id, lang, title, content, meta_desc, meta_title, meta_keys)
SELECT s.cms_id, 'nl', s.title, s.content, s.meta_desc, s.meta_title, s.meta_keys
FROM pref_cms_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_cms_names d
                  WHERE d.cms_id = s.cms_id AND d.lang = 'nl');

-- email templates  (no timestamps; translate in admin later)
INSERT INTO pref_email_templates_names (email_template_id, lang, subject, content)
SELECT s.email_template_id, 'nl', s.subject, s.content
FROM pref_email_templates_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_email_templates_names d
                  WHERE d.email_template_id = s.email_template_id AND d.lang = 'nl');

-- notification templates  (no timestamps; translate in admin later)
INSERT INTO pref_notification_templates_names (notification_template_id, lang, content)
SELECT s.notification_template_id, 'nl', s.content
FROM pref_notification_templates_names s
WHERE s.lang = 'en'
  AND NOT EXISTS (SELECT 1 FROM pref_notification_templates_names d
                  WHERE d.notification_template_id = s.notification_template_id AND d.lang = 'nl');

-- ============================================================================
-- STEP 2 — real Dutch for the finite, translatable enum tables
--          (keyed by English source text; only touches lang='nl')
-- ============================================================================

-- ---- property categories ----
UPDATE pref_property_category_names SET name='Residentieel' WHERE lang='nl' AND name='Residential';
UPDATE pref_property_category_names SET name='Commercieel'  WHERE lang='nl' AND name='Commercial';
UPDATE pref_property_category_names SET name='Industrieel'  WHERE lang='nl' AND name='Industrial';
UPDATE pref_property_category_names SET name='Agrarisch'    WHERE lang='nl' AND name='Agricultural';

-- ---- property sub-categories ----
UPDATE pref_property_sub_category_names SET name='Appartementen / Flats'      WHERE lang='nl' AND name='Apartments / Flats';
UPDATE pref_property_sub_category_names SET name="Villa's"                    WHERE lang='nl' AND name='Villas';
UPDATE pref_property_sub_category_names SET name='Woonhuis'                   WHERE lang='nl' AND name='Residential House';
UPDATE pref_property_sub_category_names SET name='Etagewoning'               WHERE lang='nl' AND name='Builder Floor Apartment';
UPDATE pref_property_sub_category_names SET name='Woongrond / Kavel'          WHERE lang='nl' AND name='Residential Land/ Plot';
UPDATE pref_property_sub_category_names SET name='Penthouse'                  WHERE lang='nl' AND name='Penthouse';
UPDATE pref_property_sub_category_names SET name='Studio'                     WHERE lang='nl' AND name='Studio Apartment';
UPDATE pref_property_sub_category_names SET name='Camper'                     WHERE lang='nl' AND name='Camper';
UPDATE pref_property_sub_category_names SET name='Kantoren'                   WHERE lang='nl' AND name='Offices';
UPDATE pref_property_sub_category_names SET name='Magazijnen'                 WHERE lang='nl' AND name='Warehouses';
UPDATE pref_property_sub_category_names SET name='Commerciële kantoorruimte' WHERE lang='nl' AND name='Commercial Office Space';
UPDATE pref_property_sub_category_names SET name='Kantoor in IT-park / SEZ'  WHERE lang='nl' AND name='Office in IT Park/ SEZ';
UPDATE pref_property_sub_category_names SET name='Bedrijfsruimte / Winkel'   WHERE lang='nl' AND name='Commercial Shop';
UPDATE pref_property_sub_category_names SET name='Commerciële showroom'      WHERE lang='nl' AND name='Commercial Showroom';
UPDATE pref_property_sub_category_names SET name='Bedrijfsgrond'             WHERE lang='nl' AND name='Commercial Land';
UPDATE pref_property_sub_category_names SET name='Magazijn / Opslag'         WHERE lang='nl' AND name='Warehouse/ Godown';
UPDATE pref_property_sub_category_names SET name='Industriegrond'            WHERE lang='nl' AND name='Industrial Land';
UPDATE pref_property_sub_category_names SET name='Industrieel gebouw'        WHERE lang='nl' AND name='Industrial Building';
UPDATE pref_property_sub_category_names SET name='Industriële loods'         WHERE lang='nl' AND name='Industrial Shed';
UPDATE pref_property_sub_category_names SET name='Fabrieken'                 WHERE lang='nl' AND name='Factories';
UPDATE pref_property_sub_category_names SET name='Landbouwgrond'             WHERE lang='nl' AND name='Agricultural Land';
UPDATE pref_property_sub_category_names SET name='Boerderij'                 WHERE lang='nl' AND name='Farm House';

-- ---- furnish types ----
UPDATE pref_property_furnish_names SET name='Volledig gemeubileerd'     WHERE lang='nl' AND name='Fully Furnished';
UPDATE pref_property_furnish_names SET name='Gedeeltelijk gemeubileerd' WHERE lang='nl' AND name='Semi-Furnished';
UPDATE pref_property_furnish_names SET name='Ongemeubileerd'            WHERE lang='nl' AND name='Unfurnished';

-- ---- property status ----
UPDATE pref_property_status_names SET name='Beschikbaar'        WHERE lang='nl' AND name='Available';
UPDATE pref_property_status_names SET name='In aanbouw'         WHERE lang='nl' AND name='Under Construction';
UPDATE pref_property_status_names SET name='Direct beschikbaar' WHERE lang='nl' AND name='Ready to Move';

-- ---- transaction types (guarded by English text; adjust if your values differ) ----
UPDATE pref_property_transaction_names SET name='Verkoop' WHERE lang='nl' AND name='Sale';
UPDATE pref_property_transaction_names SET name='Verhuur' WHERE lang='nl' AND name='Rent';
UPDATE pref_property_transaction_names SET name='Erfpacht' WHERE lang='nl' AND name='Lease';

-- ---- project amenities ----
UPDATE pref_project_amenity_names SET name='Parkeren'             WHERE lang='nl' AND name IN ('Parking','பார்க்கிங்');
UPDATE pref_project_amenity_names SET name='Waterput'            WHERE lang='nl' AND name IN ('Borewell','போர்வெல்');
UPDATE pref_project_amenity_names SET name='Lift'                WHERE lang='nl' AND name='Elevator';
UPDATE pref_project_amenity_names SET name='Zwembad'             WHERE lang='nl' AND name='Swimming Pool';
UPDATE pref_project_amenity_names SET name='Speeltuin'           WHERE lang='nl' AND name="Children's Play Area";
UPDATE pref_project_amenity_names SET name='Wifi'                WHERE lang='nl' AND name='Wi-Fi';
UPDATE pref_project_amenity_names SET name='Airconditioning'     WHERE lang='nl' AND name='Air Conditioning';
UPDATE pref_project_amenity_names SET name='Sportschool'         WHERE lang='nl' AND name='Gym';
UPDATE pref_project_amenity_names SET name='Huisdiervriendelijk' WHERE lang='nl' AND name='Pet Friendly';
UPDATE pref_project_amenity_names SET name='Verwarming'          WHERE lang='nl' AND name='Heating';
UPDATE pref_project_amenity_names SET name='Wasmachine'          WHERE lang='nl' AND name='washing machine';
UPDATE pref_project_amenity_names SET name='Droger'              WHERE lang='nl' AND name='Dryer';
UPDATE pref_project_amenity_names SET name='Balkon'              WHERE lang='nl' AND name='Balcony';
UPDATE pref_project_amenity_names SET name='Vaatwasser'          WHERE lang='nl' AND name='Dishwasher';
UPDATE pref_project_amenity_names SET name='Open haard'          WHERE lang='nl' AND name='Fireplace';
UPDATE pref_project_amenity_names SET name='Buitenruimte'        WHERE lang='nl' AND name='Outdoor Space';
UPDATE pref_project_amenity_names SET name='Jacuzzi'             WHERE lang='nl' AND name='Jacuzzi';
UPDATE pref_project_amenity_names SET name='Barbecue'            WHERE lang='nl' AND name='BBQ';
UPDATE pref_project_amenity_names SET name='Beveiligingssysteem' WHERE lang='nl' AND name='Security System';
UPDATE pref_project_amenity_names SET name='Smart home'          WHERE lang='nl' AND name='Smart Home';
UPDATE pref_project_amenity_names SET name='Kabel-tv'            WHERE lang='nl' AND name='Cable TV';
UPDATE pref_project_amenity_names SET name='Intercom'            WHERE lang='nl' AND name='Intercom';
UPDATE pref_project_amenity_names SET name='Sauna'               WHERE lang='nl' AND name='Sauna';
UPDATE pref_project_amenity_names SET name='Spelkamer'           WHERE lang='nl' AND name='Game Room';
UPDATE pref_project_amenity_names SET name='Bewaakte woonwijk'   WHERE lang='nl' AND name='Gated Community';
UPDATE pref_project_amenity_names SET name='Thuisbioscoop'       WHERE lang='nl' AND name='Home Theater';
UPDATE pref_project_amenity_names SET name='Bibliotheek'         WHERE lang='nl' AND name='Library';
UPDATE pref_project_amenity_names SET name='Dakterras'           WHERE lang='nl' AND name='Rooftop';
UPDATE pref_project_amenity_names SET name='Fietsenstalling'     WHERE lang='nl' AND name='Bike Storage';
UPDATE pref_project_amenity_names SET name='Gemeenschapstuin'    WHERE lang='nl' AND name='Community Garden';
UPDATE pref_project_amenity_names SET name='Biljart'             WHERE lang='nl' AND name='Pool Table';
UPDATE pref_project_amenity_names SET name='Sportveld'           WHERE lang='nl' AND name='Sports Court';
UPDATE pref_project_amenity_names SET name='Wasruimte'           WHERE lang='nl' AND name='Laundry Facility';
UPDATE pref_project_amenity_names SET name='Conciërgeservice'    WHERE lang='nl' AND name='Concierge Service';
UPDATE pref_project_amenity_names SET name='Portier'             WHERE lang='nl' AND name='Doorman';
UPDATE pref_project_amenity_names SET name='Berging'             WHERE lang='nl' AND name='Storage Unit';
UPDATE pref_project_amenity_names SET name='Valetparkeren'       WHERE lang='nl' AND name='Valet Parking';
UPDATE pref_project_amenity_names SET name='Golfbaan'            WHERE lang='nl' AND name='Golf Course';
UPDATE pref_project_amenity_names SET name='Aanlegsteiger'       WHERE lang='nl' AND name='Boat Dock';
UPDATE pref_project_amenity_names SET name='Zonnepanelen'        WHERE lang='nl' AND name='Solar Panels';
UPDATE pref_project_amenity_names SET name='Wijnkelder'          WHERE lang='nl' AND name='Wine Cellar';

-- ---- countries (common ones; keyed by English name) ----
UPDATE pref_country_names SET name='Nederland'            WHERE lang='nl' AND name='Netherlands';
UPDATE pref_country_names SET name='Duitsland'            WHERE lang='nl' AND name='Germany';
UPDATE pref_country_names SET name='België'               WHERE lang='nl' AND name='Belgium';
UPDATE pref_country_names SET name='Frankrijk'            WHERE lang='nl' AND name='France';
UPDATE pref_country_names SET name='Verenigd Koninkrijk'  WHERE lang='nl' AND name='United Kingdom';
UPDATE pref_country_names SET name='Verenigde Staten'     WHERE lang='nl' AND name IN ('United States','United States of America','USA');
UPDATE pref_country_names SET name='Spanje'               WHERE lang='nl' AND name='Spain';
UPDATE pref_country_names SET name='Italië'               WHERE lang='nl' AND name='Italy';
UPDATE pref_country_names SET name='Luxemburg'            WHERE lang='nl' AND name='Luxembourg';

COMMIT;

-- ============================================================================
-- Verify (run after commit):
--   SELECT lang, COUNT(*) FROM pref_property_category_names GROUP BY lang;
--   SELECT name FROM pref_property_category_names WHERE lang='nl';
-- ============================================================================
