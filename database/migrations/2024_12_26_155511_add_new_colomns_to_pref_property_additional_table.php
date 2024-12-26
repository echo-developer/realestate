<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pref_property_additional', function (Blueprint $table) {
            $table->string('expected_possesion_month_year')->nullable()->after('possession_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pref_property_additional', function (Blueprint $table) {
            $table->dropColumn('expected_possesion_month_year');
        });
    }
};
