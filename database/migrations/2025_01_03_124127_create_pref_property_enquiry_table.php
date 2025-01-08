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
        Schema::create('pref_property_enquiry', function (Blueprint $table) {
            $table->increments('enquery_id');
            $table->integer('cid')->nullable();
            $table->integer('property_id')->nullable();
            $table->string('message')->nullable();
            $table->string('assign_to')->nullable()->comment('user_id, that property belongs to');
            $table->string('status')->nullable()->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_property_enquiry');
    }
};
