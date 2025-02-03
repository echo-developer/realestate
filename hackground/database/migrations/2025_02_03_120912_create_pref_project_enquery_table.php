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
        Schema::create('pref_project_enquery', function (Blueprint $table) {
            $table->increments('enquery_id');
            $table->string('cid')->nullable();
            $table->integer('project_id')->nullable();
            $table->string('message')->nullable();
            $table->integer('assign_to')->nullable();
            $table->integer('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pref_project_enquery');
    }
};
