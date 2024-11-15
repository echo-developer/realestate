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
        Schema::create('menu__management', function (Blueprint $table) {
            $table->increments('_menu_id')->unique();
            $table->string('_menu_name');
            $table->string('_menu_slug')->unique();
            $table->string('_menu_url');
            $table->string('_menu_icon')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu__management');
    }
};
