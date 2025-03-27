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
        Schema::create('advertisement_category', function (Blueprint $table) {
            $table->foreignId('advertisement_id')->constrained('advertisement','advertisement_id');
            $table->integer('property_category');
            $table->integer('property_sub_category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisement_category');
    }
};
