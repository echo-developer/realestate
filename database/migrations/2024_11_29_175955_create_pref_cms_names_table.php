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
        Schema::create('pref_cms_names', function (Blueprint $table) {
            $table->integer('cms_id');
            $table->string('lang', 2)->nullable();
            $table->text('title');
            $table->text('content')->nullable();
            $table->text('meta_desc')->nullable();
            $table->text('meta_title')->nullable();
            $table->text('meta_keys')->nullable();
            
            $table->unique(['cms_id', 'lang']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_cms_names');
    }
};
