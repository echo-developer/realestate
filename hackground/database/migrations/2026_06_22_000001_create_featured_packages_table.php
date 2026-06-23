<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('featured_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->integer('duration_days')->default(30)->comment('How many days property stays featured');
            $table->integer('properties_count')->default(1)->comment('How many properties can be featured');
            $table->tinyInteger('status')->default(1)->comment('1=active, 0=inactive, 2=deleted');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('featured_packages');
    }
};
