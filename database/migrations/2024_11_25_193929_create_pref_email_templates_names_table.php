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
        Schema::create('pref_email_templates_names', function (Blueprint $table) {
            $table->unique(['email_template_id','lang']);
            $table->integer('email_template_id');
            $table->string('lang', 2);
            $table->string('subject');
            $table->text('content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_email_templates_names');
    }
};
