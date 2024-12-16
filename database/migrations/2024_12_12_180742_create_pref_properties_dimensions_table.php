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
        Schema::create('pref_properties_dimensions', function (Blueprint $table) {
            $table->id();
            $table->integer('pid')->nullable(); 
            $table->string('room_type')->nullable();
            $table->string('size')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_properties_dimensions');
    }
};
