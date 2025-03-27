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
        Schema::create('advertisement_locations', function (Blueprint $table) {
            $table->foreignId('advertisement_id')->constrained('advertisement','advertisement_id');
            $table->integer('location_id');
            $table->integer('city_id');
            $table->integer('country_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisement_locations');
    }
};
