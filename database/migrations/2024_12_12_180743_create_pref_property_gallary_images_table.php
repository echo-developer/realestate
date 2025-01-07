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
        Schema::create('pref_property_gallary_images', function (Blueprint $table) {
            $table->id();
            $table->integer('gallary_id')->nullable(); // Reference to pref_properties
            $table->string('filename')->nullable();
            $table->string('image_description')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_property_gallary_images');
    }
};
