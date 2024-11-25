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
        Schema::create('pref_testimonial_names', function (Blueprint $table) {
            $table->id();
            $table->integer('testimonial_id');
            $table->string('lang', 2); 
            $table->string('name');
            $table->string('subname');
            $table->string('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_testimonial_names');
    }
};
