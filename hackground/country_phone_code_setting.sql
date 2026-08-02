-- Adds the "Country Phone Code" setting so admins can restrict which dial codes
-- appear in the phone/country-code dropdowns (admin + frontend).
-- Value: comma-separated dial codes, e.g. "+31,+32,+49". Blank = show all.
-- Idempotent: only inserts if the key doesn't already exist.

INSERT INTO pref_all_setting
    (title, setting_key, setting_value, editable, deletable, display_order, status, setting_group, created_at, updated_at)
SELECT 'Country Phone Code', 'country-phone-code', '', 1, 0, 3, 1, 'custom', NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM pref_all_setting WHERE setting_key = 'country-phone-code'
);
