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
        Schema::create('pref_locality_names', function (Blueprint $table) {
            $table->integer('locality_id');
            $table->string('lang', 2); 
            $table->string('name');
            $table->unique(['locality_id', 'lang']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_locality_names');
    }
};
