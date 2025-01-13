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
        Schema::create('property_review_additional', function (Blueprint $table) {
            $table->id();
            $table->integer('review-id');
            $table->string('review_title')->nullable();
            $table->text('review_description')->nullable();
            $table->string('user_relation')->nullable();
            $table->integer('status')->nullable();
            $table->text('response')->nullable()->comment(`Admin or property owner's response to the review`);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_review_additional');
    }
};
