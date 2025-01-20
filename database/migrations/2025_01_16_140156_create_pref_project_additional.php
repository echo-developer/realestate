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
            $table->integer('project_id')->nullable();
            $table->enum('main_road_facing', ['Y', 'N'])->nullable();
            $table->longText('project_amenity')->nullable();
            $table->string('possession_status');
            $table->string('currency')->nullable();
            $table->integer('token_amount')->nullable();
            $table->integer('expected_price')->nullable();
            $table->longText('developer_details')->nullable();
            $table->string('developer_name')->nullable();
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
