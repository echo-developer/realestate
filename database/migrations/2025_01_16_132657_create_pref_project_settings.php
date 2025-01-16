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
        Schema::create('pref_project_settings', function (Blueprint $table) {
            $table->integer('project_id');
            $table->integer('project_budget');
            $table->enum('parking_availability', ['available', 'not_available', 'under_construction']);
            $table->integer('floor');
            $table->integer('carpet_area');
            $table->integer('super_area');
            $table->integer('total_units');
            $table->integer('project_furnish');
            $table->integer('project_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_project_settings');
    }
};
