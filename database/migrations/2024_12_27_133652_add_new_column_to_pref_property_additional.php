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
            $table->string('car_parking')->nullable()->after('token_amount');
            $table->string('facing_direction')->nullable()->after('token_amount');
            $table->string('flat_each_floor')->nullable()->after('token_amount');
            $table->string('lifts_in_tower')->nullable()->after('token_amount');
            $table->string('water_available')->nullable()->after('token_amount');
            $table->string('electric_available')->nullable()->after('token_amount');
            $table->string('buyer_message')->nullable()->after('token_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pref_property_additional', function (Blueprint $table) {
            $table->dropColumn('car_parking');
            $table->dropColumn('facing_direction');
            $table->dropColumn('flat_each_floor');
            $table->dropColumn('lifts_in_tower');
            $table->dropColumn('water_available');
            $table->dropColumn('electric_available');
            $table->dropColumn('buyer_message');
        });
    }
};
