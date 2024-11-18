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
        Schema::create('pref_admin_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('message', 255);
            $table->dateTime('created_date');
            $table->tinyInteger('read_status');
            $table->text('link')->nullable();
            $table->string('template_key', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_admin_notification');
    }
};
