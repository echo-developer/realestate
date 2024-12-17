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
        Schema::create('pref_properties', function (Blueprint $table) {
            $table->id();
            $table->integer('uid'); 
            $table->string('slug')->nullable();
            $table->string('name')->nullable();
            $table->integer('status')->comment('0 = pending, 1 = published, 2 = draft, -1 = expired');
            $table->integer('is_featured')->default(0)->comment('0 = not featured, 1 = featured');
            $table->integer('is_deleted')->default(0)->comment('0 = not deleted, 1 = deleted');
            $table->integer('views')->default(0);
            $table->integer('is_populer')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_properties');
    }
};
