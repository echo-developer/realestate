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
        Schema::create('pref_notification_templates_names', function (Blueprint $table) {
            $table->integer('notification_template_id');
            $table->string('lang', 2);
            $table->text('content');
            
            $table->unique(['notification_template_id', 'lang'], 'notification_template_id_lang_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_notification_templates_names');
    }
};
