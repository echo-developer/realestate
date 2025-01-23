<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the ENUM values for the `parking_availability` column
        DB::statement("ALTER TABLE `pref_project_settings` MODIFY `parking_availability` ENUM('AV', 'NA', 'UC') NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert the ENUM values if necessary
        DB::statement("ALTER TABLE `pref_project_settings` MODIFY `parking_availability` ENUM('A', 'NA', 'UC') NULL");
    }
};