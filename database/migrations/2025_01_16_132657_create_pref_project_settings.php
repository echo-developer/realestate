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
            $table->integer('project_id')->nullable();
            $table->integer('project_budget')->nullable();
            $table->enum('parking_availability', ['available', 'not_available', 'under_construction'])->nullable();
            $table->integer('floor')->nullable();
            $table->integer('carpet_area')->nullable();
            $table->integer('super_area')->nullable();
            $table->integer('total_units')->nullable();
            $table->integer('project_furnish')->nullable();
            $table->integer('project_type')->nullable();
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
