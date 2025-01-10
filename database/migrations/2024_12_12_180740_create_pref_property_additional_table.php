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
        Schema::create('pref_property_additional', function (Blueprint $table) {
            $table->id();
            $table->integer('pid')->nullable(); // Reference to pref_properties
            $table->text('floor')->nullable();
            $table->text('total_floor')->nullable();
            $table->integer('kitchen')->nullable();
            $table->enum('corner_plot', ['yes', 'no'])->nullable();
            $table->string('construct_year')->nullable();
            $table->text('possession_status')->nullable();
            $table->text('property_furnish')->nullable();
            $table->text('property_amenity')->nullable();
            $table->integer('total_flats')->nullable();
            $table->integer('token_amount')->nullable();
            $table->string('property_desc')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_property_additional');
    }
};
