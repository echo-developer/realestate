<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('pref_admin')->insert([
            'username' => 'superadmin',
            'email' => 'superadmin@gmail.com',
            'password' => bcrypt('123456'),
            'full_name' => 'Originate Soft',
            'registered_on' => now(),
            'status' => 1,
            'role' => 1,
        ]);
        
        DB::table('pref_admin_role')->insert([
            [
                'name' => 'superadmin',
                'slug' => 'superadmin',
                'status' => 1,
                'created_at' => '2024-12-13 13:46:04',
                'updated_at' => '2024-12-13 13:46:04'
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'status' => 1,
                'created_at' => '2024-12-13 13:54:38',
                'updated_at' => '2024-12-13 13:54:38'
            ]
        ]);
        // Inserting into pref_all_setting table
        DB::table('pref_all_setting')->insert([
            ['id' => 1, 'title' => 'SEO Site Title', 'setting_key' => 'default_seo_site_title', 'setting_value' => 'Realestate', 'editable' => 1, 'deletable' => 1, 'display_order' => 1, 'status' => -1, 'setting_group' => 'default', 'created_at' => Carbon::parse('2024-11-27 09:31:29'), 'updated_at' => Carbon::parse('2024-11-27 09:32:33')],
            ['id' => 2, 'title' => 'Site Default language', 'setting_key' => 'default-language', 'setting_value' => 'en,ar', 'editable' => 1, 'deletable' => 0, 'display_order' => 2, 'status' => 1, 'setting_group' => 'default', 'created_at' => Carbon::parse('2024-11-27 09:32:19'), 'updated_at' => Carbon::parse('2024-11-27 10:22:49')],
            ['id' => 3, 'title' => 'SEO Site Title', 'setting_key' => 'default_seo_site_title', 'setting_value' => 'Realestate', 'editable' => 1, 'deletable' => 0, 'display_order' => 1, 'status' => 1, 'setting_group' => 'default', 'created_at' => Carbon::parse('2024-11-27 09:33:27'), 'updated_at' => Carbon::parse('2024-11-27 09:33:27')],
            ['id' => 4, 'title' => 'Site Title', 'setting_key' => 'site-title', 'setting_value' => 'New Admin', 'editable' => 1, 'deletable' => 0, 'display_order' => 3, 'status' => 1, 'setting_group' => 'default', 'created_at' => Carbon::parse('2024-11-27 09:33:59'), 'updated_at' => Carbon::parse('2024-11-27 09:33:59')],
            ['id' => 5, 'title' => 'Admin Default Language', 'setting_key' => 'admin-default-lang', 'setting_value' => 'en,ar', 'editable' => 1, 'deletable' => 0, 'display_order' => 2, 'status' => 1, 'setting_group' => 'custom', 'created_at' => Carbon::parse('2024-11-27 09:45:03'), 'updated_at' => Carbon::parse('2024-11-29 06:56:34')],
            ['id' => 6, 'title' => 'Admin Email', 'setting_key' => 'admin-email', 'setting_value' => 'soumyadip20y@gmail.com', 'editable' => 1, 'deletable' => 0, 'display_order' => 1, 'status' => 1, 'setting_group' => 'general', 'created_at' => Carbon::parse('2024-11-28 09:35:26'), 'updated_at' => Carbon::parse('2024-11-28 09:35:26')],
            ['id' => 7, 'title' => 'Lanaguage', 'setting_key' => 'lanaguage', 'setting_value' => 'en,ar', 'editable' => 1, 'deletable' => 0, 'display_order' => 1, 'status' => 1, 'setting_group' => 'general', 'created_at' => Carbon::parse('2024-11-28 09:35:55'), 'updated_at' => Carbon::parse('2024-11-28 09:35:55')],
            ['id' => 8, 'title' => 'Google Api Key', 'setting_key' => 'google-api-key', 'setting_value' => 'AIzaSyCV9iIbI0rK9plfq9651Ad8PZsiBiUPE04', 'editable' => 1, 'deletable' => 0, 'display_order' => 1, 'status' => 1, 'setting_group' => 'api', 'created_at' => Carbon::parse('2024-11-28 09:37:31'), 'updated_at' => Carbon::parse('2024-11-28 09:37:31')],
            ['id' => 9, 'title' => 'Google Client Id', 'setting_key' => 'google-client-id', 'setting_value' => '26249774669-ja3li9la34i5tgl36004v10lg5m5mgqk.apps.googleusercontent.com', 'editable' => 1, 'deletable' => 0, 'display_order' => 2, 'status' => 1, 'setting_group' => 'api', 'created_at' => Carbon::parse('2024-11-28 09:38:04'), 'updated_at' => Carbon::parse('2024-11-28 09:38:04')],
            ['id' => 10, 'title' => 'Site Currency', 'setting_key' => 'site-currency', 'setting_value' => '$50', 'editable' => 1, 'deletable' => 0, 'display_order' => 1, 'status' => 1, 'setting_group' => 'email', 'created_at' => Carbon::parse('2024-11-28 09:38:55'), 'updated_at' => Carbon::parse('2024-11-28 09:38:55')],
            ['id' => 11, 'title' => 'SMTP ENABLE', 'setting_key' => 'is_smtp', 'setting_value' => '1', 'editable' => 1, 'deletable' => 0, 'display_order' => 2, 'status' => 1, 'setting_group' => 'email', 'created_at' => Carbon::parse('2024-11-28 09:39:28'), 'updated_at' => Carbon::parse('2024-11-28 09:39:28')],
            ['id' => 12, 'title' => 'SMTP Host', 'setting_key' => 'smtp-host', 'setting_value' => 'smtp.gmail.com', 'editable' => 1, 'deletable' => 0, 'display_order' => 3, 'status' => 1, 'setting_group' => 'email', 'created_at' => Carbon::parse('2024-11-28 09:40:51'), 'updated_at' => Carbon::parse('2024-11-28 11:44:23')],
            ['id' => 13, 'title' => 'SMTP User', 'setting_key' => 'smtp-user', 'setting_value' => 's.s.arsad98@gmail.com', 'editable' => 1, 'deletable' => 0, 'display_order' => 4, 'status' => 1, 'setting_group' => 'email', 'created_at' => Carbon::parse('2024-11-28 09:41:30'), 'updated_at' => Carbon::parse('2024-11-28 11:34:06')],
            ['id' => 14, 'title' => 'SMTP Password', 'setting_key' => 'smtp-pass', 'setting_value' => 'axxrpzjutiveaqsr', 'editable' => 1, 'deletable' => 0, 'display_order' => 5, 'status' => 1, 'setting_group' => 'email', 'created_at' => Carbon::parse('2024-11-28 09:42:02'), 'updated_at' => Carbon::parse('2024-11-28 11:34:17')],
            ['id' => 15, 'title' => 'SMTP Port', 'setting_key' => 'smtp-port', 'setting_value' => '587', 'editable' => 1, 'deletable' => 0, 'display_order' => 6, 'status' => 1, 'setting_group' => 'email', 'created_at' => Carbon::parse('2024-11-28 09:42:42'), 'updated_at' => Carbon::parse('2024-11-28 09:42:55')],
            ['id' => 16, 'title' => 'Site Currency Code', 'setting_key' => 'site-currency-code', 'setting_value' => 'USD', 'editable' => 1, 'deletable' => 0, 'display_order' => 2, 'status' => 1, 'setting_group' => 'custom', 'created_at' => Carbon::parse('2024-11-28 14:16:29'), 'updated_at' => Carbon::parse('2024-11-28 14:16:29')]
        ]);

        // Inserting into pref_setting_group table
        DB::table('pref_setting_group')->insert([
            ['setting_group_id' => 1, 'group_name' => 'Custom', 'group_key' => 'custom', 'status' => 1, 'created_at' => Carbon::parse('2024-11-22 05:56:42'), 'updated_at' => Carbon::parse('2024-11-22 05:56:42')],
            ['setting_group_id' => 2, 'group_name' => 'General', 'group_key' => 'general', 'status' => 1, 'created_at' => Carbon::parse('2024-11-27 09:26:21'), 'updated_at' => Carbon::parse('2024-11-27 09:26:21')],
            ['setting_group_id' => 3, 'group_name' => 'API', 'group_key' => 'api', 'status' => 1, 'created_at' => Carbon::parse('2024-11-27 09:26:33'), 'updated_at' => Carbon::parse('2024-11-27 09:26:33')],
            ['setting_group_id' => 4, 'group_name' => 'Email', 'group_key' => 'email', 'status' => 1, 'created_at' => Carbon::parse('2024-11-27 09:26:51'), 'updated_at' => Carbon::parse('2024-11-27 09:26:51')],
            ['setting_group_id' => 5, 'group_name' => 'Payment', 'group_key' => 'payment', 'status' => 0, 'created_at' => Carbon::parse('2024-11-27 09:27:07'), 'updated_at' => Carbon::parse('2024-11-28 14:23:04')],
            ['setting_group_id' => 6, 'group_name' => 'Constants', 'group_key' => 'constants', 'status' => 0, 'created_at' => Carbon::parse('2024-11-27 09:29:40'), 'updated_at' => Carbon::parse('2024-11-28 14:22:47')]
        ]);

        DB::table('pref_menu_management')->insert([
            ['id' => 1, 'parent_id' => 0, 'name' => 'Dashboards', 'slug' => 'dashboards', 'description' => 'Dashboard Menu', 'icon_class' => 'pe-7s-rocket', 'menu_code' => NULL, 'url' => 'dashboard', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 03:12:16'],
            ['id' => 2, 'parent_id' => 0, 'name' => 'Notification', 'slug' => 'notification', 'description' => 'Admin Notification Menu', 'icon_class' => 'pe-7s-bell', 'menu_code' => NULL, 'url' => 'admin_notifiaction', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 3, 'parent_id' => 0, 'name' => 'Setting', 'slug' => 'setting', 'description' => 'Setting Menu', 'icon_class' => 'pe-7s-config', 'menu_code' => NULL, 'url' => NULL, 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 4, 'parent_id' => 3, 'name' => 'All Setting', 'slug' => 'all-setting', 'description' => 'All settings management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'Settings/default', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 5, 'parent_id' => 3, 'name' => 'Group Setting', 'slug' => 'group-setting', 'description' => 'Group settings management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'group-setting', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 6, 'parent_id' => 0, 'name' => 'Admin', 'slug' => 'admin', 'description' => 'Admin Menu', 'icon_class' => 'pe-7s-user', 'menu_code' => NULL, 'url' => NULL, 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 7, 'parent_id' => 6, 'name' => 'Role', 'slug' => 'admin-role', 'description' => 'Role management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'adminrole', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 8, 'parent_id' => 6, 'name' => 'Users', 'slug' => 'admin-users', 'description' => 'Users management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'admin_user', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 9, 'parent_id' => 6, 'name' => 'Permission', 'slug' => 'admin-permission', 'description' => 'Permission management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => '/permission-view', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 10, 'parent_id' => 0, 'name' => 'Management', 'slug' => 'management', 'description' => 'Management Menu', 'icon_class' => 'pe-7s-tools', 'menu_code' => NULL, 'url' => NULL, 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 11, 'parent_id' => 10, 'name' => 'Testimonial', 'slug' => 'management-testimonial', 'description' => 'Testimonial management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'management/testimonial', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 12, 'parent_id' => 10, 'name' => 'Email Templates', 'slug' => 'management-email-templates', 'description' => 'Email templates management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'management/emailTemplate', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 13, 'parent_id' => 10, 'name' => 'Notification Templates', 'slug' => 'management-notification-templates', 'description' => 'Notification templates management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'management/notificationtemplate', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 14, 'parent_id' => 10, 'name' => 'CMS', 'slug' => 'management-cms', 'description' => 'CMS management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'management/cms', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 15, 'parent_id' => 0, 'name' => 'Property Setting', 'slug' => 'property-setting', 'description' => 'Property settings menu', 'icon_class' => 'pe-7s-home', 'menu_code' => NULL, 'url' => NULL, 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 16, 'parent_id' => 15, 'name' => 'Property Category', 'slug' => 'property-category', 'description' => 'Property category management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'property/category', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 17, 'parent_id' => 15, 'name' => 'Property Sub Category', 'slug' => 'property-sub-category', 'description' => 'Property subcategory management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'property/subcategory', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 18, 'parent_id' => 15, 'name' => 'Property Status', 'slug' => 'property-status', 'description' => 'Property status management', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'property/status', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:32:58', 'updated_at' => '2024-12-11 02:32:58'],
            ['id' => 19, 'parent_id' => 15, 'name' => 'Property Transaction', 'slug' => 'property-transaction', 'description' => 'Manage Property Transaction', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'property/transaction', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 20, 'parent_id' => 15, 'name' => 'Property Furnishing', 'slug' => 'property-furnishing', 'description' => 'Manage Property Furnishing', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'property/furnishing', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 21, 'parent_id' => 15, 'name' => 'Property Budget', 'slug' => 'property-budget', 'description' => 'Manage Property Budget', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'property/budget', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 22, 'parent_id' => 15, 'name' => 'Property Recommended', 'slug' => 'property-recommended', 'description' => 'Manage Property Recommended', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'property/recommended', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 23, 'parent_id' => 15, 'name' => 'Property Length', 'slug' => 'property-length', 'description' => 'Manage Property Length', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'property/length', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 24, 'parent_id' => 0, 'name' => 'Project Setting', 'slug' => 'project-setting', 'description' => 'Project settings menu', 'icon_class' => 'pe-7s-back-2', 'menu_code' => NULL, 'url' => NULL, 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 25, 'parent_id' => 24, 'name' => 'Project List', 'slug' => 'project-list', 'description' => 'Manage Project List', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'project/#', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 26, 'parent_id' => 24, 'name' => 'Project Amenity', 'slug' => 'project-amenity', 'description' => 'Manage Project Amenity', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'project/amenity', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 27, 'parent_id' => 0, 'name' => 'Location', 'slug' => 'location', 'description' => 'Location Settings Menu', 'icon_class' => 'pe-7s-map-marker', 'menu_code' => NULL, 'url' => NULL, 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 28, 'parent_id' => 27, 'name' => 'Country', 'slug' => 'country', 'description' => 'Manage Countries', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'country', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 29, 'parent_id' => 27, 'name' => 'State', 'slug' => 'state', 'description' => 'Manage States', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'state', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 30, 'parent_id' => 27, 'name' => 'City', 'slug' => 'city', 'description' => 'Manage Cities', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'city', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 31, 'parent_id' => 0, 'name' => 'Users', 'slug' => 'users', 'description' => 'User management menu', 'icon_class' => 'pe-7s-map-marker', 'menu_code' => NULL, 'url' => NULL, 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24'],
            ['id' => 32, 'parent_id' => 31, 'name' => 'All Users', 'slug' => 'all-users', 'description' => 'Manage All Users', 'icon_class' => NULL, 'menu_code' => NULL, 'url' => 'member/memberUser', 'status' => 1, 'order' => NULL, 'action' => 'list', 'created_at' => '2024-12-11 02:58:24', 'updated_at' => '2024-12-11 02:58:24']
        ]);

        DB::table('pref_permissions')->insert([
            ['menu_code' => 'dashboards', 'role_id' => 1],
            ['menu_code' => 'notification', 'role_id' => 1],
            ['menu_code' => 'setting', 'role_id' => 1],
            ['menu_code' => 'all-setting', 'role_id' => 1],
            ['menu_code' => 'group-setting', 'role_id' => 1],
            ['menu_code' => 'admin', 'role_id' => 1],
            ['menu_code' => 'admin-role', 'role_id' => 1],
            ['menu_code' => 'admin-users', 'role_id' => 1],
            ['menu_code' => 'admin-permission', 'role_id' => 1],
            ['menu_code' => 'management', 'role_id' => 1],
            ['menu_code' => 'management-testimonial', 'role_id' => 1],
            ['menu_code' => 'management-email-templates', 'role_id' => 1],
            ['menu_code' => 'management-notification-templates', 'role_id' => 1],
            ['menu_code' => 'management-cms', 'role_id' => 1],
            ['menu_code' => 'property-setting', 'role_id' => 1],
            ['menu_code' => 'property-category', 'role_id' => 1],
            ['menu_code' => 'property-sub-category', 'role_id' => 1],
            ['menu_code' => 'property-status', 'role_id' => 1],
            ['menu_code' => 'property-transaction', 'role_id' => 1],
            ['menu_code' => 'property-furnishing', 'role_id' => 1],
            ['menu_code' => 'property-budget', 'role_id' => 1],
            ['menu_code' => 'property-recommended', 'role_id' => 1],
            ['menu_code' => 'property-length', 'role_id' => 1],
            ['menu_code' => 'project-setting', 'role_id' => 1],
            ['menu_code' => 'project-list', 'role_id' => 1],
            ['menu_code' => 'project-amenity', 'role_id' => 1],
            ['menu_code' => 'location', 'role_id' => 1],
            ['menu_code' => 'country', 'role_id' => 1],
            ['menu_code' => 'state', 'role_id' => 1],
            ['menu_code' => 'city', 'role_id' => 1],
            ['menu_code' => 'locality', 'role_id' => 1],
            ['menu_code' => 'users', 'role_id' => 1],
            ['menu_code' => 'all-users', 'role_id' => 1]
        ]);
    }
}
