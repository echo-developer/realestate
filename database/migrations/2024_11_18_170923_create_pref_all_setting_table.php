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
        Schema::create('pref_all_setting', function (Blueprint $table) {

            $table->bigIncrements('id');
            $table->string('title', 150);
            $table->string('setting_key', 50);
            $table->text('setting_value');
            $table->tinyInteger('editable');
            $table->tinyInteger('deletable');
            $table->integer('display_order');
            $table->string('setting_group', 100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_all_setting');
    }
};
