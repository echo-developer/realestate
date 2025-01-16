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
        Schema::create('pref_project_additional', function (Blueprint $table) {
            $table->integer('project_id');
            $table->enum('main_road_facing', ['Y', 'N']);
            $table->enum('parking_availability', ['available', 'not_available', 'under_construction']);
            $table->bigInteger('project_amenity');
            $table->string('possession_status');

            $table->varchar('currency');
            $table->integer('token_amount');
            $table->integer('expected_price');
            $table->longText('developer_details');
            $table->varchar('developer_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_project_additional');
    }
};
