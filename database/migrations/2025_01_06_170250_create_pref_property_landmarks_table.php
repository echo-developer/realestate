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
        Schema::create('pref_property_landmarks', function (Blueprint $table) {
            $table->id();
            $table->integer('property_id')->nullable();
            $table->string('landmark_type')->nullable();
            $table->integer('landmark_type_count')->nullable();
            $table->string('landmark_details')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_property_landmarks');
    }
};
