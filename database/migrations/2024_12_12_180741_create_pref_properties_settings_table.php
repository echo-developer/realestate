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
        Schema::create('pref_properties_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('pid')->nullable(); // Reference to pref_properties
            $table->text('parking_ability')->nullable();
            $table->integer('property_type_for')->nullable();
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms')->nullable();
            $table->integer('property_type')->nullable();
            $table->integer('carpet_area')->nullable();
            $table->integer('plot_area')->nullable();
            $table->integer('rooms')->nullable();
            $table->double('expected_price')->nullable();
            $table->text('post_for')->nullable();
            $table->string('price_currency')->nullable();
            $table->integer('property_budget')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_properties_settings');
    }
};
