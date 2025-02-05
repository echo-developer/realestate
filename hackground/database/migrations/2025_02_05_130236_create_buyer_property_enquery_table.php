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
        Schema::create('buyer_property_enquery', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->integer('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('location');
            $table->string('purchase_timeline')->nullable();
            $table->string('flat_type')->nullable();
            $table->integer('property_type')->nullable();
            $table->string('property_size')->nullable();
            $table->integer('max_budget')->nullable();
            $table->boolean('isPolicyAgreed')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buyer_property_enquery');
    }
};
