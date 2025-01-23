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
        Schema::create('pref_property_reviews', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->nullable();
            $table->integer('property_id')->nullable();
            
            $table->decimal('overall_rating', 4, 1)->default(0);
            $table->integer('cleanliness_rate')->default(0);
            $table->integer('connectivity_rate')->default(0);
            $table->integer('hospital_rate')->default(0);
            $table->integer('market_rate')->default(0);
            $table->integer('neighborhood_rate')->default(0);
            $table->integer('parking_rate')->default(0);
            $table->integer('public_transport_rate')->default(0);
            $table->integer('restaurants_rate')->default(0);
            $table->integer('roads_rate')->default(0);
            $table->integer('safety_rate')->default(0);
            $table->integer('schools_rate')->default(0);
            $table->integer('traffic_rate')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_property_reviews');
    }
};
