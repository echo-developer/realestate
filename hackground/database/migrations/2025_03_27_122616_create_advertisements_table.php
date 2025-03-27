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
        Schema::create('advertisements', function (Blueprint $table) {
            $table->id('advertisement_id');
            $table->integer('request_id');
            $table->integer('package_id');
            $table->integer('member_id');
            $table->string('ad_image', 155);
            $table->string('ad_image_mobile', 155);
            $table->text('ad_code');
            $table->string('ad_url',255);
            $table->string('ad_size',50);
            $table->string('ad_type',90);
            $table->string('page',70);
            $table->string('position',70);
            $table->dateTime('start_date');
            $table->dateTime('expire_date');
            $table->tinyInteger('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisements');
    }
};
