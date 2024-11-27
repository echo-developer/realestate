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
        Schema::create('pref_notification_templates', function (Blueprint $table) {
            $table->id();
            $table->integer('order'); 
            $table->string('template_for');
            $table->string('template_key')->unique();
            $table->string('all_template_keys');
            $table->boolean('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_notification_templates');
    }
};
