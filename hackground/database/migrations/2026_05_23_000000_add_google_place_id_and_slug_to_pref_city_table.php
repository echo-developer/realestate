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
        Schema::table('pref_city', function (Blueprint $table) {
            if (!Schema::hasColumn('pref_city', 'slug')) {
                $table->string('slug', 255)->nullable()->after('city_id');
            }
            if (!Schema::hasColumn('pref_city', 'google_place_id')) {
                $table->string('google_place_id', 70)->nullable()->after('slug');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pref_city', function (Blueprint $table) {
            if (Schema::hasColumn('pref_city', 'google_place_id')) {
                $table->dropColumn('google_place_id');
            }
            if (Schema::hasColumn('pref_city', 'slug')) {
                $table->dropColumn('slug');
            }
        });
    }
};
