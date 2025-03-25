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
        Schema::create('advertisement_packages', function (Blueprint $table) {
            $table->id('package_id');
            $table->string('page',90);
            $table->string('position',70);
            $table->string('size',70);
            $table->string('demo_image',155);
            $table->string('demo_image_mobile',155);
            $table->tinyInteger('creative')->default(1);
            $table->integer('duration')->comment('In weeks');
            $table->integer('inr_price');
            $table->integer('usd_price');
            $table->integer('inr_price_without_banner');
            $table->integer('usd_price_without_banner');
            $table->timestamps();
            $table->tinyInteger('status')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisement_packages');
    }
};
