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
        Schema::create('advertisement_requests', function (Blueprint $table) {
            $table->id('request_id');
            $table->integer('package_id');
            $table->integer('member_id');
            $table->string('full_name', 90);
            $table->string('email', 90);
            $table->string('mobile', 30);
            $table->string('country', 20);
            $table->integer('state_id', 20);
            $table->integer('city_id', 20);
            $table->string('post_for', 50);
            $table->string('ad_page', 50);
            $table->string('ad_position', 50);
            $table->char('own_banner', 10)->default('N');
            $table->string('banner_image', 155);
            $table->string('banner_image_mobile', 155);
            $table->string('payment_type', 50);
            $table->string('payment_method', 70);
            $table->tinyInteger('payment_status')->default(0);
            $table->string('currency', 30);
            $table->integer('price', 30);
            $table->tinyInteger('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisement_requests');
    }
};
