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
        Schema::create(prefixed_table_name('project_properties'), function (Blueprint $table) {
            $table->integer('project_id');
            $table->string('tower_name');
            $table->integer('lift_no');
            $table->integer('floor_no');
            $table->integer('flats_per_floor');
            $table->integer('property_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_properties');
    }
};
