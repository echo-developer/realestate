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
        Schema::create('pref_properties_location', function (Blueprint $table) {
            $table->id();
            $table->integer('pid')->nullable(); // Reference to pref_properties
            $table->integer('city')->nullable();
            $table->string('locality')->nullable();
            $table->text('property_address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_properties_location');
    }
};
