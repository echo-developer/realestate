ALTER TABLE `pref_leads_assigned` ADD `is_seen` INT NOT NULL DEFAULT '0' AFTER `lead_status`;

ALTER TABLE `pref_project_location`
  DROP `latitude`,
  DROP `longitude`;

  ALTER TABLE `pref_properties_location`
  DROP `latitude`,
  DROP `longitude`;