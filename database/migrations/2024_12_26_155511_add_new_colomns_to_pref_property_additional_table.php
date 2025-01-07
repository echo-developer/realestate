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
            $table->string('flooring_style')->nullable()->after('possession_status');
            $table->string('overlooking')->nullable()->after('possession_status');
            $table->string('ownership_type')->nullable()->after('overlooking');
            $table->string('is_personal_washroom')->nullable()->after('overlooking');
            $table->string('pantry_cafeteria_status')->nullable()->after('is_personal_washroom');
            $table->string('is_corner_shop')->nullable()->after('pantry_cafeteria_status');
            $table->string('faces_main_road')->nullable()->after('is_corner_shop');
            $table->integer('washroom')->nullable();
            $table->integer('balcony')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pref_property_additional', function (Blueprint $table) {
            $table->dropColumn('expected_possesion_month_year');
            $table->dropColumn('flooring_style');
            $table->dropColumn('overlooking');
            $table->dropColumn('is_personal_washroom');
            $table->dropColumn('pantry_cafeteria_status');
            $table->dropColumn('is_corner_shop');
            $table->dropColumn('faces_main_road');
            $table->dropColumn('ownership_type');
            $table->dropColumn('washroom');
            $table->dropColumn('balcony');
        });
    }
};
