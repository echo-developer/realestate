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
        Schema::create('pref_project', function (Blueprint $table) {
            $table->id();
            $table->integer('uid')->nullable();
            $table->string('project_name')->nullable();
            $table->string('slug')->nullable();
            $table->longtext('project_desc')->nullable();
            $table->integer('status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_project');
    }
};
